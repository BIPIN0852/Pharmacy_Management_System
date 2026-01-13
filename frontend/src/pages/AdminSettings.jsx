// import React from "react";

// const AdminSettings = () => {
//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Settings</h3>
//       <p className="text-muted">
//         Admin configuration and system settings go here.
//       </p>
//     </div>
//   );
// };

// export default AdminSettings;

// import React, { useEffect, useState } from "react";

// const AdminSettings = () => {
//   const [darkMode, setDarkMode] = useState(false);
//   const [savingTheme, setSavingTheme] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Profile/password local state (UI only – connect to backend later)
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//   });
//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("dashboard-dark");
//     if (storedTheme === "true") {
//       setDarkMode(true);
//       document.body.classList.add("bg-dark", "text-light");
//     }
//   }, []);

//   const handleThemeToggle = async () => {
//     try {
//       setSavingTheme(true);
//       setError("");
//       setMessage("");
//       const next = !darkMode;
//       setDarkMode(next);
//       localStorage.setItem("dashboard-dark", String(next));

//       if (next) {
//         document.body.classList.add("bg-dark", "text-light");
//       } else {
//         document.body.classList.remove("bg-dark", "text-light");
//       }
//       setMessage("Theme preference saved.");
//     } catch (err) {
//       setError("Could not save theme preference.");
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

//   const handleProfileSubmit = (e) => {
//     e.preventDefault();
//     setMessage("Profile update API not wired yet. Add backend endpoint later.");
//     setError("");
//   };

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setError("New password and confirmation do not match.");
//       setMessage("");
//       return;
//     }
//     setMessage(
//       "Password update API not wired yet. Add backend endpoint later."
//     );
//     setError("");
//   };

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-3 fw-bold">Settings</h3>
//       <p className="text-muted mb-3">
//         Admin configuration, appearance and account preferences.
//       </p>

//       {error && (
//         <div className="alert alert-danger py-2" role="alert">
//           {error}
//         </div>
//       )}
//       {message && (
//         <div className="alert alert-success py-2" role="alert">
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
//                 Toggle between light and dark theme for the admin dashboard.
//               </p>
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="darkModeSwitch"
//                   checked={darkMode}
//                   onChange={handleThemeToggle}
//                   disabled={savingTheme}
//                 />
//                 <label className="form-check-label" htmlFor="darkModeSwitch">
//                   {darkMode ? "Dark mode enabled" : "Light mode enabled"}
//                 </label>
//               </div>
//               {savingTheme && (
//                 <p className="text-muted small mt-2 mb-0">Saving theme...</p>
//               )}
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
//                 <div className="mb-2">
//                   <label className="form-label">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control form-control-sm"
//                     value={profile.name}
//                     onChange={handleProfileChange}
//                     placeholder="Admin Name"
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control form-control-sm"
//                     value={profile.email}
//                     onChange={handleProfileChange}
//                     placeholder="admin@example.com"
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary btn-sm">
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
//                   <label className="form-label">Current Password</label>
//                   <input
//                     type="password"
//                     name="currentPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.currentPassword}
//                     onChange={handlePasswordChange}
//                   />
//                 </div>
//                 <div className="mb-2">
//                   <label className="form-label">New Password</label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.newPassword}
//                     onChange={handlePasswordChange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Confirm New Password</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     className="form-control form-control-sm"
//                     value={passwords.confirmPassword}
//                     onChange={handlePasswordChange}
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-warning btn-sm">
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

import React, { useEffect, useState } from "react";
import api from "../services/api"; // ✅ Use interceptor for API calls

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
        const res = await api.get("/users/profile"); // ✅ Fetch actual user data
        if (res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
          });
        }
      } catch (err) {
        console.error("Settings load error:", err);
        // Don't block UI if profile fetch fails, just log it
      } finally {
        setLoading(false);
      }
    };

    initSettings();
  }, []);

  // 2. Handle Theme Toggle
  const handleThemeToggle = async () => {
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
      // ✅ Call API to update name/email
      const res = await api.put("/users/profile", {
        name: profile.name,
        email: profile.email,
      });

      // Update local storage user info if needed
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...userInfo, ...res.data })
      );

      setMessage("Profile updated successfully.");
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
      // ✅ Call API to update password
      await api.put("/users/profile", {
        password: passwords.newPassword,
        // Include old password if your backend requires verification
        // oldPassword: passwords.currentPassword
      });

      setMessage("Password updated successfully.");
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
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary me-2" />
        <span>Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h3 className="mb-3 fw-bold">Settings</h3>
      <p className="text-muted mb-4">
        Admin configuration, appearance, and account preferences.
      </p>

      {error && (
        <div className="alert alert-danger py-2 mb-3" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success py-2 mb-3" role="alert">
          {message}
        </div>
      )}

      <div className="row g-4">
        {/* Appearance / Theme */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Appearance</h5>
              <p className="text-muted small mb-3">
                Toggle between light and dark theme for the dashboard.
              </p>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  checked={darkMode}
                  onChange={handleThemeToggle}
                  disabled={savingTheme}
                  style={{ cursor: "pointer" }}
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="darkModeSwitch"
                >
                  {darkMode ? "Dark Mode Active" : "Light Mode Active"}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Admin Profile</h5>
              <p className="text-muted small mb-3">
                Update your display name and contact email.
              </p>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-sm"
                    value={profile.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-sm"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm w-100">
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">Change Password</h5>
              <p className="text-muted small mb-3">
                Set a strong password to secure admin access.
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-2">
                  <label className="form-label small fw-bold">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="form-control form-control-sm"
                    value={passwords.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-bold">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control form-control-sm"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min 6 chars"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-sm"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Re-enter new password"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-warning btn-sm w-100 text-dark"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
