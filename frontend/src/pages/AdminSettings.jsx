// // import React from "react";

// // const AdminSettings = () => {
// //   return (
// //     <div className="container-fluid">
// //       <h3 className="mb-3 fw-bold">Settings</h3>
// //       <p className="text-muted">
// //         Admin configuration and system settings go here.
// //       </p>
// //     </div>
// //   );
// // };

// // export default AdminSettings;

// // import React, { useEffect, useState } from "react";

// // const AdminSettings = () => {
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [savingTheme, setSavingTheme] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [error, setError] = useState("");

// //   // Profile/password local state (UI only – connect to backend later)
// //   const [profile, setProfile] = useState({
// //     name: "",
// //     email: "",
// //   });
// //   const [passwords, setPasswords] = useState({
// //     currentPassword: "",
// //     newPassword: "",
// //     confirmPassword: "",
// //   });

// //   useEffect(() => {
// //     const storedTheme = localStorage.getItem("dashboard-dark");
// //     if (storedTheme === "true") {
// //       setDarkMode(true);
// //       document.body.classList.add("bg-dark", "text-light");
// //     }
// //   }, []);

// //   const handleThemeToggle = async () => {
// //     try {
// //       setSavingTheme(true);
// //       setError("");
// //       setMessage("");
// //       const next = !darkMode;
// //       setDarkMode(next);
// //       localStorage.setItem("dashboard-dark", String(next));

// //       if (next) {
// //         document.body.classList.add("bg-dark", "text-light");
// //       } else {
// //         document.body.classList.remove("bg-dark", "text-light");
// //       }
// //       setMessage("Theme preference saved.");
// //     } catch (err) {
// //       setError("Could not save theme preference.");
// //     } finally {
// //       setSavingTheme(false);
// //     }
// //   };

// //   const handleProfileChange = (e) => {
// //     const { name, value } = e.target;
// //     setProfile((p) => ({ ...p, [name]: value }));
// //   };

// //   const handlePasswordChange = (e) => {
// //     const { name, value } = e.target;
// //     setPasswords((p) => ({ ...p, [name]: value }));
// //   };

// //   const handleProfileSubmit = (e) => {
// //     e.preventDefault();
// //     setMessage("Profile update API not wired yet. Add backend endpoint later.");
// //     setError("");
// //   };

// //   const handlePasswordSubmit = (e) => {
// //     e.preventDefault();
// //     if (passwords.newPassword !== passwords.confirmPassword) {
// //       setError("New password and confirmation do not match.");
// //       setMessage("");
// //       return;
// //     }
// //     setMessage(
// //       "Password update API not wired yet. Add backend endpoint later."
// //     );
// //     setError("");
// //   };

// //   return (
// //     <div className="container-fluid">
// //       <h3 className="mb-3 fw-bold">Settings</h3>
// //       <p className="text-muted mb-3">
// //         Admin configuration, appearance and account preferences.
// //       </p>

// //       {error && (
// //         <div className="alert alert-danger py-2" role="alert">
// //           {error}
// //         </div>
// //       )}
// //       {message && (
// //         <div className="alert alert-success py-2" role="alert">
// //           {message}
// //         </div>
// //       )}

// //       <div className="row g-4">
// //         {/* Appearance / Theme */}
// //         <div className="col-lg-4">
// //           <div className="card shadow-sm border-0 h-100">
// //             <div className="card-body">
// //               <h5 className="card-title fw-semibold mb-2">Appearance</h5>
// //               <p className="text-muted small mb-3">
// //                 Toggle between light and dark theme for the admin dashboard.
// //               </p>
// //               <div className="form-check form-switch">
// //                 <input
// //                   className="form-check-input"
// //                   type="checkbox"
// //                   id="darkModeSwitch"
// //                   checked={darkMode}
// //                   onChange={handleThemeToggle}
// //                   disabled={savingTheme}
// //                 />
// //                 <label className="form-check-label" htmlFor="darkModeSwitch">
// //                   {darkMode ? "Dark mode enabled" : "Light mode enabled"}
// //                 </label>
// //               </div>
// //               {savingTheme && (
// //                 <p className="text-muted small mt-2 mb-0">Saving theme...</p>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Profile */}
// //         <div className="col-lg-4">
// //           <div className="card shadow-sm border-0 h-100">
// //             <div className="card-body">
// //               <h5 className="card-title fw-semibold mb-2">Admin Profile</h5>
// //               <p className="text-muted small mb-3">
// //                 Update your display name and contact email.
// //               </p>
// //               <form onSubmit={handleProfileSubmit}>
// //                 <div className="mb-2">
// //                   <label className="form-label">Name</label>
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     className="form-control form-control-sm"
// //                     value={profile.name}
// //                     onChange={handleProfileChange}
// //                     placeholder="Admin Name"
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <label className="form-label">Email</label>
// //                   <input
// //                     type="email"
// //                     name="email"
// //                     className="form-control form-control-sm"
// //                     value={profile.email}
// //                     onChange={handleProfileChange}
// //                     placeholder="admin@example.com"
// //                   />
// //                 </div>
// //                 <button type="submit" className="btn btn-primary btn-sm">
// //                   Save Profile
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Password */}
// //         <div className="col-lg-4">
// //           <div className="card shadow-sm border-0 h-100">
// //             <div className="card-body">
// //               <h5 className="card-title fw-semibold mb-2">Change Password</h5>
// //               <p className="text-muted small mb-3">
// //                 Set a strong password to secure admin access.
// //               </p>
// //               <form onSubmit={handlePasswordSubmit}>
// //                 <div className="mb-2">
// //                   <label className="form-label">Current Password</label>
// //                   <input
// //                     type="password"
// //                     name="currentPassword"
// //                     className="form-control form-control-sm"
// //                     value={passwords.currentPassword}
// //                     onChange={handlePasswordChange}
// //                   />
// //                 </div>
// //                 <div className="mb-2">
// //                   <label className="form-label">New Password</label>
// //                   <input
// //                     type="password"
// //                     name="newPassword"
// //                     className="form-control form-control-sm"
// //                     value={passwords.newPassword}
// //                     onChange={handlePasswordChange}
// //                   />
// //                 </div>
// //                 <div className="mb-3">
// //                   <label className="form-label">Confirm New Password</label>
// //                   <input
// //                     type="password"
// //                     name="confirmPassword"
// //                     className="form-control form-control-sm"
// //                     value={passwords.confirmPassword}
// //                     onChange={handlePasswordChange}
// //                   />
// //                 </div>
// //                 <button type="submit" className="btn btn-warning btn-sm">
// //                   Update Password
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminSettings;

// import React, { useEffect, useState } from "react";
// import api from "../services/api"; // ✅ Use interceptor for API calls

// const AdminSettings = () => {
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [savingTheme, setSavingTheme] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Profile Data
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//   });

//   // Password Data
//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // 1. Initial Load (Theme + User Data)
//   useEffect(() => {
//     const initSettings = async () => {
//       try {
//         setLoading(true);
//         // Load Theme
//         const storedTheme = localStorage.getItem("dashboard-dark");
//         if (storedTheme === "true") {
//           setDarkMode(true);
//           document.body.classList.add("bg-dark", "text-light");
//         }

//         // Load User Profile
//         const res = await api.get("/users/profile"); // ✅ Fetch actual user data
//         if (res.data) {
//           setProfile({
//             name: res.data.name || "",
//             email: res.data.email || "",
//           });
//         }
//       } catch (err) {
//         console.error("Settings load error:", err);
//         // Don't block UI if profile fetch fails, just log it
//       } finally {
//         setLoading(false);
//       }
//     };

//     initSettings();
//   }, []);

//   // 2. Handle Theme Toggle
//   const handleThemeToggle = async () => {
//     try {
//       setSavingTheme(true);
//       const next = !darkMode;
//       setDarkMode(next);
//       localStorage.setItem("dashboard-dark", String(next));

//       if (next) {
//         document.body.classList.add("bg-dark", "text-light");
//       } else {
//         document.body.classList.remove("bg-dark", "text-light");
//       }
//     } catch (err) {
//       console.error("Theme toggle error", err);
//     } finally {
//       setSavingTheme(false);
//     }
//   };

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords((p) => ({ ...p, [name]: value }));
//   };

//   // 3. Submit Profile Updates
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       // ✅ Call API to update name/email
//       const res = await api.put("/users/profile", {
//         name: profile.name,
//         email: profile.email,
//       });

//       // Update local storage user info if needed
//       const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//       localStorage.setItem(
//         "userInfo",
//         JSON.stringify({ ...userInfo, ...res.data })
//       );

//       setMessage("Profile updated successfully.");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update profile.");
//     }
//   };

//   // 4. Submit Password Updates
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setError("New password and confirmation do not match.");
//       return;
//     }
//     if (passwords.newPassword.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       // ✅ Call API to update password
//       await api.put("/users/profile", {
//         password: passwords.newPassword,
//         // Include old password if your backend requires verification
//         // oldPassword: passwords.currentPassword
//       });

//       setMessage("Password updated successfully.");
//       setPasswords({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update password.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center py-5">
//         <div className="spinner-border text-primary me-2" />
//         <span>Loading settings...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Settings</h3>
//       <p className="text-muted mb-4">
//         Admin configuration, appearance, and account preferences.
//       </p>

//       {error && (
//         <div className="alert alert-danger py-2 mb-3" role="alert">
//           {error}
//         </div>
//       )}
//       {message && (
//         <div className="alert alert-success py-2 mb-3" role="alert">
//           {message}
//         </div>
//       )}

//       <div className="row g-4">
//         {/* Appearance / Theme */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100">
//             <div className="card-body">
//               <h5 className="card-title fw-semibold mb-2">Appearance</h5>
//               <p className="text-muted small mb-3">
//                 Toggle between light and dark theme for the dashboard.
//               </p>
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="darkModeSwitch"
//                   checked={darkMode}
//                   onChange={handleThemeToggle}
//                   disabled={savingTheme}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <label
//                   className="form-check-label ms-2"
//                   htmlFor="darkModeSwitch"
//                 >
//                   {darkMode ? "Dark Mode Active" : "Light Mode Active"}
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Profile */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100">
//             <div className="card-body">
//               <h5 className="card-title fw-semibold mb-2">Admin Profile</h5>
//               <p className="text-muted small mb-3">
//                 Update your display name and contact email.
//               </p>
//               <form onSubmit={handleProfileSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control form-control-sm"
//                     value={profile.name}
//                     onChange={handleProfileChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control form-control-sm"
//                     value={profile.email}
//                     onChange={handleProfileChange}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary btn-sm w-100">
//                   Save Profile
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* Password */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100">
//             <div className="card-body">
//               <h5 className="card-title fw-semibold mb-2">Change Password</h5>
//               <p className="text-muted small mb-3">
//                 Set a strong password to secure admin access.
//               </p>
//               <form onSubmit={handlePasswordSubmit}>
//                 <div className="mb-2">
//                   <label className="form-label small fw-bold">
//                     Current Password
//                   </label>
//                   <input
//                     type="password"
//                     name="currentPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.currentPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Enter current password"
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label small fw-bold">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.newPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Min 6 chars"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.confirmPassword}
//                     onChange={handlePasswordChange}
//                     placeholder="Re-enter new password"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-warning btn-sm w-100 text-dark"
//                 >
//                   Update Password
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSettings;

// import React, { useEffect, useState } from "react";
// import api from "../services/api";
// import {
//   User,
//   Lock,
//   Moon,
//   Sun,
//   Save,
//   Shield,
//   Settings,
//   AlertCircle,
//   CheckCircle,
// } from "lucide-react";

// const AdminSettings = () => {
//   const [loading, setLoading] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [savingTheme, setSavingTheme] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Profile Data
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//   });

//   // Password Data
//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   // 1. Initial Load (Theme + User Data)
//   useEffect(() => {
//     const initSettings = async () => {
//       try {
//         setLoading(true);
//         // Load Theme
//         const storedTheme = localStorage.getItem("dashboard-dark");
//         if (storedTheme === "true") {
//           setDarkMode(true);
//           document.body.classList.add("bg-dark", "text-light");
//         }

//         // Load User Profile
//         const res = await api.get("/users/profile");
//         if (res.data) {
//           setProfile({
//             name: res.data.name || "",
//             email: res.data.email || "",
//           });
//         }
//       } catch (err) {
//         console.error("Settings load error:", err);
//         setError("Could not load user profile data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initSettings();
//   }, []);

//   // 2. Handle Theme Toggle
//   const handleThemeToggle = () => {
//     try {
//       setSavingTheme(true);
//       const next = !darkMode;
//       setDarkMode(next);
//       localStorage.setItem("dashboard-dark", String(next));

//       if (next) {
//         document.body.classList.add("bg-dark", "text-light");
//       } else {
//         document.body.classList.remove("bg-dark", "text-light");
//       }
//     } catch (err) {
//       console.error("Theme toggle error", err);
//     } finally {
//       setSavingTheme(false);
//     }
//   };

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords((p) => ({ ...p, [name]: value }));
//   };

//   // 3. Submit Profile Updates
//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const res = await api.put("/users/profile", {
//         name: profile.name,
//         email: profile.email,
//       });

//       // Update local storage user info
//       const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
//       localStorage.setItem(
//         "userInfo",
//         JSON.stringify({ ...userInfo, ...res.data }),
//       );

//       setMessage("Profile details updated successfully.");
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update profile.");
//     }
//   };

//   // 4. Submit Password Updates
//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setError("New password and confirmation do not match.");
//       return;
//     }
//     if (passwords.newPassword.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       await api.put("/users/profile", {
//         password: passwords.newPassword,
//         // Uncomment if backend requires old password
//         // oldPassword: passwords.currentPassword
//       });

//       setMessage("Security credentials updated successfully.");
//       setPasswords({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update password.");
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center py-5"
//         style={{ minHeight: "60vh" }}
//       >
//         <div className="spinner-border text-primary me-2" />
//         <span className="text-muted">Loading configuration...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid p-0 animate-fade-in">
//       <div className="mb-4">
//         <h3 className="fw-bold mb-1 d-flex align-items-center gap-2">
//           <Settings className="text-primary" /> Settings & Preferences
//         </h3>
//         <p className="text-muted small mb-0">
//           Manage your account security and dashboard appearance.
//         </p>
//       </div>

//       {/* Notifications */}
//       {error && (
//         <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-4 border-0 shadow-sm">
//           <AlertCircle size={18} /> {error}
//         </div>
//       )}
//       {message && (
//         <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4 border-0 shadow-sm">
//           <CheckCircle size={18} /> {message}
//         </div>
//       )}

//       <div className="row g-4">
//         {/* 1. Appearance Settings */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100 rounded-4">
//             <div className="card-header bg-white border-0 pt-4 px-4">
//               <h5 className="card-title fw-bold d-flex align-items-center gap-2">
//                 {darkMode ? (
//                   <Moon size={20} className="text-info" />
//                 ) : (
//                   <Sun size={20} className="text-warning" />
//                 )}
//                 Appearance
//               </h5>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <p className="text-muted small mb-4">
//                 Customize how the admin dashboard looks on your device.
//               </p>

//               <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
//                 <span className="fw-medium">Dark Mode</span>
//                 <div className="form-check form-switch">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="darkModeSwitch"
//                     checked={darkMode}
//                     onChange={handleThemeToggle}
//                     disabled={savingTheme}
//                     style={{ width: "3em", height: "1.5em", cursor: "pointer" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 2. Profile Information */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100 rounded-4">
//             <div className="card-header bg-white border-0 pt-4 px-4">
//               <h5 className="card-title fw-bold d-flex align-items-center gap-2">
//                 <User size={20} className="text-primary" /> My Profile
//               </h5>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <form onSubmit={handleProfileSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold text-muted">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control"
//                     value={profile.name}
//                     onChange={handleProfileChange}
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="form-label small fw-bold text-muted">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control"
//                     value={profile.email}
//                     onChange={handleProfileChange}
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-primary w-100 rounded-pill shadow-sm"
//                 >
//                   <Save size={16} className="me-2" /> Save Changes
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>

//         {/* 3. Security & Password */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm border-0 h-100 rounded-4">
//             <div className="card-header bg-white border-0 pt-4 px-4">
//               <h5 className="card-title fw-bold d-flex align-items-center gap-2">
//                 <Shield size={20} className="text-danger" /> Security
//               </h5>
//             </div>
//             <div className="card-body px-4 pb-4">
//               <p className="text-muted small mb-3">
//                 Ensure your account is secure by using a strong password.
//               </p>
//               <form onSubmit={handlePasswordSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold text-muted">
//                     Current Password
//                   </label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-light border-end-0">
//                       <Lock size={16} />
//                     </span>
//                     <input
//                       type="password"
//                       name="currentPassword"
//                       className="form-control border-start-0 ps-0"
//                       value={passwords.currentPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="••••••"
//                       autoComplete="current-password"
//                     />
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label small fw-bold text-muted">
//                     New Password
//                   </label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-light border-end-0">
//                       <Lock size={16} />
//                     </span>
//                     <input
//                       type="password"
//                       name="newPassword"
//                       className="form-control border-start-0 ps-0"
//                       value={passwords.newPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="Min 6 chars"
//                       autoComplete="new-password"
//                     />
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label className="form-label small fw-bold text-muted">
//                     Confirm Password
//                   </label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-light border-end-0">
//                       <Lock size={16} />
//                     </span>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       className="form-control border-start-0 ps-0"
//                       value={passwords.confirmPassword}
//                       onChange={handlePasswordChange}
//                       placeholder="Repeat password"
//                       autoComplete="new-password"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="btn btn-outline-danger w-100 rounded-pill"
//                 >
//                   Update Password
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .animate-fade-in { animation: fadeIn 0.4s ease-out; }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//       `}</style>
//     </div>
//   );
// };

// export default AdminSettings;

import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  User,
  Lock,
  Moon,
  Sun,
  Save,
  Shield,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile Data
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // Password Data
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. Initial Load (Theme + User Data)
  useEffect(() => {
    const initSettings = async () => {
      try {
        setLoading(true);
        // Load Theme
        const storedTheme = localStorage.getItem("dashboard-dark");
        if (storedTheme === "true") {
          setDarkMode(true);
          document.body.classList.add("bg-dark", "text-light");
        }

        // Load User Profile
        const res = await api.get("/users/profile");
        if (res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
          });
        }
      } catch (err) {
        console.error("Settings load error:", err);
        setError("Could not load user profile data.");
      } finally {
        setLoading(false);
      }
    };

    initSettings();
  }, []);

  // 2. Handle Theme Toggle
  const handleThemeToggle = () => {
    try {
      setSavingTheme(true);
      const next = !darkMode;
      setDarkMode(next);
      localStorage.setItem("dashboard-dark", String(next));

      if (next) {
        document.body.classList.add("bg-dark", "text-light");
      } else {
        document.body.classList.remove("bg-dark", "text-light");
      }
    } catch (err) {
      console.error("Theme toggle error", err);
    } finally {
      setSavingTheme(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((p) => ({ ...p, [name]: value }));
  };

  // 3. Submit Profile Updates
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.put("/users/profile", {
        name: profile.name,
        email: profile.email,
      });

      // Update local storage user info
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, ...res.data }),
      );

      setMessage("Profile details updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // 4. Submit Password Updates
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.put("/users/profile", {
        password: passwords.newPassword,
        // Uncomment if backend requires old password
        // oldPassword: passwords.currentPassword
      });

      setMessage("Security credentials updated successfully.");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f0f2f2" }}
      >
        <Loader2
          className="spin-animation mb-3"
          style={{ color: "#007185" }}
          size={48}
        />
        <span
          className="text-secondary fw-bold text-uppercase small"
          style={{ letterSpacing: "0.5px" }}
        >
          Loading Configuration...
        </span>
        <style>{`.spin-animation { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-3 p-md-4 animate-fade-in"
      style={{ backgroundColor: "#f0f2f2", minHeight: "100vh" }}
    >
      {/* Header Area */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle">
        <div>
          <h2
            className="fw-bold mb-1 d-flex align-items-center gap-2"
            style={{ color: "#0F1111", fontSize: "1.5rem" }}
          >
            <Settings style={{ color: "#007185" }} size={24} /> Settings &
            Preferences
          </h2>
          <p className="small mb-0" style={{ color: "#565959" }}>
            Manage your account security and dashboard appearance.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#fef0f0",
            color: "#B12704",
            borderLeft: "4px solid #B12704",
          }}
        >
          <AlertCircle size={18} /> <span className="small">{error}</span>
        </div>
      )}
      {message && (
        <div
          className="alert border-0 shadow-sm mb-4 rounded-1 d-flex align-items-center gap-2"
          style={{
            backgroundColor: "#f2fcf5",
            color: "#067D62",
            borderLeft: "4px solid #067D62",
          }}
        >
          <CheckCircle size={18} /> <span className="small">{message}</span>
        </div>
      )}

      <div className="row g-4">
        {/* 1. Profile Information */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                <User size={18} style={{ color: "#007185" }} /> My Profile
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control amazon-input shadow-none"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control amazon-input shadow-none"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100 fw-medium shadow-sm border-0 d-flex align-items-center justify-content-center py-2"
                  style={{
                    backgroundColor: "#FFD814",
                    color: "#0F1111",
                    borderRadius: "8px",
                  }}
                >
                  <Save size={16} className="me-2" /> Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 2. Security & Password */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9", borderTop: "4px solid #B12704" }}
          >
            <div className="card-header bg-white border-bottom pt-3 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                <Shield size={18} style={{ color: "#B12704" }} /> Security
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4" style={{ color: "#565959" }}>
                Ensure your account is secure by using a strong password.
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Current Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="currentPassword"
                      className="form-control shadow-none"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••"
                      autoComplete="current-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    New Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control shadow-none"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Min 6 chars"
                      autoComplete="new-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    className="form-label small fw-bold mb-1"
                    style={{ color: "#0F1111" }}
                  >
                    Confirm Password
                  </label>
                  <div className="input-group amazon-input-group">
                    <span className="input-group-text bg-light border-secondary-subtle">
                      <Lock size={16} style={{ color: "#565959" }} />
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control shadow-none"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      style={{
                        border: "1px solid #888C8C",
                        borderLeft: "none",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn bg-white w-100 fw-medium shadow-sm py-2"
                  style={{
                    border: "1px solid #D5D9D9",
                    color: "#B12704",
                    borderRadius: "8px",
                  }}
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3. Appearance Settings */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm border bg-white rounded-1 h-100"
            style={{ borderColor: "#D5D9D9" }}
          >
            <div className="card-header bg-white border-bottom pt-4 px-4 pb-3">
              <h5
                className="fw-bold mb-0 d-flex align-items-center gap-2 fs-6"
                style={{ color: "#0F1111" }}
              >
                {darkMode ? (
                  <Moon size={18} style={{ color: "#007185" }} />
                ) : (
                  <Sun size={18} style={{ color: "#e47911" }} />
                )}
                Appearance
              </h5>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4" style={{ color: "#565959" }}>
                Customize how the admin dashboard looks on your device.
              </p>

              <div
                className="d-flex align-items-center justify-content-between p-3 rounded-1 bg-white border"
                style={{ borderColor: "#D5D9D9" }}
              >
                <span className="fw-bold small" style={{ color: "#0F1111" }}>
                  Dark Mode
                </span>
                <div className="form-check form-switch m-0">
                  <input
                    className="form-check-input shadow-none m-0"
                    type="checkbox"
                    id="darkModeSwitch"
                    checked={darkMode}
                    onChange={handleThemeToggle}
                    disabled={savingTheme}
                    style={{
                      width: "2.5em",
                      height: "1.25em",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .amazon-input { border: 1px solid #888C8C; border-radius: 3px; font-size: 0.9rem; }
        .amazon-input:focus, .amazon-input-group input:focus { 
          border-color: #e47911 !important; 
          box-shadow: 0 0 3px 2px rgba(228, 121, 17, .5) !important; 
          outline: none;
        }
        .form-check-input:checked {
          background-color: #007185 !important;
          border-color: #007185 !important;
        }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminSettings;
