// // backend/routes/prescriptions.js
// const express = require("express");
// const Prescription = require("../models/Prescription");
// const authenticateToken = require("../middleware/auth");
// const Prescription = require('../models/prescription.model');

// const router = express.Router();

// // Get all prescriptions (admin + pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const prescriptions = await Prescription.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get prescriptions for current customer
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get my prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Create/upload prescription (customer)
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const {
//       customerName,
//       customerEmail,
//       doctor,
//       appointment,
//       items,
//       imageUrl,
//       notes,
//     } = req.body;

//     if (!customerName || !customerEmail) {
//       return res
//         .status(400)
//         .json({ message: "Customer name and email are required." });
//     }

//     const prescription = new Prescription({
//       customer: req.user.id,
//       customerName,
//       customerEmail,
//       doctor,
//       appointment,
//       items,
//       imageUrl,
//       notes,
//       status: "pending",
//     });

//     await prescription.save();
//     res.status(201).json(prescription);
//   } catch (err) {
//     console.error("create prescription error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update prescription status (admin/pharmacist)
// router.patch("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     const allowed = [
//       "pending",
//       "reviewed",
//       "approved",
//       "rejected",
//       "dispensed",
//     ];
//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

//     const prescription = await Prescription.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found." });
//     }

//     res.json(prescription);
//   } catch (err) {
//     console.error("update prescription status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Prescription = require("../models/prescription.model");
// const authenticateToken = require("../middleware/auth");

// const router = express.Router();

// // Get all prescriptions (admin + pharmacist)
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const prescriptions = await Prescription.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Get prescriptions for current customer
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get my prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Create/upload prescription (customer)
// router.post("/", authenticateToken, async (req, res) => {
//   try {
//     const {
//       customerName,
//       customerEmail,
//       doctor,
//       appointment,
//       items,
//       imageUrl,
//       notes,
//     } = req.body;

//     if (!customerName || !customerEmail) {
//       return res
//         .status(400)
//         .json({ message: "Customer name and email are required." });
//     }

//     const prescription = new Prescription({
//       customer: req.user.id,
//       customerName,
//       customerEmail,
//       doctor,
//       appointment,
//       items,
//       imageUrl,
//       notes,
//       status: "pending",
//     });

//     await prescription.save();
//     res.status(201).json(prescription);
//   } catch (err) {
//     console.error("create prescription error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update prescription status (admin/pharmacist)
// router.patch("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     const allowed = [
//       "pending",
//       "reviewed",
//       "approved",
//       "rejected",
//       "dispensed",
//     ];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

//     const prescription = await Prescription.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found." });
//     }

//     res.json(prescription);
//   } catch (err) {
//     console.error("update prescription status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Prescription = require("../models/prescription.model");
// const authenticateToken = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // -------- Multer setup for image upload --------
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/prescriptions"); // make sure this folder exists
//   },
//   filename(req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, `presc-${Date.now()}${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only JPG and PNG images are allowed"), false);
// };

// const upload = multer({ storage, fileFilter });

// // ---------- Get all prescriptions (admin + pharmacist) ----------
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const prescriptions = await Prescription.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Get prescriptions for current customer ----------
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get my prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Create/upload prescription (customer with image) ----------
// router.post(
//   "/",
//   authenticateToken,
//   upload.single("image"), // field name must match formData.append("image", ...)
//   async (req, res) => {
//     try {
//       const { customerName, customerEmail, doctor, appointment, items, notes } =
//         req.body;

//       if (!customerName || !customerEmail) {
//         return res
//           .status(400)
//           .json({ message: "Customer name and email are required." });
//       }

//       if (!req.file) {
//         return res
//           .status(400)
//           .json({ message: "Prescription image file is required." });
//       }

//       const imageUrl = `/uploads/prescriptions/${req.file.filename}`;

//       const prescription = new Prescription({
//         customer: req.user.id,
//         customerName,
//         customerEmail,
//         doctor: doctor || null,
//         appointment: appointment || null,
//         items: items || [],
//         imageUrl,
//         notes,
//         status: "pending",
//       });

//       await prescription.save();
//       res.status(201).json(prescription);
//     } catch (err) {
//       console.error("create prescription error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------- Update prescription status (admin/pharmacist) ----------
// router.patch("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     const allowed = [
//       "pending",
//       "reviewed",
//       "approved",
//       "rejected",
//       "dispensed",
//     ];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

//     const prescription = await Prescription.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found." });
//     }

//     res.json(prescription);
//   } catch (err) {
//     console.error("update prescription status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Prescription = require("../models/prescription.model");
// const authenticateToken = require("../middleware/auth");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // -------- Multer setup for image upload --------
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "uploads/prescriptions");
//   },
//   filename(req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, `presc-${Date.now()}-${req.user.id}${ext}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only JPG and PNG images are allowed"), false);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // ---------- Get all prescriptions (admin + pharmacist) ----------
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const prescriptions = await Prescription.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- NEW: Pharmacist dashboard route ----------
// router.get("/pharmacist/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const prescriptions = await Prescription.find({ status: "pending" })
//       .populate("customer", "name email")
//       .select("customerName customerEmail imageUrl status createdAt")
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("pharmacist prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Get prescriptions for current customer ----------
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get my prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Create/upload prescription (customer with image) ----------
// router.post(
//   "/",
//   authenticateToken,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { customerName, customerEmail, notes } = req.body;

//       if (!customerName || !customerEmail) {
//         return res.status(400).json({
//           message: "Customer name and email are required.",
//         });
//       }

//       if (!req.file) {
//         return res.status(400).json({
//           message: "Prescription image file is required.",
//         });
//       }

//       const imageUrl = `/uploads/prescriptions/${req.file.filename}`;

//       const prescription = new Prescription({
//         customer: req.user.id,
//         customerName,
//         customerEmail,
//         imageUrl,
//         notes: notes || "",
//         status: "pending",
//       });

//       await prescription.save();
//       res.status(201).json(prescription);
//     } catch (err) {
//       console.error("create prescription error:", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------- Update prescription status (admin/pharmacist) ----------
// router.patch("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     const allowed = [
//       "pending",
//       "reviewed",
//       "approved",
//       "rejected",
//       "dispensed",
//     ];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

//     const prescription = await Prescription.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found." });
//     }

//     res.json(prescription);
//   } catch (err) {
//     console.error("update prescription status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

// const express = require("express");
// const Prescription = require("../models/prescription.model");
// const authenticateToken = require("../middleware/auth");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// const router = express.Router();

// // -------- Ensure uploads directory exists --------
// const uploadsDir = path.join(__dirname, "../uploads/prescriptions");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
//   console.log("✅ Created uploads/prescriptions directory");
// }

// // -------- Multer setup for image upload --------
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, uploadsDir); // ✅ Absolute path
//   },
//   filename(req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `presc-${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only JPG, JPEG and PNG images are allowed"), false);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // ---------- Get all prescriptions (admin + pharmacist) ----------
// router.get("/", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const prescriptions = await Prescription.find()
//       .populate("customer", "name email")
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- NEW: Pharmacist dashboard route ----------
// router.get("/pharmacist/prescriptions", authenticateToken, async (req, res) => {
//   try {
//     if (!["pharmacist", "admin"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const prescriptions = await Prescription.find({ status: "pending" })
//       .populate("customer", "name email")
//       .select("customerName customerEmail imageFilename status createdAt")
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("pharmacist prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Get prescriptions for current customer ----------
// router.get("/my", authenticateToken, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ customer: req.user.id })
//       .populate("doctor", "name speciality")
//       .sort({ createdAt: -1 });

//     res.json(prescriptions);
//   } catch (err) {
//     console.error("get my prescriptions error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Serve prescription image safely ----------
// router.get("/image/:filename", (req, res) => {
//   try {
//     const filePath = path.join(uploadsDir, req.params.filename);

//     // ✅ Check if file exists before serving
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: "Prescription image not found" });
//     }

//     res.sendFile(filePath);
//   } catch (err) {
//     console.error("serve prescription image error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ---------- Create/upload prescription (customer with image) ----------
// router.post(
//   "/",
//   authenticateToken,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { customerName, customerEmail, notes } = req.body;

//       if (!customerName || !customerEmail) {
//         return res.status(400).json({
//           message: "Customer name and email are required.",
//         });
//       }

//       if (!req.file) {
//         return res.status(400).json({
//           message: "Prescription image file is required.",
//         });
//       }

//       // ✅ Store ONLY filename in DB, not full path
//       const imageFilename = req.file.filename;

//       const prescription = new Prescription({
//         customer: req.user.id,
//         customerName,
//         customerEmail,
//         imageFilename, // ✅ Changed from imageUrl to imageFilename
//         notes: notes || "",
//         status: "pending",
//       });

//       await prescription.save();
//       res.status(201).json(prescription);
//     } catch (err) {
//       console.error("create prescription error:", err);

//       // ✅ Clean up uploaded file if DB save fails
//       if (req.file) {
//         const failedFilePath = path.join(uploadsDir, req.file.filename);
//         if (fs.existsSync(failedFilePath)) {
//           fs.unlinkSync(failedFilePath);
//         }
//       }

//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// // ---------- Update prescription status (admin/pharmacist) ----------
// router.patch("/:id/status", authenticateToken, async (req, res) => {
//   try {
//     if (!["admin", "pharmacist"].includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied." });
//     }

//     const { status } = req.body;
//     const allowed = [
//       "pending",
//       "reviewed",
//       "approved",
//       "rejected",
//       "dispensed",
//     ];

//     if (!allowed.includes(status)) {
//       return res.status(400).json({ message: "Invalid status value." });
//     }

//     const prescription = await Prescription.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found." });
//     }

//     res.json(prescription);
//   } catch (err) {
//     console.error("update prescription status error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;

const express = require("express");
const Prescription = require("../models/prescription.model");
const authenticateToken = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// -------- Ensure uploads directory exists --------
const uploadsDir = path.join(__dirname, "../uploads/prescriptions");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads/prescriptions directory");
}

// -------- Multer setup for image upload --------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `presc-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG, JPEG and PNG images are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ---------- Get all prescriptions (admin + pharmacist) ----------
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const prescriptions = await Prescription.find()
      .populate("customer", "name email")
      .populate("doctor", "name speciality")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error("get prescriptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Pharmacist dashboard route (DEBUG READY) ----------
router.get("/pharmacist/prescriptions", authenticateToken, async (req, res) => {
  try {
    console.log("🔍 Pharmacist role:", req.user.role); // 🔍 DEBUG

    if (!["pharmacist", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    console.log("🔍 Looking for pending prescriptions..."); // 🔍 DEBUG

    const prescriptions = await Prescription.find({ status: "pending" })
      .populate("customer", "name email")
      .select("customerName customerEmail imageFilename status createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    console.log(
      `✅ Pharmacist dashboard: Found ${prescriptions.length} pending prescriptions`
    ); // 🔍 DEBUG
    console.log(
      "🔍 First prescription:",
      prescriptions[0] ? prescriptions[0].customerName : "None"
    ); // 🔍 DEBUG

    res.json(prescriptions);
  } catch (err) {
    console.error("❌ pharmacist prescriptions error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ---------- Get prescriptions for current customer ----------
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ customer: req.user.id })
      .populate("doctor", "name speciality")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error("get my prescriptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Serve prescription image safely ----------
router.get("/image/:filename", (req, res) => {
  try {
    const filePath = path.join(uploadsDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Prescription image not found" });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("serve prescription image error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- Create/upload prescription (customer with image) ----------
router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { customerName, customerEmail, notes } = req.body;

      if (!customerName || !customerEmail) {
        return res.status(400).json({
          message: "Customer name and email are required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Prescription image file is required.",
        });
      }

      const imageFilename = req.file.filename;

      console.log("📤 Uploading prescription:", {
        customerName,
        imageFilename,
      }); // 🔍 DEBUG

      const prescription = new Prescription({
        customer: req.user.id,
        customerName,
        customerEmail,
        imageFilename,
        notes: notes || "",
        status: "pending",
      });

      await prescription.save();
      console.log("✅ Prescription saved:", prescription._id); // 🔍 DEBUG

      res.status(201).json(prescription);
    } catch (err) {
      console.error("❌ create prescription error:", err);

      if (req.file) {
        const failedFilePath = path.join(uploadsDir, req.file.filename);
        if (fs.existsSync(failedFilePath)) {
          fs.unlinkSync(failedFilePath);
        }
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

// ---------- Update prescription status (admin/pharmacist) ----------
router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }

    const { status } = req.body;
    const allowed = [
      "pending",
      "reviewed",
      "approved",
      "rejected",
      "dispensed",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found." });
    }

    res.json(prescription);
  } catch (err) {
    console.error("update prescription status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
