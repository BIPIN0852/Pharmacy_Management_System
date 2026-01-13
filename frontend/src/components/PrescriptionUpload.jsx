// import React, { useState } from "react";
// import { Upload } from "lucide-react";

// const API_BASE_URL = "http://localhost:5000/api";

// const PrescriptionUpload = ({ user, onUploadSuccess }) => {
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");
//     setPrescriptionFile(file || null);
//     if (file) {
//       setPrescriptionPreview(URL.createObjectURL(file));
//     } else {
//       setPrescriptionPreview(null);
//     }
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setUploadMessage("Please login again. Token missing.");
//         setUploadLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully.");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//         if (onUploadSuccess) onUploadSuccess();
//       }
//     } catch (err) {
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   return (
//     <section className="bg-white rounded-3 p-4 shadow-sm">
//       <h2 className="mb-3">Upload Doctor’s Prescription</h2>

//       <div
//         className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4 cursor-pointer"
//         role="button"
//         tabIndex={0}
//         onClick={() => document.getElementById("prescription-file")?.click()}
//         onKeyPress={(e) =>
//           e.key === "Enter" &&
//           document.getElementById("prescription-file")?.click()
//         }
//       >
//         <Upload size={40} color="#3b82f6" />
//         <p className="mt-2 text-secondary">
//           Click to select a prescription image (JPG, PNG)
//         </p>
//         <input
//           id="prescription-file"
//           type="file"
//           accept="image/*"
//           className="d-none"
//           onChange={handlePrescriptionChange}
//         />
//         {prescriptionPreview && (
//           <img
//             src={prescriptionPreview}
//             alt="Prescription preview"
//             className="mt-3 rounded-3 shadow"
//             style={{
//               maxWidth: "160px",
//               maxHeight: "160px",
//               objectFit: "cover",
//             }}
//           />
//         )}
//       </div>

//       <form
//         onSubmit={handleUploadPrescription}
//         className="mt-3 d-flex flex-column gap-2"
//       >
//         <textarea
//           className="form-control"
//           placeholder="Notes for pharmacist (optional)"
//           rows={4}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="btn btn-primary rounded-pill"
//           disabled={uploadLoading}
//         >
//           {uploadLoading ? "Uploading..." : "Upload Prescription"}
//         </button>
//       </form>
//       {uploadMessage && (
//         <div
//           className={`mt-2 small ${
//             uploadMessage.includes("success") ? "text-success" : "text-danger"
//           }`}
//         >
//           {uploadMessage}
//         </div>
//       )}
//     </section>
//   );
// };

// export default PrescriptionUpload;

// import React, { useState } from "react";
// import { Upload } from "lucide-react";

// const API_BASE_URL = "http://localhost:5000/api";

// const MAX_FILE_SIZE_MB = 5;
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// const PrescriptionUpload = ({ user, onUploadSuccess }) => {
//   const [prescriptionFile, setPrescriptionFile] = useState(null);
//   const [prescriptionPreview, setPrescriptionPreview] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadLoading, setUploadLoading] = useState(false);

//   const handlePrescriptionChange = (e) => {
//     const file = e.target.files?.[0];
//     setUploadMessage("");

//     if (!file) {
//       setPrescriptionFile(null);
//       setPrescriptionPreview(null);
//       return;
//     }

//     if (!ALLOWED_TYPES.includes(file.type)) {
//       setUploadMessage("Only JPG and PNG images are allowed.");
//       setPrescriptionFile(null);
//       setPrescriptionPreview(null);
//       return;
//     }

//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//       setUploadMessage(`File must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
//       setPrescriptionFile(null);
//       setPrescriptionPreview(null);
//       return;
//     }

//     setPrescriptionFile(file);
//     setPrescriptionPreview(URL.createObjectURL(file));
//   };

//   const handleUploadPrescription = async (e) => {
//     e.preventDefault();
//     setUploadMessage("");

//     if (!user?.name || !user?.email) {
//       setUploadMessage("User details missing. Please login again.");
//       return;
//     }
//     if (!prescriptionFile) {
//       setUploadMessage("Please select a prescription image first.");
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setUploadMessage("Please login again. Token missing.");
//         setUploadLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("image", prescriptionFile);
//       formData.append("notes", notes);
//       formData.append("customerName", user.name);
//       formData.append("customerEmail", user.email);

//       const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`, // do NOT set Content-Type
//         },
//         body: formData,
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         setUploadMessage(data.message || "Failed to upload prescription.");
//       } else {
//         setUploadMessage("Prescription uploaded successfully.");
//         setPrescriptionFile(null);
//         setPrescriptionPreview(null);
//         setNotes("");
//         if (onUploadSuccess) onUploadSuccess(data);
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       setUploadMessage("Something went wrong while uploading prescription.");
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const triggerFileInput = () => {
//     const input = document.getElementById("prescription-file");
//     if (input) input.click();
//   };

//   return (
//     <section className="bg-white rounded-3 p-4 shadow-sm h-100">
//       <h2 className="mb-3 fs-5 fw-semibold">Upload Doctor’s Prescription</h2>
//       <p className="text-muted small mb-3">
//         Upload a clear photo or scan of your prescription. Our pharmacist will
//         verify it before dispensing medicines.
//       </p>

//       <div
//         className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4 cursor-pointer text-center"
//         role="button"
//         tabIndex={0}
//         onClick={triggerFileInput}
//         onKeyPress={(e) => e.key === "Enter" && triggerFileInput()}
//       >
//         <Upload size={40} color="#3b82f6" />
//         <p className="mt-2 text-secondary mb-1">
//           Click to select a prescription image (JPG, PNG)
//         </p>
//         <small className="text-muted">
//           Max size {MAX_FILE_SIZE_MB} MB. One image per upload.
//         </small>
//         <input
//           id="prescription-file"
//           type="file"
//           accept="image/*"
//           className="d-none"
//           onChange={handlePrescriptionChange}
//         />
//         {prescriptionPreview && (
//           <img
//             src={prescriptionPreview}
//             alt="Prescription preview"
//             className="mt-3 rounded-3 shadow"
//             style={{
//               maxWidth: "180px",
//               maxHeight: "180px",
//               objectFit: "cover",
//             }}
//           />
//         )}
//       </div>

//       <form
//         onSubmit={handleUploadPrescription}
//         className="mt-3 d-flex flex-column gap-2"
//       >
//         <textarea
//           className="form-control"
//           placeholder="Notes for pharmacist (optional)"
//           rows={4}
//           value={notes}
//           onChange={(e) => setNotes(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="btn btn-primary rounded-pill"
//           disabled={uploadLoading}
//         >
//           {uploadLoading ? "Uploading..." : "Upload Prescription"}
//         </button>
//       </form>

//       {uploadMessage && (
//         <div
//           className={`mt-2 small ${
//             uploadMessage.toLowerCase().includes("success")
//               ? "text-success"
//               : "text-danger"
//           }`}
//         >
//           {uploadMessage}
//         </div>
//       )}
//     </section>
//   );
// };

// export default PrescriptionUpload;

import React, { useState } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import api from "../services/api"; // ✅ Use your Axios instance

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

      // ✅ UPDATED: Points to consolidated backend route
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
        true
      );
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <div className="card-header bg-primary py-3">
        <h5 className="mb-0 text-white d-flex align-items-center fw-bold">
          <FileText size={20} className="me-2" />
          Upload Prescription
        </h5>
      </div>

      <div className="card-body p-4">
        <p className="text-muted small mb-4">
          Please upload a clear photo of your prescription. Our pharmacists will
          verify it before dispensing restricted medicines.
        </p>

        {/* Upload Area */}
        <div
          className={`upload-zone border-2 border-dashed rounded-4 p-4 text-center transition-all ${
            prescriptionPreview
              ? "border-success bg-success bg-opacity-10"
              : "border-primary-subtle bg-light"
          }`}
          onClick={() =>
            !prescriptionLoading &&
            document.getElementById("pres-input").click()
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
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <Upload size={32} className="text-primary" />
              </div>
              <h6 className="fw-bold text-dark">Select Image File</h6>
              <p className="small text-muted mb-0">
                Drag & Drop or Click to browse
              </p>
              <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                JPG, PNG up to {MAX_FILE_SIZE_MB}MB
              </small>
            </div>
          ) : (
            <div className="position-relative d-inline-block">
              <img
                src={prescriptionPreview}
                alt="Preview"
                className="img-thumbnail rounded-3 shadow-sm"
                style={{ height: "150px", width: "150px", objectFit: "cover" }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm rounded-circle position-absolute top-0 start-100 translate-middle shadow"
                onClick={clearSelection}
              >
                <X size={14} />
              </button>
              <div className="mt-2 text-success small fw-bold">
                <CheckCircle size={14} className="me-1" /> Ready to upload
              </div>
            </div>
          )}
        </div>

        {/* Form Section */}
        <form onSubmit={handleUploadPrescription} className="mt-4">
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted text-uppercase">
              Pharmacist Notes
            </label>
            <textarea
              className="form-control border-light-subtle"
              placeholder="e.g., Please provide 10 tablets only..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={uploadLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
            disabled={uploadLoading || !prescriptionFile}
          >
            {uploadLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
              ></span>
            ) : (
              <>Upload Now</>
            )}
          </button>
        </form>

        {/* Status Messages */}
        {uploadMessage && (
          <div
            className={`alert mt-3 small py-2 text-center border-0 ${
              isError ? "alert-danger" : "alert-success"
            }`}
          >
            {uploadMessage}
          </div>
        )}
      </div>

      <style>{`
        .upload-zone:hover { border-color: #0d6efd !important; background-color: #f0f7ff !important; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default PrescriptionUpload;
