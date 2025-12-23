// backend/config/prescriptionUpload.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const prescDir = path.join(__dirname, "../uploads/prescriptions");

// Ensure folder exists
if (!fs.existsSync(prescDir)) {
  fs.mkdirSync(prescDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, prescDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpeg";
    cb(null, `presc-${unique}${ext}`);
  },
});

const uploadPrescription = multer({ storage });

module.exports = { uploadPrescription };
