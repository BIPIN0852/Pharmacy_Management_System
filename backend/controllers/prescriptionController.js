const Prescription = require("../models/prescriptionModel");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/sendEmail");
const { getEmailTemplate } = require("../utils/emailTemplates");

// -------------------------------------------------------------------
// 🩺 NEW: CREATE DIGITAL PRESCRIPTION (Doctor Action)
// -------------------------------------------------------------------
const createDigitalPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      items,
      notes,
      patientName,
      patientEmail,
    } = req.body;

    // 1. Basic Validation
    if (!patientId || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Patient and medicine items are required." });
    }

    // 2. Find the exact Doctor profile using the email/ID logic
    const doctorProfile = await Doctor.findOne({
      $or: [{ userId: req.user._id }, { email: req.user.email }],
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found." });
    }

    // 3. Create the Digital Prescription
    const prescription = await Prescription.create({
      user: patientId,
      doctor: doctorProfile._id,
      appointment: appointmentId || null,
      items: items, // Array of { medicine, customName, dosageInstructions, durationDays, quantity }
      notes: notes,
      customerName: patientName,
      customerEmail: patientEmail,
      status: "Approved", // Doctor-issued prescriptions are approved by default
      imageUrl: "digital",
    });

    // 4. AUTO-COMPLETE APPOINTMENT
    // If this was created linked to an appointment, update that appointment to "Completed"
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "completed", // Lowercase to match frontend checks
      });
    }

    res.status(201).json({
      success: true,
      message: "Digital prescription issued successfully!",
      prescription,
    });
  } catch (error) {
    console.error("Digital Prescription Error:", error);
    res
      .status(500)
      .json({ message: "Server Error creating digital prescription" });
  }
};

// -------------------------------------------------------------------
// 1. UPLOAD PRESCRIPTION (Customer)
// -------------------------------------------------------------------
const uploadPrescription = async (req, res) => {
  try {
    // req.file is provided by Multer
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image." });
    }

    // Create the public URL
    const imageUrl = `/uploads/prescriptions/${req.file.filename}`;

    const prescription = await Prescription.create({
      user: req.user._id,
      imageUrl: imageUrl, // Matches your schema field
      notes: req.body.notes,
      customerName: req.user.name,
      customerEmail: req.user.email,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Prescription uploaded successfully!",
      prescription,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error during upload" });
  }
};

// -------------------------------------------------------------------
// 2. GET MY PRESCRIPTIONS (Customer View - Explicit Route)
// -------------------------------------------------------------------
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id })
      .populate("doctor", "name speciality") // Added populate to show doctor info to patient
      .sort({
        createdAt: -1,
      });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// -------------------------------------------------------------------
// 3. GET ALL PRESCRIPTIONS (Dashboard & Shared View)
// -------------------------------------------------------------------
const getPrescriptions = async (req, res) => {
  try {
    const filter = {};

    // SECURITY FIX: If user is a customer, restrict to THEIR records only
    if (req.user.role === "customer") {
      filter.user = req.user._id;
    }

    // DOCTOR FILTER: If user is a doctor, show prescriptions THEY issued
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({
        $or: [{ userId: req.user._id }, { email: req.user.email }],
      });
      if (doctorProfile) {
        filter.doctor = doctorProfile._id;
      }
    }

    // Allow filtering by status if needed (e.g. ?status=Pending)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const prescriptions = await Prescription.find(filter)
      .populate("user", "name email phone")
      .populate("doctor", "name speciality") // Added populate for doctor details
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
};

// -------------------------------------------------------------------
// 4. UPDATE STATUS (Pharmacist Action)
// -------------------------------------------------------------------
const updatePrescriptionStatus = async (req, res) => {
  const { status, notes } = req.body;

  try {
    const prescription = await Prescription.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Update fields
    prescription.status = status;
    if (notes) prescription.notes = notes;
    await prescription.save();

    // ------------------------------------------
    // EMAIL NOTIFICATION LOGIC
    // ------------------------------------------
    if (prescription.user && prescription.user.email) {
      let emailSubject = "";
      let emailContent = "";

      if (status === "Approved") {
        emailSubject = "✅ Prescription Approved - Smart Pharmacy";
        emailContent = `
          <h3>Good news!</h3>
          <p>Your prescription submitted on <strong>${new Date(
            prescription.createdAt,
          ).toLocaleDateString()}</strong> has been <strong>APPROVED</strong>.</p>
          ${notes ? `<p><strong>Pharmacist Notes:</strong> ${notes}</p>` : ""}
          <p>You can now proceed to order your medicines via your dashboard.</p>
        `;
      } else if (status === "Rejected") {
        emailSubject = "❌ Prescription Rejected - Smart Pharmacy";
        emailContent = `
          <h3>Action Required</h3>
          <p>Your prescription submitted on <strong>${new Date(
            prescription.createdAt,
          ).toLocaleDateString()}</strong> has been <strong>REJECTED</strong>.</p>
          <p><strong>Reason:</strong> ${
            notes || "Image unclear or invalid."
          }</p>
          <p>Please upload a clearer image or a valid document.</p>
        `;
      }

      // Send the email if status changed to Approved or Rejected
      if (emailSubject) {
        try {
          // Check if getEmailTemplate exists, otherwise use raw HTML
          const htmlMessage =
            typeof getEmailTemplate === "function"
              ? getEmailTemplate(prescription.user.name, emailContent)
              : emailContent;

          await sendEmail({
            email: prescription.user.email,
            subject: emailSubject,
            message: htmlMessage,
          });
          console.log(`📧 Email sent to ${prescription.user.email}`);
        } catch (emailErr) {
          console.error("⚠️ Email failed:", emailErr.message);
        }
      }
    }

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      prescription,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server Error updating status" });
  }
};

// -------------------------------------------------------------------
// 5. DELETE PRESCRIPTION
// -------------------------------------------------------------------
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Delete the actual file from 'uploads' folder
    if (prescription.imageUrl && prescription.imageUrl !== "digital") {
      const filePath = path.join(__dirname, "..", prescription.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted file: ${filePath}`);
      }
    }

    await prescription.deleteOne();
    res.json({ message: "Prescription record deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error deleting record" });
  }
};

// @desc    Doctor fetches a specific patient's full prescription history
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Doctor/Admin)
const getPatientHistory = async (req, res) => {
  try {
    // Find ALL prescriptions belonging to this patient (both uploaded and doctor-issued)
    const prescriptions = await Prescription.find({
      user: req.params.patientId,
    })
      .populate("doctor", "name speciality")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ message: "Error fetching patient history" });
  }
};

module.exports = {
  createDigitalPrescription,
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus,
  deletePrescription,
  getPatientHistory,
};
