const Prescription = require("../models/prescriptionModel"); // ✅ FIXED: Matches your actual filename
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/sendEmail"); // Uses your global email utility
const { getEmailTemplate } = require("../utils/emailTemplates"); // Assumes you have this, otherwise basic HTML is used

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
// 2. GET MY PRESCRIPTIONS (Customer View)
// -------------------------------------------------------------------
const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history" });
  }
};

// -------------------------------------------------------------------
// 3. GET ALL PRESCRIPTIONS (Pharmacist View)
// -------------------------------------------------------------------
const getPrescriptions = async (req, res) => {
  try {
    const filter = {};
    // Allow filtering by status if needed (e.g. ?status=Pending)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const prescriptions = await Prescription.find(filter)
      .populate("user", "name email phone")
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
      "name email"
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
            prescription.createdAt
          ).toLocaleDateString()}</strong> has been <strong>APPROVED</strong>.</p>
          ${notes ? `<p><strong>Pharmacist Notes:</strong> ${notes}</p>` : ""}
          <p>You can now proceed to order your medicines via your dashboard.</p>
        `;
      } else if (status === "Rejected") {
        emailSubject = "❌ Prescription Rejected - Smart Pharmacy";
        emailContent = `
          <h3>Action Required</h3>
          <p>Your prescription submitted on <strong>${new Date(
            prescription.createdAt
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
          // We don't fail the request just because email failed
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

    // ✅ CLEANUP: Delete the actual file from 'uploads' folder
    if (prescription.imageUrl) {
      // Resolve path: goes up one level from 'controllers' to root, then to the image path
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

module.exports = {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus,
  deletePrescription,
};
