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

import React, { useState } from "react";
import { Upload } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const PrescriptionUpload = ({ user, onUploadSuccess }) => {
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const handlePrescriptionChange = (e) => {
    const file = e.target.files?.[0];
    setUploadMessage("");

    if (!file) {
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadMessage("Only JPG and PNG images are allowed.");
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadMessage(`File must be smaller than ${MAX_FILE_SIZE_MB} MB.`);
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
      return;
    }

    setPrescriptionFile(file);
    setPrescriptionPreview(URL.createObjectURL(file));
  };

  const handleUploadPrescription = async (e) => {
    e.preventDefault();
    setUploadMessage("");

    if (!user?.name || !user?.email) {
      setUploadMessage("User details missing. Please login again.");
      return;
    }
    if (!prescriptionFile) {
      setUploadMessage("Please select a prescription image first.");
      return;
    }

    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setUploadMessage("Please login again. Token missing.");
        setUploadLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", prescriptionFile);
      formData.append("notes", notes);
      formData.append("customerName", user.name);
      formData.append("customerEmail", user.email);

      const res = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // do NOT set Content-Type
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUploadMessage(data.message || "Failed to upload prescription.");
      } else {
        setUploadMessage("Prescription uploaded successfully.");
        setPrescriptionFile(null);
        setPrescriptionPreview(null);
        setNotes("");
        if (onUploadSuccess) onUploadSuccess(data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Something went wrong while uploading prescription.");
    } finally {
      setUploadLoading(false);
    }
  };

  const triggerFileInput = () => {
    const input = document.getElementById("prescription-file");
    if (input) input.click();
  };

  return (
    <section className="bg-white rounded-3 p-4 shadow-sm h-100">
      <h2 className="mb-3 fs-5 fw-semibold">Upload Doctor’s Prescription</h2>
      <p className="text-muted small mb-3">
        Upload a clear photo or scan of your prescription. Our pharmacist will
        verify it before dispensing medicines.
      </p>

      <div
        className="border border-primary border-dashed rounded-3 d-flex flex-column align-items-center justify-content-center p-4 cursor-pointer text-center"
        role="button"
        tabIndex={0}
        onClick={triggerFileInput}
        onKeyPress={(e) => e.key === "Enter" && triggerFileInput()}
      >
        <Upload size={40} color="#3b82f6" />
        <p className="mt-2 text-secondary mb-1">
          Click to select a prescription image (JPG, PNG)
        </p>
        <small className="text-muted">
          Max size {MAX_FILE_SIZE_MB} MB. One image per upload.
        </small>
        <input
          id="prescription-file"
          type="file"
          accept="image/*"
          className="d-none"
          onChange={handlePrescriptionChange}
        />
        {prescriptionPreview && (
          <img
            src={prescriptionPreview}
            alt="Prescription preview"
            className="mt-3 rounded-3 shadow"
            style={{
              maxWidth: "180px",
              maxHeight: "180px",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      <form
        onSubmit={handleUploadPrescription}
        className="mt-3 d-flex flex-column gap-2"
      >
        <textarea
          className="form-control"
          placeholder="Notes for pharmacist (optional)"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary rounded-pill"
          disabled={uploadLoading}
        >
          {uploadLoading ? "Uploading..." : "Upload Prescription"}
        </button>
      </form>

      {uploadMessage && (
        <div
          className={`mt-2 small ${
            uploadMessage.toLowerCase().includes("success")
              ? "text-success"
              : "text-danger"
          }`}
        >
          {uploadMessage}
        </div>
      )}
    </section>
  );
};

export default PrescriptionUpload;
