// import React, { useState } from "react";
// import api from "../../services/api";
// import { UserPlus, Phone, Mail, Lock, ShieldCheck } from "lucide-react";

// const AdminCreateUser = ({ onUserCreated }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "", // ✅ Added phone field
//     role: "pharmacist",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // ✅ Call the specific admin-creation endpoint
//       await api.post("/users/admin-create", formData);
//       alert("Staff User Created Successfully");

//       // Reset form after success
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         role: "pharmacist",
//       });

//       if (onUserCreated) onUserCreated(); // Refresh the parent list
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create user");
//     }
//   };

//   return (
//     <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
//       <div className="card-header bg-primary text-white p-3 border-0">
//         <h6 className="mb-0 d-flex align-items-center gap-2">
//           <UserPlus size={18} /> Add New Staff Member
//         </h6>
//       </div>
//       <div className="card-body p-4 bg-light bg-opacity-50">
//         <form onSubmit={handleSubmit}>
//           <div className="row g-3">
//             {/* Full Name */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">Full Name</label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <User size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email Address */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Email Address
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Mail size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="staff@pharma.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* ✅ NEW: Contact Number */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Contact Number
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Phone size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="+977-98XXXXXXXX"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Temporary Password
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Lock size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="Min 6 characters"
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Role Selection */}
//             <div className="col-md-12">
//               <label className="small fw-bold text-muted mb-1">
//                 Staff Role
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <ShieldCheck size={16} />
//                 </span>
//                 <select
//                   className="form-select border-start-0"
//                   value={formData.role}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                 >
//                   <option value="pharmacist">Pharmacist</option>
//                   <option value="staff">General Staff</option>
//                 </select>
//               </div>
//             </div>

//             <div className="col-md-12 mt-4">
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
//               >
//                 Register Staff Account
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminCreateUser;

// import React, { useState } from "react";
// import api from "../../services/api";
// // ✅ Fixed: Added 'User' to the imports to resolve the ReferenceError
// import { UserPlus, Phone, Mail, Lock, ShieldCheck, User } from "lucide-react";

// const AdminCreateUser = ({ onUserCreated }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "pharmacist",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/users/admin-create", formData);
//       alert("Staff User Created Successfully");

//       // Reset form after success
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         role: "pharmacist",
//       });

//       if (onUserCreated) onUserCreated();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create user");
//     }
//   };

//   return (
//     <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
//       <div className="card-header bg-primary text-white p-3 border-0">
//         <h6 className="mb-0 d-flex align-items-center gap-2">
//           <UserPlus size={18} /> Add New Staff Member
//         </h6>
//       </div>
//       <div className="card-body p-4 bg-light bg-opacity-50">
//         <form onSubmit={handleSubmit}>
//           <div className="row g-3">
//             {/* Full Name */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">Full Name</label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <User size={16} /> {/* ✅ This icon now works */}
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="e.g. John Doe"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email Address */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Email Address
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Mail size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="staff@pharma.com"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Contact Number */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Contact Number
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Phone size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="+977-98XXXXXXXX"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="col-md-6">
//               <label className="small fw-bold text-muted mb-1">
//                 Temporary Password
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <Lock size={16} />
//                 </span>
//                 <input
//                   className="form-control border-start-0"
//                   placeholder="Min 6 characters"
//                   type="password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Role Selection */}
//             <div className="col-md-12">
//               <label className="small fw-bold text-muted mb-1">
//                 Staff Role
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <ShieldCheck size={16} />
//                 </span>
//                 <select
//                   className="form-select border-start-0"
//                   value={formData.role}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value })
//                   }
//                 >
//                   <option value="pharmacist">Pharmacist</option>
//                   <option value="staff">General Staff</option>
//                 </select>
//               </div>
//             </div>

//             <div className="col-md-12 mt-4">
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
//               >
//                 Register Staff Account
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminCreateUser;

// import React, { useState } from "react";
// import {
//   UserPlus,
//   User,
//   Mail,
//   Phone,
//   Shield,
//   Lock,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Stethoscope, // ✅ Added icon for Doctor speciality
// } from "lucide-react";

// // Point to the correct base API URL
// const API_BASE_URL = "http://localhost:5000/api";

// const AdminCreateUser = ({ onUserCreated }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("staff");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // ✅ New state specifically for doctors
//   const [speciality, setSpeciality] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     // Basic Validation
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     // If role is doctor, ensure speciality is filled (optional, but good practice)
//     if (role === "doctor" && !speciality) {
//       setError("Please provide a medical speciality for the doctor.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Payload building
//       const payload = { name, email, password, role, phone };
//       if (role === "doctor") {
//         payload.speciality = speciality;
//       }

//       const res = await fetch(`${API_BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to create user.");
//       } else {
//         setMessage(`User (${role}) created successfully!`);

//         // Refresh the table on the right side
//         if (onUserCreated) onUserCreated();

//         // Clear Form
//         setName("");
//         setEmail("");
//         setPhone("");
//         setRole("staff");
//         setPassword("");
//         setConfirmPassword("");
//         setSpeciality("");
//       }
//     } catch (err) {
//       console.error("Create User Error:", err);
//       setError("Something went wrong. Is the backend running?");
//     } finally {
//       setLoading(false);
//       // Auto-hide success message after 3 seconds
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   return (
//     <div className="h-100 d-flex flex-column animate-fade-in">
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden flex-grow-1 bg-white">
//         {/* --- HEADER SECTION --- */}
//         <div className="card-header bg-transparent border-0 pt-4 pb-2 text-center">
//           <div
//             className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 shadow-sm"
//             style={{
//               width: "60px",
//               height: "60px",
//               background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // Matches primary gradient
//             }}
//           >
//             <UserPlus size={28} strokeWidth={2.5} />
//           </div>
//           <h4 className="fw-bolder text-dark mb-1 tracking-tight">
//             Create New User
//           </h4>
//           <p className="text-muted small px-3 fw-medium">
//             Add a new staff member, pharmacist, doctor, or administrator.
//           </p>
//         </div>

//         <div className="card-body p-4 pt-2">
//           {/* --- ALERTS --- */}
//           {error && (
//             <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-danger bg-opacity-10 text-danger small py-2 fw-bold mb-3 animate-fade-in">
//               <AlertCircle size={18} /> {error}
//             </div>
//           )}
//           {message && (
//             <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-success bg-opacity-10 text-success small py-2 fw-bold mb-3 animate-fade-in">
//               <CheckCircle size={18} /> {message}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Assign Role (Moved to top for better UX flow) */}
//             <div className="mb-3">
//               <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                 Assign Role <span className="text-danger">*</span>
//               </label>
//               <div className="position-relative">
//                 <Shield
//                   size={18}
//                   className="position-absolute top-50 translate-middle-y text-primary"
//                   style={{ left: "14px" }}
//                 />
//                 <select
//                   className="form-select bg-light border-light-subtle ps-5 py-2 shadow-none cursor-pointer"
//                   value={role}
//                   onChange={(e) => {
//                     setRole(e.target.value);
//                     if (e.target.value !== "doctor") setSpeciality("");
//                   }}
//                   disabled={loading}
//                 >
//                   <option value="doctor">Doctor</option>{" "}
//                   {/* ✅ ADDED DOCTOR ROLE */}
//                   <option value="pharmacist">Pharmacist</option>
//                   <option value="staff">Staff</option>
//                 </select>
//               </div>
//             </div>

//             {/* ✅ CONDITIONAL RENDER: Doctor Speciality */}
//             {role === "doctor" && (
//               <div className="mb-3 animate-fade-in">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Medical Speciality <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Stethoscope
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="e.g. Cardiologist, General Physician"
//                     className="form-control bg-white border-primary border-opacity-50 ps-5 py-2 shadow-none"
//                     value={speciality}
//                     onChange={(e) => setSpeciality(e.target.value)}
//                     required={role === "doctor"}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Full Name */}
//             <div className="mb-3">
//               <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                 Full Name <span className="text-danger">*</span>
//               </label>
//               <div className="position-relative">
//                 <User
//                   size={18}
//                   className="position-absolute top-50 translate-middle-y text-primary"
//                   style={{ left: "14px" }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="e.g. John Doe"
//                   className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Email Address */}
//             <div className="mb-3">
//               <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                 Email Address <span className="text-danger">*</span>
//               </label>
//               <div className="position-relative">
//                 <Mail
//                   size={18}
//                   className="position-absolute top-50 translate-middle-y text-primary"
//                   style={{ left: "14px" }}
//                 />
//                 <input
//                   type="email"
//                   placeholder="name@example.com"
//                   className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             {/* Phone (Optional) */}
//             <div className="mb-3">
//               <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                 Phone{" "}
//                 <span className="text-muted fw-normal text-lowercase">
//                   (Optional)
//                 </span>
//               </label>
//               <div className="position-relative">
//                 <Phone
//                   size={18}
//                   className="position-absolute top-50 translate-middle-y text-primary"
//                   style={{ left: "14px" }}
//                 />
//                 <input
//                   type="text"
//                   placeholder="98XXXXXXXX"
//                   className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>
//             </div>

//             <div className="row g-3 mb-4">
//               {/* Password */}
//               <div className="col-sm-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Password <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Lock
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div className="col-sm-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Confirm Password <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Lock
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 hover-lift"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={18} className="spin-animation" />
//                   Creating...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>

//       <style>{`
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2) !important; transition: all 0.2s ease; }
//       `}</style>
//     </div>
//   );
// };

// export default AdminCreateUser;

// import React, { useState } from "react";
// import {
//   UserPlus,
//   User,
//   Mail,
//   Phone,
//   Shield,
//   Lock,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Stethoscope,
//   FileText,
//   Briefcase,
//   DollarSign,
//   Activity,
//   Clock,
//   Plus,
//   Trash2,
// } from "lucide-react";

// // Point to the correct base API URL
// const API_BASE_URL = "http://localhost:5000/api";

// const AdminCreateUser = ({ onUserCreated }) => {
//   // Standard User Fields
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("staff");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // ✅ Extended Doctor Fields
//   const [speciality, setSpeciality] = useState("");
//   const [nmcNumber, setNmcNumber] = useState("");
//   const [experience, setExperience] = useState(0);
//   const [consultationFee, setConsultationFee] = useState(500);
//   const [isAvailable, setIsAvailable] = useState(true);
//   const [slots, setSlots] = useState([]);

//   // System States
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Slot Management Functions
//   const addSlot = () => {
//     setSlots([
//       ...slots,
//       { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
//     ]);
//   };

//   const removeSlot = (index) => {
//     setSlots(slots.filter((_, i) => i !== index));
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...slots];
//     newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
//     setSlots(newSlots);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     // Basic Validation
//     if (!name || !email || !password || !confirmPassword) {
//       setError("Please fill all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     // Extended Doctor Validation
//     if (role === "doctor") {
//       if (!speciality || !nmcNumber) {
//         setError("Speciality and NMC Registration are required for Doctors.");
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");

//       // Payload building
//       const payload = { name, email, password, role, phone };

//       // Inject Doctor-specific fields if applicable
//       if (role === "doctor") {
//         payload.speciality = speciality;
//         payload.nmcNumber = nmcNumber;
//         payload.experience = experience;
//         payload.consultationFee = consultationFee;
//         payload.isAvailable = isAvailable;
//         payload.slots = slots;
//       }

//       const res = await fetch(`${API_BASE_URL}/users`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Failed to create user.");
//       } else {
//         setMessage(`User (${role}) created successfully!`);

//         // Refresh the table on the right side
//         if (onUserCreated) onUserCreated();

//         // Clear Form
//         setName("");
//         setEmail("");
//         setPhone("");
//         setRole("staff");
//         setPassword("");
//         setConfirmPassword("");
//         setSpeciality("");
//         setNmcNumber("");
//         setExperience(0);
//         setConsultationFee(500);
//         setIsAvailable(true);
//         setSlots([]);
//       }
//     } catch (err) {
//       console.error("Create User Error:", err);
//       setError("Something went wrong. Is the backend running?");
//     } finally {
//       setLoading(false);
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   return (
//     <div className="h-100 d-flex flex-column animate-fade-in">
//       <div className="card shadow-sm border-0 rounded-4 overflow-hidden flex-grow-1 bg-white">
//         {/* --- HEADER SECTION --- */}
//         <div className="card-header bg-transparent border-0 pt-4 pb-2 text-center">
//           <div
//             className="d-inline-flex align-items-center justify-content-center text-white rounded-circle mb-3 shadow-sm"
//             style={{
//               width: "60px",
//               height: "60px",
//               background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
//             }}
//           >
//             <UserPlus size={28} strokeWidth={2.5} />
//           </div>
//           <h4 className="fw-bolder text-dark mb-1 tracking-tight">
//             Create New User
//           </h4>
//           <p className="text-muted small px-3 fw-medium">
//             Add a new staff member, pharmacist, doctor, or administrator.
//           </p>
//         </div>

//         <div
//           className="card-body p-4 pt-2 custom-scrollbar overflow-auto"
//           style={{ maxHeight: "calc(100vh - 200px)" }}
//         >
//           {/* --- ALERTS --- */}
//           {error && (
//             <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-danger bg-opacity-10 text-danger small py-2 fw-bold mb-3 animate-fade-in">
//               <AlertCircle size={18} className="flex-shrink-0" />
//               <span>{error}</span>
//             </div>
//           )}
//           {message && (
//             <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 border-0 shadow-sm bg-success bg-opacity-10 text-success small py-2 fw-bold mb-3 animate-fade-in">
//               <CheckCircle size={18} className="flex-shrink-0" />
//               <span>{message}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Assign Role */}
//             <div className="mb-3">
//               <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                 Assign Role <span className="text-danger">*</span>
//               </label>
//               <div className="position-relative">
//                 <Shield
//                   size={18}
//                   className="position-absolute top-50 translate-middle-y text-primary"
//                   style={{ left: "14px" }}
//                 />
//                 <select
//                   className="form-select bg-light border-light-subtle ps-5 py-2 shadow-none cursor-pointer"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   disabled={loading}
//                 >
//                   <option value="customer">Patient / Customer</option>
//                   <option value="doctor">Doctor</option>
//                   <option value="pharmacist">Pharmacist</option>
//                   <option value="staff">Staff</option>
//                   <option value="admin">Administrator</option>
//                 </select>
//               </div>
//             </div>

//             {/* Standard User Fields */}
//             <div className="row g-3 mb-3">
//               <div className="col-12">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Full Name <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <User
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="e.g. John Doe"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Email Address <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Mail
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="email"
//                     placeholder="name@example.com"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Phone{" "}
//                   <span className="text-muted fw-normal text-lowercase">
//                     (Optional)
//                   </span>
//                 </label>
//                 <div className="position-relative">
//                   <Phone
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="98XXXXXXXX"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* ✅ CONDITIONAL RENDER: Expanded Doctor Fields */}
//             {role === "doctor" && (
//               <div className="border border-info border-opacity-25 bg-info bg-opacity-10 p-3 rounded-4 mb-4 animate-fade-in">
//                 <h6 className="fw-bold text-info mb-3 d-flex align-items-center gap-2">
//                   <Stethoscope size={18} /> Clinical Details
//                 </h6>
//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-1">
//                       Speciality *
//                     </label>
//                     <div className="position-relative">
//                       <Stethoscope
//                         size={16}
//                         className="position-absolute top-50 translate-middle-y text-info"
//                         style={{ left: "12px" }}
//                       />
//                       <input
//                         type="text"
//                         className="form-control bg-white border-light-subtle ps-5 shadow-none"
//                         value={speciality}
//                         onChange={(e) => setSpeciality(e.target.value)}
//                         required={role === "doctor"}
//                         placeholder="e.g. Cardiologist"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-1">
//                       NMC Registration *
//                     </label>
//                     <div className="position-relative">
//                       <FileText
//                         size={16}
//                         className="position-absolute top-50 translate-middle-y text-info"
//                         style={{ left: "12px" }}
//                       />
//                       <input
//                         type="text"
//                         className="form-control bg-white border-light-subtle ps-5 shadow-none"
//                         value={nmcNumber}
//                         onChange={(e) => setNmcNumber(e.target.value)}
//                         required={role === "doctor"}
//                         placeholder="NMC-XXXX"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-4">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-1">
//                       Exp (Yrs)
//                     </label>
//                     <div className="position-relative">
//                       <Briefcase
//                         size={16}
//                         className="position-absolute top-50 translate-middle-y text-info"
//                         style={{ left: "12px" }}
//                       />
//                       <input
//                         type="number"
//                         className="form-control bg-white border-light-subtle ps-5 shadow-none"
//                         value={experience}
//                         onChange={(e) => setExperience(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-4">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-1">
//                       Fee (NPR)
//                     </label>
//                     <div className="position-relative">
//                       <DollarSign
//                         size={16}
//                         className="position-absolute top-50 translate-middle-y text-success"
//                         style={{ left: "12px" }}
//                       />
//                       <input
//                         type="number"
//                         className="form-control bg-white border-light-subtle ps-5 shadow-none"
//                         value={consultationFee}
//                         onChange={(e) => setConsultationFee(e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-4">
//                     <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-1">
//                       Status
//                     </label>
//                     <div className="position-relative">
//                       <Activity
//                         size={16}
//                         className="position-absolute top-50 translate-middle-y text-info"
//                         style={{ left: "12px" }}
//                       />
//                       <select
//                         className="form-select bg-white border-light-subtle ps-5 shadow-none cursor-pointer"
//                         value={isAvailable}
//                         onChange={(e) =>
//                           setIsAvailable(e.target.value === "true")
//                         }
//                       >
//                         <option value="true" className="text-success">
//                           Available
//                         </option>
//                         <option value="false" className="text-danger">
//                           Unavailable
//                         </option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Doctor Schedule Slots */}
//                   <div className="col-12 mt-3">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-0 d-flex align-items-center gap-1">
//                         <Clock size={14} /> Weekly Schedule
//                       </label>
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-outline-info rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1"
//                         onClick={addSlot}
//                       >
//                         <Plus size={14} /> Add Shift
//                       </button>
//                     </div>

//                     <div className="d-flex flex-column gap-2">
//                       {slots.length === 0 ? (
//                         <div className="text-center py-3 bg-white rounded-3 border border-light-subtle text-muted small fw-medium">
//                           No shifts added. Doctor will appear unavailable for
//                           booking.
//                         </div>
//                       ) : (
//                         slots.map((slot, index) => (
//                           <div
//                             key={index}
//                             className="d-flex align-items-center gap-2 bg-white p-2 rounded-3 border border-light-subtle shadow-sm"
//                           >
//                             <select
//                               className="form-select form-select-sm border-0 shadow-none fw-medium"
//                               style={{ width: "120px" }}
//                               value={slot.day}
//                               onChange={(e) =>
//                                 updateSlot(index, "day", e.target.value)
//                               }
//                             >
//                               {[
//                                 "MONDAY",
//                                 "TUESDAY",
//                                 "WEDNESDAY",
//                                 "THURSDAY",
//                                 "FRIDAY",
//                                 "SATURDAY",
//                                 "SUNDAY",
//                               ].map((d) => (
//                                 <option key={d} value={d}>
//                                   {d}
//                                 </option>
//                               ))}
//                             </select>
//                             <input
//                               type="time"
//                               className="form-control form-control-sm border-0 shadow-none text-center"
//                               value={slot.startTime}
//                               onChange={(e) =>
//                                 updateSlot(index, "startTime", e.target.value)
//                               }
//                               required
//                             />
//                             <span className="text-muted small fw-bold">to</span>
//                             <input
//                               type="time"
//                               className="form-control form-control-sm border-0 shadow-none text-center"
//                               value={slot.endTime}
//                               onChange={(e) =>
//                                 updateSlot(index, "endTime", e.target.value)
//                               }
//                               required
//                             />
//                             <button
//                               type="button"
//                               className="btn btn-sm text-danger p-1 border-0"
//                               onClick={() => removeSlot(index)}
//                               title="Remove Shift"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Passwords */}
//             <div className="row g-3 mb-4">
//               <div className="col-sm-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Password <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Lock
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               <div className="col-sm-6">
//                 <label className="form-label text-secondary fw-bold small mb-1 text-uppercase tracking-wider">
//                   Confirm Password <span className="text-danger">*</span>
//                 </label>
//                 <div className="position-relative">
//                   <Lock
//                     size={18}
//                     className="position-absolute top-50 translate-middle-y text-primary"
//                     style={{ left: "14px" }}
//                   />
//                   <input
//                     type="password"
//                     placeholder="••••••••"
//                     className="form-control bg-light border-light-subtle ps-5 py-2 shadow-none"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 hover-lift"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={18} className="spin-animation" />
//                   Creating Account...
//                 </>
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>

//       <style>{`
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//         .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2) !important; transition: all 0.2s ease; }

//         /* Custom Scrollbar */
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default AdminCreateUser;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import {
//   UserPlus,
//   User,
//   Mail,
//   Lock,
//   ShieldAlert,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   ShieldCheck,
// } from "lucide-react";

// const AdminCreateUser = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "customer", // Default role
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 🚨 THE SMART BOUNCER: Prevent generic doctor creation
//     if (formData.role === "doctor") {
//       // Redirect to the dedicated, OTP-secured Doctor Registration page
//       navigate("/admin/add-doctor");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       // Standard user creation API call for Admins, Pharmacists, and Customers
//       await api.post("/admin/users", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: formData.role,
//       });

//       setSuccess(`Successfully created new ${formData.role} account!`);

//       // Reset form after success
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         role: "customer",
//       });

//       // Optional: auto-redirect back to user list after a few seconds
//       setTimeout(() => navigate("/admin/users"), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create user.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="container-fluid py-4 px-3 px-md-4 bg-light min-vh-100 animate-fade-in"
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       {/* --- HEADER --- */}
//       <div className="d-flex align-items-center gap-3 mb-4">
//         <button
//           className="btn btn-light border shadow-sm rounded-circle p-2 hover-lift"
//           onClick={() => navigate("/admin/users")}
//           title="Back to Users"
//         >
//           <ArrowLeft size={20} className="text-dark" />
//         </button>
//         <div>
//           <h3 className="fw-black mb-0 text-dark tracking-tight">
//             Register New User
//           </h3>
//           <p className="text-muted fw-medium mb-0 small">
//             Create Admin, Pharmacist, or Customer accounts.
//           </p>
//         </div>
//       </div>

//       <div className="row justify-content-center">
//         <div className="col-12 col-lg-8">
//           {/* ALERTS */}
//           {error && (
//             <div className="alert alert-danger py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold d-flex align-items-center gap-2">
//               <AlertCircle size={20} /> {error}
//             </div>
//           )}
//           {success && (
//             <div className="alert alert-success py-3 px-4 shadow-sm mb-4 rounded-4 border-0 fw-bold d-flex align-items-center gap-2">
//               <CheckCircle size={20} /> {success}
//             </div>
//           )}

//           {/* MAIN FORM CARD */}
//           <div className="bg-white rounded-4 shadow-sm border border-light-subtle overflow-hidden">
//             <div className="bg-light border-bottom border-light-subtle p-4 pb-3 d-flex align-items-center gap-3">
//               <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle shadow-sm">
//                 <UserPlus size={24} />
//               </div>
//               <div>
//                 <h5 className="fw-bold text-dark mb-0">Account Details</h5>
//                 <span className="text-muted small">
//                   Fill out the credentials below.
//                 </span>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="p-4 p-md-5">
//               <div className="row g-4">
//                 {/* Full Name */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                     Full Name *
//                   </label>
//                   <div className="position-relative">
//                     <User
//                       size={18}
//                       className="position-absolute top-50 translate-middle-y text-muted"
//                       style={{ left: "16px" }}
//                     />
//                     <input
//                       type="text"
//                       className="form-control bg-light ps-5 py-2 border-light-subtle shadow-sm"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       required
//                       placeholder="John Doe"
//                     />
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                     Email Address *
//                   </label>
//                   <div className="position-relative">
//                     <Mail
//                       size={18}
//                       className="position-absolute top-50 translate-middle-y text-muted"
//                       style={{ left: "16px" }}
//                     />
//                     <input
//                       type="email"
//                       className="form-control bg-light ps-5 py-2 border-light-subtle shadow-sm"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       required
//                       placeholder="admin@pharmacy.com"
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                     Password *
//                   </label>
//                   <div className="position-relative">
//                     <Lock
//                       size={18}
//                       className="position-absolute top-50 translate-middle-y text-muted"
//                       style={{ left: "16px" }}
//                     />
//                     <input
//                       type="password"
//                       className="form-control bg-light ps-5 py-2 border-light-subtle shadow-sm"
//                       value={formData.password}
//                       onChange={(e) =>
//                         setFormData({ ...formData, password: e.target.value })
//                       }
//                       required
//                       placeholder="••••••••"
//                       minLength="6"
//                     />
//                   </div>
//                 </div>

//                 {/* Role Dropdown */}
//                 <div className="col-md-6">
//                   <label className="form-label small fw-bold text-secondary text-uppercase tracking-wider mb-2">
//                     System Role *
//                   </label>
//                   <div className="position-relative">
//                     <ShieldCheck
//                       size={18}
//                       className={`position-absolute top-50 translate-middle-y ${formData.role === "admin" ? "text-danger" : formData.role === "doctor" ? "text-info" : "text-primary"}`}
//                       style={{ left: "16px" }}
//                     />
//                     <select
//                       className="form-select bg-light ps-5 py-2 border-light-subtle shadow-sm fw-bold cursor-pointer"
//                       value={formData.role}
//                       onChange={(e) =>
//                         setFormData({ ...formData, role: e.target.value })
//                       }
//                     >
//                       <option value="staff">Staff</option>
//                       <option value="pharmacist">Pharmacist</option>
//                       <option value="doctor" className="text-info fw-black">
//                         Doctor (Clinical Account)
//                       </option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* 🚨 DYNAMIC WARNING FOR DOCTOR ROLE 🚨 */}
//                 {formData.role === "doctor" && (
//                   <div className="col-12 animate-fade-in mt-3">
//                     <div className="bg-info bg-opacity-10 border border-info border-opacity-25 rounded-3 p-3 d-flex gap-3 align-items-start shadow-sm">
//                       <ShieldAlert
//                         size={24}
//                         className="text-info flex-shrink-0"
//                       />
//                       <div>
//                         <h6 className="fw-bold text-info mb-1">
//                           Medical Profile Required
//                         </h6>
//                         <p className="text-muted small mb-0">
//                           Doctors require an NMC registration, medical
//                           specialty, and OTP verification. Clicking "Go to
//                           Doctor Setup" will redirect you to the specialized
//                           clinical registration form.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* FOOTER ACTIONS */}
//               <div className="border-top border-light-subtle pt-4 mt-5 d-flex justify-content-end gap-3">
//                 <button
//                   type="button"
//                   className="btn btn-light rounded-pill px-5 fw-bold border shadow-sm hover-lift"
//                   onClick={() => navigate("/admin/users")}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className={`btn ${formData.role === "doctor" ? "btn-info text-white" : "btn-primary"} rounded-pill px-5 fw-bold shadow-sm hover-lift d-flex align-items-center gap-2`}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 size={18} className="spin-animation" />{" "}
//                       Processing...
//                     </>
//                   ) : formData.role === "doctor" ? (
//                     "Go to Doctor Setup"
//                   ) : (
//                     "Create Account"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .tracking-wider { letter-spacing: 0.05em; }
//         .hover-lift:hover { transform: translateY(-2px); transition: all 0.2s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
//         .spin-animation { animation: spin 1s linear infinite; }
//         @keyframes spin { 100% { transform: rotate(360deg); } }
//         .cursor-pointer { cursor: pointer; }
//       `}</style>
//     </div>
//   );
// };

// export default AdminCreateUser;

import React, { useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  FileText,
  Briefcase,
  DollarSign,
  Activity,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const AdminCreateUser = ({ onUserCreated }) => {
  // Standard User Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("pharmacist"); // Default to pharmacist
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Doctor Fields
  const [speciality, setSpeciality] = useState("");
  const [nmcNumber, setNmcNumber] = useState("");
  const [experience, setExperience] = useState(0);
  const [consultationFee, setConsultationFee] = useState(500);
  const [isAvailable, setIsAvailable] = useState(true);
  const [slots, setSlots] = useState([]);

  // System States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const addSlot = () => {
    setSlots([
      ...slots,
      { day: "MONDAY", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = field === "day" ? value.toUpperCase() : value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "doctor" && (!speciality || !nmcNumber)) {
      setError("Speciality and NMC Registration are required for Doctors.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const payload = { name, email, password, role, phone };
      if (role === "doctor") {
        payload.speciality = speciality;
        payload.nmcNumber = nmcNumber;
        payload.experience = experience;
        payload.consultationFee = consultationFee;
        payload.isAvailable = isAvailable;
        payload.slots = slots;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create user.");
      } else {
        setMessage(`User (${role}) created successfully!`);
        if (onUserCreated) onUserCreated();

        // Clear Form
        setName("");
        setEmail("");
        setPhone("");
        setRole("pharmacist");
        setPassword("");
        setConfirmPassword("");
        setSpeciality("");
        setNmcNumber("");
        setExperience(0);
        setConsultationFee(500);
        setIsAvailable(true);
        setSlots([]);
      }
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 bg-white d-flex flex-column">
      {/* HEADER */}
      <div className="card-header bg-white border-0 text-center pt-4 pb-2 flex-shrink-0">
        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-2 shadow-sm">
          <UserPlus size={28} />
        </div>
        <h5 className="fw-bolder text-dark mb-1">Register Staff</h5>
        <p className="text-muted small mb-0">Create employee accounts.</p>
      </div>

      {/* BODY (Scrollable) */}
      <div
        className="card-body px-4 pb-4 overflow-auto custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {error && (
          <div className="alert alert-danger small py-2 fw-bold mb-3 d-flex align-items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {message && (
          <div className="alert alert-success small py-2 fw-bold mb-3 d-flex align-items-center gap-2">
            <CheckCircle size={16} /> {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {/* ✅ ROLE DROPDOWN (Restricted to Staff, Pharmacist, Doctor) */}
          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Shield size={14} /> System Role *
            </label>
            <select
              className="form-select bg-light border-light-subtle shadow-none fw-medium"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="doctor">Doctor</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="staff">Standard Staff</option>
            </select>
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <User size={14} /> Full Name *
            </label>
            <input
              type="text"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Mail size={14} /> Email Address *
            </label>
            <input
              type="email"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="jane@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Phone size={14} /> Phone
            </label>
            <input
              type="text"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* ✅ DOCTOR ONLY FIELDS (Stacked Vertically) */}
          {role === "doctor" && (
            <div className="bg-info bg-opacity-10 border border-info border-opacity-25 rounded-3 p-3 mt-2 d-flex flex-column gap-3">
              <h6 className="fw-bold text-info mb-0 d-flex align-items-center gap-2">
                <Stethoscope size={16} /> Doctor Details
              </h6>

              <div>
                <label className="form-label small fw-bold text-info mb-1">
                  Speciality *
                </label>
                <input
                  type="text"
                  className="form-control bg-white shadow-none"
                  placeholder="e.g. Cardiologist"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label small fw-bold text-info mb-1">
                  NMC Registration *
                </label>
                <input
                  type="text"
                  className="form-control bg-white shadow-none"
                  placeholder="NMC-XXXX"
                  value={nmcNumber}
                  onChange={(e) => setNmcNumber(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <div className="w-50">
                  <label className="form-label small fw-bold text-info mb-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-white shadow-none"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div className="w-50">
                  <label className="form-label small fw-bold text-info mb-1">
                    Fee (NPR)
                  </label>
                  <input
                    type="number"
                    className="form-control bg-white shadow-none"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                  />
                </div>
              </div>

              {/* Schedule Slots */}
              <div className="pt-2 border-top border-info border-opacity-25">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-info mb-0">
                    Weekly Shifts
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-info text-white rounded-pill px-2 py-0"
                    style={{ fontSize: "0.7rem" }}
                    onClick={addSlot}
                  >
                    + Add
                  </button>
                </div>
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded-2 border border-light-subtle mb-2 shadow-sm position-relative"
                  >
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0 position-absolute top-0 end-0 me-2 mt-1"
                      onClick={() => removeSlot(index)}
                    >
                      <Trash2 size={12} />
                    </button>
                    <select
                      className="form-select form-select-sm mb-1 shadow-none border-0 fw-bold text-dark"
                      value={slot.day}
                      onChange={(e) => updateSlot(index, "day", e.target.value)}
                    >
                      {[
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY",
                      ].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="d-flex align-items-center gap-1">
                      <input
                        type="time"
                        className="form-control form-control-sm border-0 bg-light"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateSlot(index, "startTime", e.target.value)
                        }
                        required
                      />
                      <span className="small text-muted">to</span>
                      <input
                        type="time"
                        className="form-control form-control-sm border-0 bg-light"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateSlot(index, "endTime", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Lock size={14} /> Password *
            </label>
            <input
              type="password"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-muted mb-1 d-flex align-items-center gap-1">
              <Lock size={14} /> Confirm Password *
            </label>
            <input
              type="password"
              className="form-control bg-light border-light-subtle shadow-none"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-animation" /> Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>

      <style>{`
        .spin-animation { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminCreateUser;
