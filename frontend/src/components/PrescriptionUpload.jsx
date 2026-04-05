import React, { useState } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import api from "../services/api";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const PrescriptionUpload = ({ user, onUploadSuccess }) => {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handlePrescriptionChange = (e) => {
    const file = e.target.files?.[0];
    resetStatus();

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setStatus("Only JPG and PNG images are allowed.", true);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setStatus(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`, true);
      return;
    }

    setPrescriptionFile(file);
    setPrescriptionPreview(URL.createObjectURL(file));
  };

  const setStatus = (msg, error = false) => {
    setUploadMessage(msg);
    setIsError(error);
  };

  const resetStatus = () => {
    setUploadMessage("");
    setIsError(false);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setPrescriptionFile(null);
    setPrescriptionPreview(null);
    resetStatus();
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    resetStatus();

    if (!user) {
      setStatus("Please login to upload prescriptions.", true);
      return;
    }
    if (!prescriptionFile) {
      setStatus("Please select a prescription image first.", true);
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("image", prescriptionFile);
      formData.append("notes", notes);
      // We don't necessarily need to append name/email if the backend
      // extracts them from the JWT token (req.user)
      formData.append("customerName", user.name);

      //  Points to consolidated backend route
      const { data } = await api.post("/prescriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("Prescription uploaded successfully!", false);

      // Reset Form on Success
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      setNotes("");

      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      console.error("Upload error:", err);
      setStatus(
        err.response?.data?.message || "Server error during upload.",
        true,
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div
      className="card shadow-sm border bg-white rounded-1 overflow-hidden h-100"
      style={{ borderColor: "#D5D9D9" }}
    >
      <div className="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center">
        <FileText size={20} style={{ color: "#007185" }} className="me-2" />
        <h5 className="mb-0 fw-bold fs-6" style={{ color: "#0F1111" }}>
          Upload Prescription
        </h5>
      </div>

      <div className="card-body p-4">
        <p className="text-muted small mb-4" style={{ color: "#565959" }}>
          Please upload a clear photo of your prescription. Our pharmacists will
          verify it before dispensing restricted medicines.
        </p>

        {/* Upload Area */}
        <div
          className={`upload-zone p-4 text-center transition-all ${
            prescriptionPreview ? "active-zone" : ""
          }`}
          onClick={() =>
            !uploadLoading && document.getElementById("pres-input").click()
          }
          style={{ cursor: "pointer", minHeight: "200px" }}
        >
          <input
            id="pres-input"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handlePrescriptionChange}
          />

          {!prescriptionPreview ? (
            <div className="py-3">
              <div
                className="rounded-circle d-inline-flex p-3 mb-3"
                style={{ backgroundColor: "#f0f2f2", color: "#565959" }}
              >
                <Upload size={32} />
              </div>
              <h6 className="fw-bold mb-1" style={{ color: "#0F1111" }}>
                Select Image File
              </h6>
              <p className="small text-muted mb-0">
                Drag & Drop or Click to browse
              </p>
              <small
                className="fw-medium"
                style={{ fontSize: "0.7rem", color: "#007185" }}
              >
                JPG, PNG up to {MAX_FILE_SIZE_MB}MB
              </small>
            </div>
          ) : (
            <div className="position-relative d-inline-block mt-2">
              <img
                src={prescriptionPreview}
                alt="Preview"
                className="rounded-1 shadow-sm border"
                style={{
                  height: "160px",
                  width: "160px",
                  objectFit: "cover",
                  borderColor: "#D5D9D9",
                }}
              />
              <button
                type="button"
                className="btn btn-sm bg-white border shadow-sm rounded-circle position-absolute top-0 start-100 translate-middle d-flex align-items-center justify-content-center hover-danger"
                onClick={clearSelection}
                style={{
                  width: "28px",
                  height: "28px",
                  borderColor: "#D5D9D9",
                  color: "#0F1111",
                }}
              >
                <X size={14} />
              </button>
              <div className="mt-3 small fw-bold" style={{ color: "#067D62" }}>
                <CheckCircle size={14} className="me-1" /> Ready to upload
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <form onSubmit={handleUploadPrescription} className="mt-4">
          <div className="mb-4">
            <label
              className="form-label small fw-bold mb-1"
              style={{ color: "#0F1111" }}
            >
              Pharmacist Notes (Optional)
            </label>
            <textarea
              className="form-control amazon-input shadow-none"
              placeholder="e.g., Please provide 10 tablets only..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={uploadLoading}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 fw-medium shadow-sm d-flex align-items-center justify-content-center gap-2 border-0"
            disabled={uploadLoading || !prescriptionFile}
            style={{
              backgroundColor: prescriptionFile ? "#FFD814" : "#f0f2f2",
              color: prescriptionFile ? "#0F1111" : "#888C8C",
              borderRadius: "8px",
            }}
          >
            {uploadLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ color: "#0F1111" }}
              ></span>
            ) : (
              <>Secure Upload</>
            )}
          </button>
        </form>

        {/* Status Messages */}
        {uploadMessage && (
          <div
            className="alert mt-3 small py-2 text-start border-0 rounded-1 d-flex align-items-center gap-2"
            style={{
              backgroundColor: isError ? "#fef0f0" : "#f2fcf5",
              color: isError ? "#B12704" : "#067D62",
              borderLeft: `4px solid ${isError ? "#B12704" : "#067D62"}`,
            }}
          >
            {uploadMessage}
          </div>
        )}
      </div>

      <style>{`
        .upload-zone { 
          border: 2px dashed #D5D9D9; 
          border-radius: 4px; 
          background-color: #FAFAFA;
        }
        .upload-zone:hover { 
          border-color: #007185; 
          background-color: #f0f2f2; 
        }
        .active-zone {
          border-color: #067D62 !important;
          background-color: #f2fcf5 !important;
          border-style: solid !important;
        }
        .hover-danger:hover { color: #B12704 !important; border-color: #B12704 !important; }
        .amazon-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.9rem; }
        .amazon-input:focus { border-color: #e47911 !important; box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PrescriptionUpload;
