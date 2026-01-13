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

import React, { useState } from "react";
import api from "../../services/api";
// ✅ Fixed: Added 'User' to the imports to resolve the ReferenceError
import { UserPlus, Phone, Mail, Lock, ShieldCheck, User } from "lucide-react";

const AdminCreateUser = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "pharmacist",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users/admin-create", formData);
      alert("Staff User Created Successfully");

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "pharmacist",
      });

      if (onUserCreated) onUserCreated();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
      <div className="card-header bg-primary text-white p-3 border-0">
        <h6 className="mb-0 d-flex align-items-center gap-2">
          <UserPlus size={18} /> Add New Staff Member
        </h6>
      </div>
      <div className="card-body p-4 bg-light bg-opacity-50">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <User size={16} /> {/* ✅ This icon now works */}
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Mail size={16} />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="staff@pharma.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">
                Contact Number
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Phone size={16} />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="+977-98XXXXXXXX"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="col-md-6">
              <label className="small fw-bold text-muted mb-1">
                Temporary Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Lock size={16} />
                </span>
                <input
                  className="form-control border-start-0"
                  placeholder="Min 6 characters"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="col-md-12">
              <label className="small fw-bold text-muted mb-1">
                Staff Role
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <ShieldCheck size={16} />
                </span>
                <select
                  className="form-select border-start-0"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="pharmacist">Pharmacist</option>
                  <option value="staff">General Staff</option>
                </select>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm"
              >
                Register Staff Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUser;
