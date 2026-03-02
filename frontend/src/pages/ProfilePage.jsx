// // import React, { useEffect, useState } from "react";
// // import { useAuth } from "../context/AuthContext";

// // const ProfilePage = () => {
// //   const { user } = useAuth(); // assuming user has { name, email, role }
// //   const [profile, setProfile] = useState({
// //     name: "",
// //     email: "",
// //     role: "",
// //   });
// //   const [editing, setEditing] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (user) {
// //       setProfile({
// //         name: user.name || "",
// //         email: user.email || "",
// //         role: user.role || "",
// //       });
// //     }
// //   }, [user]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setProfile((p) => ({ ...p, [name]: value }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // TODO: call backend endpoint to update profile
// //     setMessage("Profile update API not connected yet. Add backend later.");
// //     setError("");
// //     setEditing(false);
// //   };

// //   if (!user) {
// //     return (
// //       <div className="container py-5">
// //         <h4>You are not logged in.</h4>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container py-4">
// //       <div className="row justify-content-center">
// //         <div className="col-lg-8">
// //           <div className="card shadow-sm border-0">
// //             <div className="card-body">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <div>
// //                   <h3 className="fw-bold mb-0">My Profile</h3>
// //                   <p className="text-muted mb-0">
// //                     View and manage your account information.
// //                   </p>
// //                 </div>
// //                 <span className="badge bg-primary text-uppercase">
// //                   {profile.role || "user"}
// //                 </span>
// //               </div>

// //               {error && (
// //                 <div className="alert alert-danger py-2" role="alert">
// //                   {error}
// //                 </div>
// //               )}
// //               {message && (
// //                 <div className="alert alert-success py-2" role="alert">
// //                   {message}
// //                 </div>
// //               )}

// //               {!editing ? (
// //                 <>
// //                   <dl className="row mb-4">
// //                     <dt className="col-sm-3">Name</dt>
// //                     <dd className="col-sm-9">{profile.name || "-"}</dd>

// //                     <dt className="col-sm-3">Email</dt>
// //                     <dd className="col-sm-9">{profile.email || "-"}</dd>

// //                     <dt className="col-sm-3">Role</dt>
// //                     <dd className="col-sm-9 text-capitalize">
// //                       {profile.role || "-"}
// //                     </dd>
// //                   </dl>
// //                   <button
// //                     className="btn btn-outline-primary"
// //                     onClick={() => setEditing(true)}
// //                   >
// //                     Edit Profile
// //                   </button>
// //                 </>
// //               ) : (
// //                 <form onSubmit={handleSubmit}>
// //                   <div className="mb-3">
// //                     <label className="form-label">Name</label>
// //                     <input
// //                       type="text"
// //                       name="name"
// //                       className="form-control"
// //                       value={profile.name}
// //                       onChange={handleChange}
// //                       required
// //                     />
// //                   </div>
// //                   <div className="mb-3">
// //                     <label className="form-label">Email</label>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       className="form-control"
// //                       value={profile.email}
// //                       onChange={handleChange}
// //                       required
// //                     />
// //                   </div>
// //                   <div className="mb-3">
// //                     <label className="form-label">Role</label>
// //                     <input
// //                       type="text"
// //                       className="form-control"
// //                       value={profile.role}
// //                       disabled
// //                       readOnly
// //                     />
// //                   </div>
// //                   <div className="d-flex justify-content-end gap-2">
// //                     <button
// //                       type="button"
// //                       className="btn btn-outline-secondary"
// //                       onClick={() => {
// //                         setEditing(false);
// //                         setMessage("");
// //                         setError("");
// //                         setProfile({
// //                           name: user.name || "",
// //                           email: user.email || "",
// //                           role: user.role || "",
// //                         });
// //                       }}
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button type="submit" className="btn btn-primary">
// //                       Save Changes
// //                     </button>
// //                   </div>
// //                 </form>
// //               )}
// //             </div>
// //           </div>

// //           {/* Optional: password section */}
// //           <div className="card shadow-sm border-0 mt-4">
// //             <div className="card-body">
// //               <h5 className="fw-semibold mb-2">Change Password</h5>
// //               <p className="text-muted small mb-3">
// //                 Implement password update by calling your auth backend.
// //               </p>
// //               <button type="button" className="btn btn-warning btn-sm" disabled>
// //                 Change password (not wired yet)
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Alert,
//   Badge,
//   Image,
// } from "react-bootstrap";
// import { User, Mail, Shield, Edit2, Save, X, Lock, Camera } from "lucide-react";

// const ProfilePage = () => {
//   const { user } = useAuth(); // assuming user has { name, email, role, profilePhoto }
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     role: "",
//     phone: "",
//     address: "",
//   });
//   const [editing, setEditing] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setProfile({
//         name: user.name || "",
//         email: user.email || "",
//         role: user.role || "",
//         phone: user.phone || "",
//         address: user.address
//           ? `${user.address.street || ""}, ${user.address.city || ""}`
//           : "",
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     // Simulate API call
//     setTimeout(() => {
//       // TODO: call backend endpoint to update profile (PUT /api/users/profile)
//       setMessage("Profile updated successfully (UI simulation).");
//       setLoading(false);
//       setEditing(false);
//     }, 1000);
//   };

//   if (!user) {
//     return (
//       <Container className="py-5 text-center">
//         <div className="alert alert-warning">
//           <h4>Please log in to view your profile.</h4>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       <Row className="justify-content-center">
//         {/* Profile Card */}
//         <Col lg={8}>
//           <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
//             {/* Header Background */}
//             <div
//               className="bg-primary text-white p-4 position-relative"
//               style={{
//                 background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
//                 height: "150px",
//               }}
//             >
//               <h3 className="fw-bold position-relative z-1">My Profile</h3>
//               <p className="opacity-75 position-relative z-1">
//                 Manage your personal information and account security.
//               </p>
//               {/* Decorative circle */}
//               <div
//                 className="position-absolute bg-white opacity-10 rounded-circle"
//                 style={{
//                   width: "200px",
//                   height: "200px",
//                   top: "-50px",
//                   right: "-50px",
//                 }}
//               />
//             </div>

//             <Card.Body className="p-4 pt-0">
//               {/* Avatar Section */}
//               <div
//                 className="d-flex justify-content-between align-items-end mb-4"
//                 style={{ marginTop: "-50px" }}
//               >
//                 <div className="position-relative">
//                   <Image
//                     src={
//                       user.profilePhoto ||
//                       "https://ui-avatars.com/api/?name=" +
//                         profile.name +
//                         "&background=random"
//                     }
//                     roundedCircle
//                     thumbnail
//                     className="shadow bg-white"
//                     style={{
//                       width: "120px",
//                       height: "120px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   {editing && (
//                     <div
//                       className="position-absolute bottom-0 end-0 bg-white rounded-circle shadow p-1 cursor-pointer text-primary"
//                       title="Change Photo"
//                       style={{ cursor: "pointer" }}
//                     >
//                       <Camera size={20} />
//                     </div>
//                   )}
//                 </div>
//                 <div className="mb-2">
//                   {!editing && (
//                     <Button
//                       variant="outline-primary"
//                       className="rounded-pill px-4 fw-bold"
//                       onClick={() => setEditing(true)}
//                     >
//                       <Edit2 size={16} className="me-2" />
//                       Edit Profile
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* Alerts */}
//               {error && (
//                 <Alert
//                   variant="danger"
//                   onClose={() => setError("")}
//                   dismissible
//                 >
//                   {error}
//                 </Alert>
//               )}
//               {message && (
//                 <Alert
//                   variant="success"
//                   onClose={() => setMessage("")}
//                   dismissible
//                 >
//                   {message}
//                 </Alert>
//               )}

//               {/* View Mode */}
//               {!editing ? (
//                 <div className="fade-in">
//                   <div className="d-flex align-items-center mb-4">
//                     <h2 className="fw-bold mb-0 me-3">{profile.name}</h2>
//                     <Badge
//                       bg="info"
//                       text="dark"
//                       className="text-uppercase px-3 py-2 rounded-pill"
//                     >
//                       {profile.role}
//                     </Badge>
//                   </div>

//                   <Row className="g-4">
//                     <Col md={6}>
//                       <div className="p-3 bg-light rounded-3 h-100 border">
//                         <div className="d-flex align-items-center mb-2 text-muted">
//                           <Mail size={18} className="me-2" />
//                           <small className="text-uppercase fw-bold">
//                             Email Address
//                           </small>
//                         </div>
//                         <p className="mb-0 fw-medium fs-5 text-break">
//                           {profile.email}
//                         </p>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="p-3 bg-light rounded-3 h-100 border">
//                         <div className="d-flex align-items-center mb-2 text-muted">
//                           <Shield size={18} className="me-2" />
//                           <small className="text-uppercase fw-bold">
//                             Account Role
//                           </small>
//                         </div>
//                         <p className="mb-0 fw-medium fs-5 text-capitalize">
//                           {profile.role}
//                         </p>
//                       </div>
//                     </Col>
//                     <Col md={12}>
//                       <div className="p-3 bg-light rounded-3 h-100 border">
//                         <div className="d-flex align-items-center mb-2 text-muted">
//                           <User size={18} className="me-2" />
//                           <small className="text-uppercase fw-bold">
//                             Member Since
//                           </small>
//                         </div>
//                         <p className="mb-0 fw-medium">
//                           {user.createdAt
//                             ? new Date(user.createdAt).toLocaleDateString(
//                                 "en-US",
//                                 {
//                                   year: "numeric",
//                                   month: "long",
//                                   day: "numeric",
//                                 }
//                               )
//                             : "N/A"}
//                         </p>
//                       </div>
//                     </Col>
//                   </Row>
//                 </div>
//               ) : (
//                 /* Edit Mode */
//                 <Form onSubmit={handleSubmit} className="fade-in">
//                   <Row className="g-3">
//                     <Col md={6}>
//                       <Form.Group controlId="formName">
//                         <Form.Label className="fw-bold">Full Name</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="name"
//                           value={profile.name}
//                           onChange={handleChange}
//                           placeholder="Enter your name"
//                           required
//                           className="py-2"
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group controlId="formEmail">
//                         <Form.Label className="fw-bold">
//                           Email Address
//                         </Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={profile.email}
//                           onChange={handleChange}
//                           placeholder="name@example.com"
//                           required
//                           className="py-2"
//                           // Email is usually immutable or requires verification logic
//                         />
//                       </Form.Group>
//                     </Col>
//                     <Col md={6}>
//                       <Form.Group controlId="formRole">
//                         <Form.Label className="fw-bold">Role</Form.Label>
//                         <Form.Control
//                           type="text"
//                           value={profile.role}
//                           disabled
//                           className="bg-light text-capitalize"
//                         />
//                         <Form.Text className="text-muted">
//                           Role cannot be changed manually.
//                         </Form.Text>
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
//                     <Button
//                       variant="light"
//                       className="px-4 fw-bold"
//                       onClick={() => {
//                         setEditing(false);
//                         // Reset to original
//                         setProfile({
//                           name: user.name || "",
//                           email: user.email || "",
//                           role: user.role || "",
//                         });
//                       }}
//                       disabled={loading}
//                     >
//                       <X size={18} className="me-2" />
//                       Cancel
//                     </Button>
//                     <Button
//                       type="submit"
//                       variant="primary"
//                       className="px-4 fw-bold shadow-sm"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         <>
//                           <Save size={18} className="me-2" />
//                           Save Changes
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </Form>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Security Section (Bottom) */}
//           <Card className="shadow-sm border-0 mt-4 rounded-4">
//             <Card.Body className="p-4">
//               <div className="d-flex align-items-start">
//                 <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-circle me-3">
//                   <Lock size={24} />
//                 </div>
//                 <div className="flex-grow-1">
//                   <h5 className="fw-bold mb-1">Security Settings</h5>
//                   <p className="text-muted small mb-3">
//                     Update your password to keep your account secure.
//                   </p>
//                   <Button
//                     variant="outline-dark"
//                     size="sm"
//                     className="rounded-pill px-3"
//                   >
//                     Change Password
//                   </Button>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   Image,
//   Table,
//   ProgressBar,
//   Tab,
//   Tabs,
//   Alert,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Droplet, // Blood
//   AlertCircle, // Allergies
//   Activity, // Conditions
//   Shield,
//   Edit2,
//   Save,
//   X,
//   FileText, // Prescription
//   ShoppingBag, // Orders
//   Eye,
//   Camera,
//   Truck,
// } from "lucide-react";

// const API_BASE_URL = "http://localhost:5000/api";

// const ProfilePage = () => {
//   const { user } = useAuth(); // Initial user data from context

//   // -- State for Profile Data (Synced with DB) --
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     chronicConditions: "",
//     emergencyContact: "",
//   });

//   // -- State for Real Lists --
//   const [orders, setOrders] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);

//   // -- State for UI --
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false); // For saving
//   const [dataLoading, setDataLoading] = useState(true); // For initial fetch
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   // --- 1. FETCH REAL DATA FROM API ---
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;
//       try {
//         const token = localStorage.getItem("token");
//         const headers = { Authorization: `Bearer ${token}` };

//         // A. Fetch Full User Profile (Personal + Medical)
//         const userRes = await fetch(`${API_BASE_URL}/customer/profile`, {
//           headers,
//         });
//         if (userRes.ok) {
//           const userData = await userRes.json();

//           // Handle Address Object vs String
//           let addrString = "";
//           if (userData.address && typeof userData.address === "object") {
//             addrString = `${userData.address.street || ""}, ${
//               userData.address.city || ""
//             }`;
//           } else {
//             addrString = userData.address || "";
//           }

//           setProfile({
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "",
//             dob: userData.dob
//               ? new Date(userData.dob).toISOString().split("T")[0]
//               : "",
//             address: addrString,
//             bloodGroup: userData.bloodGroup || "",
//             allergies: userData.allergies || "",
//             chronicConditions: userData.chronicConditions || "",
//             emergencyContact: userData.emergencyContact || "",
//           });
//         }

//         // B. Fetch Orders
//         const orderRes = await fetch(`${API_BASE_URL}/customer/orders`, {
//           headers,
//         });
//         if (orderRes.ok) {
//           const orderData = await orderRes.json();
//           // Handle different API response structures ({ orders: [] } vs [])
//           setOrders(
//             orderData.orders || (Array.isArray(orderData) ? orderData : [])
//           );
//         }

//         // C. Fetch Prescriptions
//         const presRes = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
//           headers,
//         });
//         if (presRes.ok) {
//           const presData = await presRes.json();
//           setPrescriptions(
//             presData.prescriptions || (Array.isArray(presData) ? presData : [])
//           );
//         }
//       } catch (err) {
//         console.error("Failed to load profile data", err);
//         setError("Failed to load some profile data. Please refresh.");
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   // --- 2. UPDATE PROFILE HANDLER ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const token = localStorage.getItem("token");
//       // Use the generic update endpoint or creating a specific one if needed
//       // Assuming PUT /api/users/profile updates logged in user
//       const res = await fetch(`${API_BASE_URL}/users/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: profile.name,
//           phone: profile.phone,
//           gender: profile.gender,
//           dob: profile.dob,
//           address: profile.address,
//           // Medical fields
//           bloodGroup: profile.bloodGroup,
//           allergies: profile.allergies,
//           chronicConditions: profile.chronicConditions,
//           emergencyContact: profile.emergencyContact,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Update failed");
//       }

//       setMessage("Profile updated successfully!");
//       setEditing(false);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (dataLoading) {
//     return (
//       <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
//         <div
//           className="spinner-border text-primary"
//           role="status"
//           style={{ width: "3rem", height: "3rem" }}
//         ></div>
//         <p className="mt-3 text-muted">Loading your medical profile...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       {/* --- 1. PROFILE HEADER --- */}
//       <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
//         <div
//           className="bg-light p-4 d-flex flex-column flex-md-row align-items-center gap-4"
//           style={{ background: "linear-gradient(to right, #e3f2fd, #ffffff)" }}
//         >
//           {/* Avatar */}
//           <div className="position-relative">
//             <Image
//               src={
//                 user.profilePhoto ||
//                 `https://ui-avatars.com/api/?name=${profile.name}&background=0d6efd&color=fff`
//               }
//               roundedCircle
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 objectFit: "cover",
//                 border: "4px solid white",
//               }}
//               className="shadow-sm"
//             />
//             {/* Camera Icon - Placeholder for upload functionality */}
//             <div
//               className="position-absolute bottom-0 end-0 bg-white p-1 rounded-circle shadow-sm text-primary cursor-pointer"
//               title="Change Photo (Coming Soon)"
//             >
//               <Camera size={20} />
//             </div>
//           </div>

//           {/* User Details */}
//           <div className="flex-grow-1 text-center text-md-start">
//             <h2 className="fw-bold mb-1">{profile.name}</h2>
//             <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2 text-muted">
//               <span className="small">
//                 Customer ID:{" "}
//                 <strong className="text-dark">
//                   #{user._id?.slice(-6).toUpperCase()}
//                 </strong>
//               </span>
//               <span className="mx-1">•</span>
//               <Badge
//                 bg={user.accountStatus === "verified" ? "success" : "primary"}
//                 className="fw-normal"
//               >
//                 {user.accountStatus || "Active"}
//               </Badge>
//             </div>

//             {/* Dynamic Profile Strength */}
//             <div
//               className="d-flex align-items-center gap-2"
//               style={{ maxWidth: "300px" }}
//             >
//               <small className="text-muted">Profile Strength</small>
//               {/* 100% if blood group is set, else 50% */}
//               <ProgressBar
//                 now={profile.bloodGroup ? 90 : 50}
//                 variant={profile.bloodGroup ? "success" : "warning"}
//                 style={{ height: "6px", flex: 1 }}
//               />
//               <small
//                 className={
//                   profile.bloodGroup
//                     ? "fw-bold text-success"
//                     : "fw-bold text-warning"
//                 }
//               >
//                 {profile.bloodGroup ? "90%" : "50%"}
//               </small>
//             </div>
//           </div>

//           {/* Edit Button */}
//           <div>
//             {!editing && (
//               <Button
//                 variant="outline-primary"
//                 className="rounded-pill px-4"
//                 onClick={() => setEditing(true)}
//               >
//                 <Edit2 size={16} className="me-2" /> Edit Profile
//               </Button>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Messages */}
//       {message && (
//         <Alert variant="success" dismissible onClose={() => setMessage("")}>
//           {message}
//         </Alert>
//       )}
//       {error && (
//         <Alert variant="danger" dismissible onClose={() => setError("")}>
//           {error}
//         </Alert>
//       )}

//       <Row className="g-4">
//         {/* --- LEFT COLUMN: Personal & Medical Info --- */}
//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 mb-4 h-100">
//             <Card.Header className="bg-white border-0 pt-4 pb-0">
//               <h5 className="fw-bold text-primary mb-0">
//                 <User size={20} className="me-2" />
//                 Personal Information
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               {editing ? (
//                 /* EDIT MODE FORM */
//                 <Form onSubmit={handleSubmit}>
//                   <h6 className="text-muted small border-bottom pb-2 mb-3">
//                     General
//                   </h6>
//                   <Form.Group className="mb-2">
//                     <Form.Label className="small">Full Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={profile.name}
//                       onChange={handleChange}
//                       size="sm"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label className="small">Phone</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="phone"
//                       value={profile.phone}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>
//                   <Row>
//                     <Col xs={6}>
//                       <Form.Group className="mb-2">
//                         <Form.Label className="small">Gender</Form.Label>
//                         <Form.Select
//                           name="gender"
//                           value={profile.gender}
//                           onChange={handleChange}
//                           size="sm"
//                         >
//                           <option value="">Select</option>
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                     <Col xs={6}>
//                       <Form.Group className="mb-2">
//                         <Form.Label className="small">DOB</Form.Label>
//                         <Form.Control
//                           type="date"
//                           name="dob"
//                           value={profile.dob}
//                           onChange={handleChange}
//                           size="sm"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small">Address</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="address"
//                       value={profile.address}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>

//                   <h6 className="text-muted small border-bottom pb-2 mb-3 mt-4">
//                     Medical
//                   </h6>
//                   <Form.Group className="mb-2">
//                     <Form.Label className="small">Blood Group</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="bloodGroup"
//                       value={profile.bloodGroup}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. O+"
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label className="small">Allergies</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="allergies"
//                       value={profile.allergies}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. Peanuts"
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label className="small">Conditions</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="chronicConditions"
//                       value={profile.chronicConditions}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. Asthma"
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small">Emergency Contact</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="emergencyContact"
//                       value={profile.emergencyContact}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>

//                   <div className="d-flex gap-2 mt-4">
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       size="sm"
//                       className="w-100"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         "Saving..."
//                       ) : (
//                         <>
//                           <Save size={16} className="me-1" /> Save
//                         </>
//                       )}
//                     </Button>
//                     <Button
//                       variant="light"
//                       size="sm"
//                       className="w-100"
//                       onClick={() => setEditing(false)}
//                     >
//                       <X size={16} className="me-1" /> Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               ) : (
//                 /* READ ONLY VIEW */
//                 <div className="d-flex flex-column gap-3">
//                   <div className="d-flex align-items-center">
//                     <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                       <Mail size={16} />
//                     </div>
//                     <div>
//                       <div className="small text-muted">Email</div>
//                       <div className="fw-medium text-break">
//                         {profile.email}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center">
//                     <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                       <Phone size={16} />
//                     </div>
//                     <div>
//                       <div className="small text-muted">Phone</div>
//                       <div className="fw-medium">
//                         {profile.phone || "Not set"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center">
//                     <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                       <User size={16} />
//                     </div>
//                     <div>
//                       <div className="small text-muted">Gender</div>
//                       <div className="fw-medium">
//                         {profile.gender || "Not set"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center">
//                     <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                       <Calendar size={16} />
//                     </div>
//                     <div>
//                       <div className="small text-muted">DOB</div>
//                       <div className="fw-medium">
//                         {profile.dob || "Not set"}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="d-flex align-items-center">
//                     <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                       <MapPin size={16} />
//                     </div>
//                     <div>
//                       <div className="small text-muted">Address</div>
//                       <div className="fw-medium">
//                         {profile.address || "Not set"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>

//           {/* 3. MEDICAL INFORMATION (Read Only View) */}
//           <Card className="border-0 shadow-sm rounded-4 h-100">
//             <Card.Header className="bg-danger bg-opacity-10 border-0 pt-4 pb-0">
//               <h5 className="fw-bold text-danger mb-0">
//                 <Activity size={20} className="me-2" />
//                 Medical Information
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               {!editing ? (
//                 <div className="d-flex flex-column gap-3">
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//                     <div className="d-flex align-items-center text-muted">
//                       <Droplet size={16} className="me-2" />
//                       Blood
//                     </div>
//                     <Badge
//                       bg={profile.bloodGroup ? "danger" : "light"}
//                       text={profile.bloodGroup ? "white" : "dark"}
//                       className="rounded-pill px-3"
//                     >
//                       {profile.bloodGroup || "Not Set"}
//                     </Badge>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//                     <div className="d-flex align-items-center text-muted">
//                       <AlertCircle size={16} className="me-2" />
//                       Allergies
//                     </div>
//                     <span className="fw-medium text-end small">
//                       {profile.allergies || "None"}
//                     </span>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
//                     <div className="d-flex align-items-center text-muted">
//                       <Activity size={16} className="me-2" />
//                       Conditions
//                     </div>
//                     <span className="fw-medium text-end small">
//                       {profile.chronicConditions || "None"}
//                     </span>
//                   </div>
//                   <div className="bg-warning bg-opacity-10 p-2 rounded mt-2">
//                     <div className="small text-muted mb-1">
//                       Emergency Contact
//                     </div>
//                     <div className="fw-bold text-dark">
//                       {profile.emergencyContact || "Not Set"}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center text-muted py-4">
//                   <small>Editing in form above...</small>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* --- RIGHT COLUMN: History & Security --- */}
//         <Col lg={8}>
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mb-4 border-0 custom-tabs"
//           >
//             <Tab eventKey="overview" title="History & Orders">
//               {/* 4. PRESCRIPTION HISTORY (REAL DATA) */}
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
//                   <h5 className="fw-bold mb-0 text-primary">
//                     <FileText size={20} className="me-2" />
//                     Prescriptions
//                   </h5>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {prescriptions.length === 0 ? (
//                     <div className="p-5 text-center text-muted">
//                       <FileText size={40} className="mb-2 opacity-50" />
//                       <p>No prescriptions uploaded yet.</p>
//                     </div>
//                   ) : (
//                     <Table responsive hover className="mb-0 align-middle">
//                       <thead className="bg-light">
//                         <tr>
//                           <th className="ps-4">Date</th>
//                           <th>Status</th>
//                           <th>Notes</th>
//                           <th className="text-end pe-4">Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {prescriptions.map((p) => (
//                           <tr key={p._id}>
//                             <td className="ps-4">
//                               {new Date(p.createdAt).toLocaleDateString()}
//                             </td>
//                             <td>
//                               <Badge
//                                 bg={
//                                   p.status === "approved"
//                                     ? "success"
//                                     : p.status === "rejected"
//                                     ? "danger"
//                                     : "warning"
//                                 }
//                                 className="rounded-pill fw-normal"
//                               >
//                                 {p.status}
//                               </Badge>
//                             </td>
//                             <td
//                               className="text-truncate"
//                               style={{ maxWidth: "200px" }}
//                             >
//                               {p.notes || "No notes provided"}
//                             </td>
//                             <td className="text-end pe-4">
//                               <Button
//                                 variant="outline-secondary"
//                                 size="sm"
//                                 className="rounded-pill"
//                                 href={`${API_BASE_URL}${p.imageUrl}`} // Adjust path if needed based on backend
//                                 target="_blank"
//                               >
//                                 <Eye size={14} className="me-1" /> View
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Card.Body>
//               </Card>

//               {/* 5. ORDER HISTORY (REAL DATA) */}
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
//                   <h5 className="fw-bold mb-0 text-success">
//                     <ShoppingBag size={20} className="me-2" />
//                     Recent Orders
//                   </h5>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {orders.length === 0 ? (
//                     <div className="p-5 text-center text-muted">
//                       <ShoppingBag size={40} className="mb-2 opacity-50" />
//                       <p>No orders placed yet.</p>
//                     </div>
//                   ) : (
//                     <Table responsive hover className="mb-0 align-middle">
//                       <thead className="bg-light">
//                         <tr>
//                           <th className="ps-4">Order ID</th>
//                           <th>Date</th>
//                           <th>Amount</th>
//                           <th>Status</th>
//                           <th className="text-end pe-4">Details</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {orders.map((o) => (
//                           <tr key={o._id}>
//                             <td className="ps-4 fw-medium text-primary">
//                               #{o._id.slice(-6).toUpperCase()}
//                             </td>
//                             <td>
//                               {new Date(o.createdAt).toLocaleDateString()}
//                             </td>
//                             <td className="fw-bold">
//                               ₹{o.totalAmount || o.price || 0}
//                             </td>
//                             <td>
//                               <Badge
//                                 bg={
//                                   o.status === "delivered"
//                                     ? "success"
//                                     : o.status === "cancelled"
//                                     ? "danger"
//                                     : "info"
//                                 }
//                                 className="rounded-pill fw-normal"
//                               >
//                                 {o.status}
//                               </Badge>
//                             </td>
//                             <td className="text-end pe-4">
//                               <Button
//                                 variant="light"
//                                 size="sm"
//                                 className="rounded-pill text-primary border"
//                               >
//                                 Invoice
//                               </Button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Tab>

//             <Tab eventKey="security" title="Security Settings">
//               {/* 6. SECURITY SETTINGS (UI Only for now) */}
//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Body className="p-4">
//                   <h5 className="fw-bold mb-4">
//                     <Shield size={20} className="me-2" />
//                     Security & Login
//                   </h5>

//                   <Row className="mb-4 align-items-center">
//                     <Col md={8}>
//                       <h6 className="mb-1">Change Password</h6>
//                       <p className="text-muted small mb-0">
//                         It's a good idea to use a strong password that you're
//                         not using elsewhere.
//                       </p>
//                     </Col>
//                     <Col md={4} className="text-md-end mt-3 mt-md-0">
//                       <Button
//                         variant="outline-primary"
//                         className="rounded-pill"
//                       >
//                         Update Password
//                       </Button>
//                     </Col>
//                   </Row>
//                   <hr className="bg-light" />
//                   <Row className="align-items-center">
//                     <Col md={8}>
//                       <h6 className="mb-1">Two-Factor Authentication</h6>
//                       <p className="text-muted small mb-0">
//                         Add an extra layer of security to your account.
//                       </p>
//                     </Col>
//                     <Col md={4} className="text-md-end mt-3 mt-md-0">
//                       <Form.Check
//                         type="switch"
//                         id="2fa-switch"
//                         label="Enable 2FA"
//                         className="fs-5"
//                       />
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Tab>
//           </Tabs>
//         </Col>
//       </Row>

//       <style jsx>{`
//         .custom-tabs .nav-link {
//           color: #6c757d;
//           font-weight: 500;
//           border: none;
//           border-bottom: 3px solid transparent;
//           padding-bottom: 12px;
//         }
//         .custom-tabs .nav-link.active {
//           color: #0d6efd;
//           background: transparent;
//           border-bottom: 3px solid #0d6efd;
//         }
//         .cursor-pointer {
//           cursor: pointer;
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   Image,
//   Table,
//   ProgressBar,
//   Tab,
//   Tabs,
//   Alert,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Droplet,
//   AlertCircle,
//   Activity,
//   Shield,
//   Edit2,
//   Save,
//   X,
//   FileText,
//   ShoppingBag,
//   Eye,
//   Camera,
// } from "lucide-react";
// import api from "../services/api"; // ✅ Use Interceptor

// const ProfilePage = () => {
//   const { user } = useAuth(); // Context user

//   // -- State for Profile Data (Synced with DB) --
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     chronicConditions: "",
//     emergencyContact: "",
//   });

//   // -- State for Real Lists --
//   const [orders, setOrders] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);

//   // -- State for UI --
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false); // For saving
//   const [dataLoading, setDataLoading] = useState(true); // For initial fetch
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   // --- 1. FETCH REAL DATA FROM API ---
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;
//       try {
//         setDataLoading(true);
//         // Concurrent Fetching
//         const [userRes, orderRes, presRes] = await Promise.allSettled([
//           api.get("/users/profile"), // Standardized route
//           api.get("/customer/orders"), // Customer specific
//           api.get("/customer/prescriptions"), // Customer specific
//         ]);

//         // A. Profile Data
//         if (userRes.status === "fulfilled") {
//           const userData = userRes.value.data;

//           let addrString = "";
//           if (userData.address && typeof userData.address === "object") {
//             addrString = `${userData.address.street || ""}, ${
//               userData.address.city || ""
//             }`;
//           } else {
//             addrString = userData.address || "";
//           }

//           setProfile({
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: userData.phone || "",
//             gender: userData.gender || "",
//             dob: userData.dob
//               ? new Date(userData.dob).toISOString().split("T")[0]
//               : "",
//             address: addrString,
//             bloodGroup: userData.bloodGroup || "",
//             allergies: userData.allergies || "",
//             chronicConditions: userData.chronicConditions || "",
//             emergencyContact: userData.emergencyContact || "",
//           });
//         }

//         // B. Orders Data
//         if (orderRes.status === "fulfilled") {
//           const orderData = orderRes.value.data;
//           setOrders(
//             orderData.orders || (Array.isArray(orderData) ? orderData : [])
//           );
//         }

//         // C. Prescriptions Data
//         if (presRes.status === "fulfilled") {
//           const presData = presRes.value.data;
//           setPrescriptions(
//             presData.prescriptions || (Array.isArray(presData) ? presData : [])
//           );
//         }
//       } catch (err) {
//         console.error("Profile load error:", err);
//         setError("Failed to load some profile data. Please refresh.");
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   // --- 2. UPDATE PROFILE HANDLER ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       // ✅ PUT Request via Interceptor
//       await api.put("/users/profile", {
//         name: profile.name,
//         phone: profile.phone,
//         gender: profile.gender,
//         dob: profile.dob,
//         address: profile.address,
//         // Medical fields
//         bloodGroup: profile.bloodGroup,
//         allergies: profile.allergies,
//         chronicConditions: profile.chronicConditions,
//         emergencyContact: profile.emergencyContact,
//       });

//       setMessage("Profile updated successfully!");
//       setEditing(false);

//       // Auto-hide success message
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error("Update error:", err);
//       setError(err.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (dataLoading) {
//     return (
//       <Container
//         className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
//         style={{ minHeight: "60vh" }}
//       >
//         <div
//           className="spinner-border text-primary mb-3"
//           role="status"
//           style={{ width: "3rem", height: "3rem" }}
//         ></div>
//         <p className="text-muted">Loading your profile...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5 fade-in">
//       {/* --- 1. PROFILE HEADER CARD --- */}
//       <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
//         <div
//           className="bg-light p-4 d-flex flex-column flex-md-row align-items-center gap-4 position-relative"
//           style={{
//             background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
//           }}
//         >
//           {/* Avatar Section */}
//           <div className="position-relative">
//             <Image
//               src={
//                 user?.profilePhoto ||
//                 `https://ui-avatars.com/api/?name=${profile.name}&background=0d6efd&color=fff&size=128`
//               }
//               roundedCircle
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 objectFit: "cover",
//                 border: "4px solid white",
//               }}
//               className="shadow-sm"
//             />
//             <div
//               className="position-absolute bottom-0 end-0 bg-white p-2 rounded-circle shadow-sm text-primary cursor-pointer hover-scale"
//               title="Change Photo"
//             >
//               <Camera size={18} />
//             </div>
//           </div>

//           {/* User Info Section */}
//           <div className="flex-grow-1 text-center text-md-start">
//             <h2 className="fw-bold mb-1 text-dark">
//               {profile.name || "Guest User"}
//             </h2>

//             <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-3 text-muted small">
//               <span>
//                 ID:{" "}
//                 <span className="font-monospace text-dark">
//                   #{user?._id?.slice(-6).toUpperCase()}
//                 </span>
//               </span>
//               <span>•</span>
//               <Badge
//                 bg={user?.isAdmin ? "danger" : "success"}
//                 className="fw-normal px-2 py-1"
//               >
//                 {user?.role ? user.role.toUpperCase() : "CUSTOMER"}
//               </Badge>
//             </div>

//             {/* Profile Strength Bar */}
//             <div
//               className="d-flex align-items-center gap-3"
//               style={{ maxWidth: "300px", margin: "0 auto 0 0" }}
//             >
//               <span className="small text-muted text-nowrap">
//                 Profile Completion
//               </span>
//               <ProgressBar
//                 now={profile.bloodGroup ? 90 : 50}
//                 variant={profile.bloodGroup ? "success" : "warning"}
//                 style={{ height: "6px", flex: 1 }}
//               />
//               <span
//                 className={`small fw-bold ${
//                   profile.bloodGroup ? "text-success" : "text-warning"
//                 }`}
//               >
//                 {profile.bloodGroup ? "90%" : "50%"}
//               </span>
//             </div>
//           </div>

//           {/* Edit Toggle */}
//           <div className="mt-3 mt-md-0">
//             {!editing && (
//               <Button
//                 variant="outline-primary"
//                 className="rounded-pill px-4 py-2 fw-medium shadow-sm"
//                 onClick={() => setEditing(true)}
//               >
//                 <Edit2 size={16} className="me-2" /> Edit Profile
//               </Button>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Notifications */}
//       {message && (
//         <Alert variant="success" onClose={() => setMessage("")} dismissible>
//           {message}
//         </Alert>
//       )}
//       {error && (
//         <Alert variant="danger" onClose={() => setError("")} dismissible>
//           {error}
//         </Alert>
//       )}

//       <Row className="g-4">
//         {/* --- LEFT COLUMN: Personal & Medical Info --- */}
//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 mb-4 h-100">
//             <Card.Header className="bg-white border-0 pt-4 pb-0">
//               <h5 className="fw-bold text-primary mb-0 d-flex align-items-center">
//                 <User size={20} className="me-2" /> Personal Information
//               </h5>
//             </Card.Header>
//             <Card.Body className="pt-3">
//               {editing ? (
//                 <Form onSubmit={handleSubmit}>
//                   {/* General Fields */}
//                   <h6 className="text-muted small text-uppercase fw-bold mb-3 border-bottom pb-2">
//                     General
//                   </h6>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-medium">
//                       Full Name
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="name"
//                       value={profile.name}
//                       onChange={handleChange}
//                       size="sm"
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-medium">Phone</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="phone"
//                       value={profile.phone}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>

//                   <Row>
//                     <Col xs={6}>
//                       <Form.Group className="mb-2">
//                         <Form.Label className="small fw-medium">
//                           Gender
//                         </Form.Label>
//                         <Form.Select
//                           name="gender"
//                           value={profile.gender}
//                           onChange={handleChange}
//                           size="sm"
//                         >
//                           <option value="">Select</option>
//                           <option value="Male">Male</option>
//                           <option value="Female">Female</option>
//                           <option value="Other">Other</option>
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                     <Col xs={6}>
//                       <Form.Group className="mb-2">
//                         <Form.Label className="small fw-medium">
//                           Date of Birth
//                         </Form.Label>
//                         <Form.Control
//                           type="date"
//                           name="dob"
//                           value={profile.dob}
//                           onChange={handleChange}
//                           size="sm"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>

//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-medium">Address</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="address"
//                       value={profile.address}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>

//                   {/* Medical Fields */}
//                   <h6 className="text-muted small text-uppercase fw-bold mb-3 border-bottom pb-2 mt-4">
//                     Medical
//                   </h6>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-medium">
//                       Blood Group
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="bloodGroup"
//                       value={profile.bloodGroup}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. O+"
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-medium">
//                       Allergies
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="allergies"
//                       value={profile.allergies}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. Peanuts"
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-2">
//                     <Form.Label className="small fw-medium">
//                       Chronic Conditions
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="chronicConditions"
//                       value={profile.chronicConditions}
//                       onChange={handleChange}
//                       size="sm"
//                       placeholder="e.g. Asthma"
//                     />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-medium">
//                       Emergency Contact
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="emergencyContact"
//                       value={profile.emergencyContact}
//                       onChange={handleChange}
//                       size="sm"
//                     />
//                   </Form.Group>

//                   {/* Actions */}
//                   <div className="d-flex gap-2 mt-4">
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       size="sm"
//                       className="w-100 fw-medium"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         "Saving..."
//                       ) : (
//                         <>
//                           <Save size={16} className="me-1" /> Save Changes
//                         </>
//                       )}
//                     </Button>
//                     <Button
//                       variant="light"
//                       size="sm"
//                       className="w-100 border"
//                       onClick={() => setEditing(false)}
//                       disabled={loading}
//                     >
//                       <X size={16} className="me-1" /> Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               ) : (
//                 <div className="d-flex flex-column gap-3">
//                   {/* Read-Only Items */}
//                   {[
//                     { icon: Mail, label: "Email", value: profile.email },
//                     { icon: Phone, label: "Phone", value: profile.phone },
//                     { icon: User, label: "Gender", value: profile.gender },
//                     { icon: Calendar, label: "DOB", value: profile.dob },
//                     { icon: MapPin, label: "Address", value: profile.address },
//                   ].map((item, idx) => (
//                     <div className="d-flex align-items-center" key={idx}>
//                       <div className="bg-light p-2 rounded-circle me-3 text-primary">
//                         <item.icon size={18} />
//                       </div>
//                       <div className="w-100">
//                         <div
//                           className="small text-muted text-uppercase"
//                           style={{ fontSize: "0.7rem" }}
//                         >
//                           {item.label}
//                         </div>
//                         <div className="fw-medium text-dark text-break">
//                           {item.value || (
//                             <span className="text-muted fst-italic">
//                               Not set
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>

//           {/* Medical Info Card (Always Visible, Read Only when not editing) */}
//           {!editing && (
//             <Card className="border-0 shadow-sm rounded-4 h-100 mt-4">
//               <Card.Header className="bg-danger bg-opacity-10 border-0 pt-4 pb-0">
//                 <h5 className="fw-bold text-danger mb-0 d-flex align-items-center">
//                   <Activity size={20} className="me-2" /> Medical Profile
//                 </h5>
//               </Card.Header>
//               <Card.Body>
//                 <div className="d-flex flex-column gap-3">
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2 border-light">
//                     <div className="d-flex align-items-center text-muted gap-2">
//                       <Droplet size={16} /> Blood Group
//                     </div>
//                     <Badge
//                       bg={profile.bloodGroup ? "danger" : "light"}
//                       text={profile.bloodGroup ? "white" : "dark"}
//                       className="rounded-pill"
//                     >
//                       {profile.bloodGroup || "N/A"}
//                     </Badge>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2 border-light">
//                     <div className="d-flex align-items-center text-muted gap-2">
//                       <AlertCircle size={16} /> Allergies
//                     </div>
//                     <span className="fw-medium small text-end">
//                       {profile.allergies || "None"}
//                     </span>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2 border-light">
//                     <div className="d-flex align-items-center text-muted gap-2">
//                       <Activity size={16} /> Conditions
//                     </div>
//                     <span className="fw-medium small text-end">
//                       {profile.chronicConditions || "None"}
//                     </span>
//                   </div>
//                   <div className="bg-warning bg-opacity-10 p-3 rounded-3 mt-2">
//                     <div
//                       className="small text-muted text-uppercase mb-1 fw-bold"
//                       style={{ fontSize: "0.7rem" }}
//                     >
//                       Emergency Contact
//                     </div>
//                     <div className="fw-bold text-dark">
//                       {profile.emergencyContact || "Not Set"}
//                     </div>
//                   </div>
//                 </div>
//               </Card.Body>
//             </Card>
//           )}
//         </Col>

//         {/* --- RIGHT COLUMN: History & Security --- */}
//         <Col lg={8}>
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mb-4 border-bottom-0 custom-tabs"
//           >
//             <Tab eventKey="overview" title="History & Orders">
//               {/* Prescriptions */}
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white border-bottom py-3">
//                   <h5 className="fw-bold mb-0 text-primary d-flex align-items-center">
//                     <FileText size={20} className="me-2" /> Prescriptions
//                   </h5>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {prescriptions.length === 0 ? (
//                     <div className="p-5 text-center text-muted">
//                       <FileText size={40} className="mb-2 opacity-25" />
//                       <p className="mb-0">No prescriptions uploaded yet.</p>
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="mb-0 align-middle">
//                         <thead className="bg-light text-muted small text-uppercase">
//                           <tr>
//                             <th className="ps-4 py-3 border-0">Date</th>
//                             <th className="py-3 border-0">Status</th>
//                             <th className="py-3 border-0">Notes</th>
//                             <th className="text-end pe-4 py-3 border-0">
//                               Action
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {prescriptions.map((p) => (
//                             <tr key={p._id}>
//                               <td className="ps-4">
//                                 {new Date(p.createdAt).toLocaleDateString()}
//                               </td>
//                               <td>
//                                 <Badge
//                                   bg={
//                                     p.status === "approved"
//                                       ? "success"
//                                       : p.status === "rejected"
//                                       ? "danger"
//                                       : "warning"
//                                   }
//                                   className="rounded-pill fw-normal px-2"
//                                 >
//                                   {p.status}
//                                 </Badge>
//                               </td>
//                               <td
//                                 className="text-truncate small text-muted"
//                                 style={{ maxWidth: "200px" }}
//                               >
//                                 {p.notes || "No notes"}
//                               </td>
//                               <td className="text-end pe-4">
//                                 <Button
//                                   variant="light"
//                                   size="sm"
//                                   className="rounded-pill text-primary border"
//                                   href={p.imageUrl}
//                                   target="_blank"
//                                 >
//                                   <Eye size={14} className="me-1" /> View
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>

//               {/* Orders */}
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white border-bottom py-3">
//                   <h5 className="fw-bold mb-0 text-success d-flex align-items-center">
//                     <ShoppingBag size={20} className="me-2" /> Recent Orders
//                   </h5>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {orders.length === 0 ? (
//                     <div className="p-5 text-center text-muted">
//                       <ShoppingBag size={40} className="mb-2 opacity-25" />
//                       <p className="mb-0">No orders placed yet.</p>
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="mb-0 align-middle">
//                         <thead className="bg-light text-muted small text-uppercase">
//                           <tr>
//                             <th className="ps-4 py-3 border-0">Order ID</th>
//                             <th className="py-3 border-0">Date</th>
//                             <th className="py-3 border-0">Amount</th>
//                             <th className="py-3 border-0">Status</th>
//                             <th className="text-end pe-4 py-3 border-0">
//                               Action
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {orders.map((o) => (
//                             <tr key={o._id}>
//                               <td className="ps-4 fw-medium text-dark font-monospace">
//                                 #{o._id.slice(-6).toUpperCase()}
//                               </td>
//                               <td className="small text-muted">
//                                 {new Date(o.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="fw-bold">
//                                 Rs. {o.totalPrice || o.totalAmount || 0}
//                               </td>
//                               <td>
//                                 <Badge
//                                   bg={
//                                     o.status === "delivered"
//                                       ? "success"
//                                       : o.status === "cancelled"
//                                       ? "danger"
//                                       : "info"
//                                   }
//                                   className="rounded-pill fw-normal px-2 text-capitalize"
//                                 >
//                                   {o.status}
//                                 </Badge>
//                               </td>
//                               <td className="text-end pe-4">
//                                 <Button
//                                   variant="outline-secondary"
//                                   size="sm"
//                                   className="rounded-pill border-opacity-25"
//                                 >
//                                   Invoice
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Tab>

//             <Tab eventKey="security" title="Security">
//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Body className="p-4">
//                   <h5 className="fw-bold mb-4 d-flex align-items-center">
//                     <Shield size={20} className="me-2 text-dark" /> Security
//                     Settings
//                   </h5>

//                   <div className="mb-4">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                       <h6 className="mb-0">Password</h6>
//                       <Button
//                         variant="outline-primary"
//                         size="sm"
//                         className="rounded-pill"
//                       >
//                         Update
//                       </Button>
//                     </div>
//                     <p className="text-muted small">
//                       Last changed 3 months ago.
//                     </p>
//                   </div>

//                   <hr className="bg-light" />

//                   <div className="d-flex justify-content-between align-items-center">
//                     <div>
//                       <h6 className="mb-1">Two-Factor Authentication</h6>
//                       <p className="text-muted small mb-0">
//                         Add an extra layer of security to your account.
//                       </p>
//                     </div>
//                     <Form.Check
//                       type="switch"
//                       id="2fa-switch"
//                       className="fs-5"
//                     />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Tab>
//           </Tabs>
//         </Col>
//       </Row>

//       <style>{`
//         .custom-tabs .nav-link { color: #6c757d; border: none; border-bottom: 2px solid transparent; font-weight: 500; padding: 10px 20px; }
//         .custom-tabs .nav-link.active { color: #0d6efd; background: transparent; border-bottom: 2px solid #0d6efd; }
//         .cursor-pointer { cursor: pointer; }
//         .hover-scale:hover { transform: scale(1.1); transition: transform 0.2s; }
//       `}</style>
//     </Container>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   Image,
//   Table,
//   ProgressBar,
//   Tab,
//   Tabs,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Droplet,
//   AlertCircle,
//   Activity,
//   Shield,
//   Edit2,
//   Save,
//   X,
//   FileText,
//   ShoppingBag,
//   Eye,
//   Camera,
//   CheckCircle,
// } from "lucide-react";
// import api from "../services/api";

// const ProfilePage = () => {
//   const { user } = useAuth();

//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     chronicConditions: "",
//     emergencyContact: "",
//   });

//   const [orders, setOrders] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setDataLoading(true);
//         // Concurrent Fetching using the consolidated routes
//         const [userRes, orderRes, presRes] = await Promise.allSettled([
//           api.get("/users/profile"),
//           api.get("/orders/my"),
//           api.get("/prescriptions"), // Interceptor filters by user on backend
//         ]);

//         if (userRes.status === "fulfilled") {
//           const userData = userRes.data || userRes.value;
//           setProfile({
//             ...userData,
//             dob: userData.dob
//               ? new Date(userData.dob).toISOString().split("T")[0]
//               : "",
//           });
//         }

//         if (orderRes.status === "fulfilled") {
//           setOrders(orderRes.data || orderRes.value || []);
//         }

//         if (presRes.status === "fulfilled") {
//           setPrescriptions(presRes.data || presRes.value || []);
//         }
//       } catch (err) {
//         setError("Failed to sync profile data with server.");
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       await api.put("/users/profile", profile);
//       setMessage("Profile details saved successfully.");
//       setEditing(false);
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (dataLoading)
//     return (
//       <Container
//         className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
//         style={{ minHeight: "70vh" }}
//       >
//         <Spinner animation="border" variant="primary" className="mb-3" />
//         <p className="text-muted fw-bold">Synchronizing medical profile...</p>
//       </Container>
//     );

//   return (
//     <Container className="py-5 animate-fade-in">
//       {/* --- HEADER SECTION --- */}
//       <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden card-modern">
//         <div
//           className="p-4 d-flex flex-column flex-md-row align-items-center gap-4"
//           style={{
//             background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
//           }}
//         >
//           <div className="position-relative">
//             <Image
//               src={
//                 user?.profilePhoto ||
//                 `https://ui-avatars.com/api/?name=${profile.name}&background=0d6efd&color=fff&size=128`
//               }
//               roundedCircle
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 objectFit: "cover",
//                 border: "4px solid white",
//               }}
//               className="shadow-sm"
//             />
//             <div className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow cursor-pointer">
//               <Camera size={16} />
//             </div>
//           </div>

//           <div className="flex-grow-1 text-center text-md-start">
//             <h2 className="fw-bold text-dark mb-1">{profile.name}</h2>
//             <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
//               <Badge
//                 bg="primary-subtle"
//                 className="text-primary border border-primary-subtle text-uppercase"
//               >
//                 {user?.role || "Customer"}
//               </Badge>
//               <span className="text-muted small">
//                 #{user?._id?.slice(-6).toUpperCase()}
//               </span>
//             </div>
//             <div style={{ maxWidth: "250px" }}>
//               <div className="d-flex justify-content-between small mb-1">
//                 <span className="text-muted">Profile Completion</span>
//                 <span className="fw-bold text-primary">
//                   {profile.bloodGroup ? "100%" : "70%"}
//                 </span>
//               </div>
//               <ProgressBar
//                 now={profile.bloodGroup ? 100 : 70}
//                 variant="primary"
//                 style={{ height: "6px" }}
//                 rounded
//               />
//             </div>
//           </div>

//           {!editing && (
//             <Button
//               variant="primary"
//               className="rounded-pill px-4 shadow-sm"
//               onClick={() => setEditing(true)}
//             >
//               <Edit2 size={16} className="me-2" /> Edit Profile
//             </Button>
//           )}
//         </div>
//       </Card>

//       {message && (
//         <Alert variant="success" className="rounded-3 shadow-sm border-0">
//           <CheckCircle size={18} className="me-2" />
//           {message}
//         </Alert>
//       )}
//       {error && (
//         <Alert variant="danger" className="rounded-3 shadow-sm border-0">
//           {error}
//         </Alert>
//       )}

//       <Row className="g-4">
//         {/* --- LEFT: DETAILS & MEDICAL --- */}
//         <Col lg={4}>
//           <Card className="border-0 shadow-sm rounded-4 mb-4">
//             <Card.Body className="p-4">
//               <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
//                 <User size={20} className="text-primary" /> Personal Info
//               </h5>

//               {editing ? (
//                 <Form
//                   onSubmit={handleSubmit}
//                   className="d-flex flex-column gap-3"
//                 >
//                   <Form.Group>
//                     <Form.Label className="small fw-bold">Full Name</Form.Label>
//                     <Form.Control
//                       name="name"
//                       value={profile.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group>
//                     <Form.Label className="small fw-bold">
//                       Phone Number
//                     </Form.Label>
//                     <Form.Control
//                       name="phone"
//                       value={profile.phone}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <Form.Group>
//                     <Form.Label className="small fw-bold">Address</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="address"
//                       value={profile.address}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <div className="d-flex gap-2 pt-2">
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       className="flex-grow-1 rounded-pill"
//                       disabled={loading}
//                     >
//                       {loading ? "Saving..." : "Save"}
//                     </Button>
//                     <Button
//                       variant="light"
//                       className="flex-grow-1 rounded-pill border"
//                       onClick={() => setEditing(false)}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               ) : (
//                 <div className="d-flex flex-column gap-4">
//                   {[
//                     { icon: Mail, label: "Email", val: profile.email },
//                     { icon: Phone, label: "Phone", val: profile.phone },
//                     { icon: MapPin, label: "Address", val: profile.address },
//                     { icon: Calendar, label: "Birth Date", val: profile.dob },
//                   ].map((item, i) => (
//                     <div key={i} className="d-flex gap-3">
//                       <div className="bg-light p-2 rounded-3 text-primary h-100">
//                         <item.icon size={18} />
//                       </div>
//                       <div>
//                         <div
//                           className="text-muted small text-uppercase fw-bold"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           {item.label}
//                         </div>
//                         <div className="fw-bold text-dark">
//                           {item.val || "Not set"}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </Card.Body>
//           </Card>

//           <Card className="border-0 shadow-sm rounded-4 bg-primary bg-opacity-10 border-primary border-opacity-10">
//             <Card.Body className="p-4">
//               <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
//                 <Activity size={20} /> Medical Profile
//               </h5>
//               <div className="d-flex flex-column gap-3">
//                 <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm px-3">
//                   <span className="small fw-bold text-muted">Blood Group</span>
//                   <Badge bg="danger" className="rounded-pill">
//                     {profile.bloodGroup || "?"}
//                   </Badge>
//                 </div>
//                 <div className="bg-white p-3 rounded-3 shadow-sm">
//                   <span className="small fw-bold text-muted d-block mb-1">
//                     Allergies
//                   </span>
//                   <span className="text-dark small">
//                     {profile.allergies || "No known allergies"}
//                   </span>
//                 </div>
//                 <div className="bg-white p-3 rounded-3 shadow-sm border-start border-warning border-4">
//                   <span className="small fw-bold text-muted d-block mb-1 text-warning">
//                     Emergency Contact
//                   </span>
//                   <span className="fw-bold text-dark">
//                     {profile.emergencyContact || "Not configured"}
//                   </span>
//                 </div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* --- RIGHT: ACTIVITY TABS --- */}
//         <Col lg={8}>
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mb-4 custom-tabs border-0"
//           >
//             <Tab
//               eventKey="overview"
//               title={
//                 <>
//                   <ShoppingBag size={18} className="me-2" /> Activity
//                 </>
//               }
//             >
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white p-4 border-0 pb-0">
//                   <h6 className="fw-bold mb-0">Recent Order History</h6>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {orders.length === 0 ? (
//                     <div className="p-5 text-center text-muted small">
//                       No transactions found.
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="align-middle mb-0">
//                         <thead className="bg-light small fw-bold text-muted text-uppercase">
//                           <tr>
//                             <th className="ps-4">Order</th>
//                             <th>Date</th>
//                             <th>Total</th>
//                             <th className="pe-4 text-end">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {orders.slice(0, 5).map((o) => (
//                             <tr key={o._id}>
//                               <td className="ps-4 fw-bold">
//                                 #{o._id.slice(-6).toUpperCase()}
//                               </td>
//                               <td className="small">
//                                 {new Date(o.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="fw-bold text-primary">
//                                 Rs. {o.totalPrice}
//                               </td>
//                               <td className="pe-4 text-end">
//                                 <Badge
//                                   bg={
//                                     o.status === "Delivered"
//                                       ? "success-subtle"
//                                       : "warning-subtle"
//                                   }
//                                   className={`text-${
//                                     o.status === "Delivered"
//                                       ? "success"
//                                       : "warning"
//                                   } rounded-pill`}
//                                 >
//                                   {o.status}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>

//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Header className="bg-white p-4 border-0 pb-0">
//                   <h6 className="fw-bold mb-0">Medical Prescriptions</h6>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {prescriptions.length === 0 ? (
//                     <div className="p-5 text-center text-muted small">
//                       No prescriptions uploaded.
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="align-middle mb-0">
//                         <thead className="bg-light small fw-bold text-muted text-uppercase">
//                           <tr>
//                             <th className="ps-4">Document</th>
//                             <th>Verification</th>
//                             <th className="pe-4 text-end">File</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {prescriptions.slice(0, 3).map((p) => (
//                             <tr key={p._id}>
//                               <td className="ps-4">
//                                 <div className="small fw-bold">Rx-Record</div>
//                                 <div
//                                   className="text-muted"
//                                   style={{ fontSize: "0.7rem" }}
//                                 >
//                                   {new Date(p.createdAt).toLocaleDateString()}
//                                 </div>
//                               </td>
//                               <td>
//                                 <Badge
//                                   bg={
//                                     p.status === "Approved" ? "success" : "info"
//                                   }
//                                   className="rounded-pill"
//                                 >
//                                   {p.status}
//                                 </Badge>
//                               </td>
//                               <td className="pe-4 text-end">
//                                 <Button
//                                   variant="light"
//                                   size="sm"
//                                   className="rounded-circle border"
//                                   onClick={() => window.open(p.image, "_blank")}
//                                 >
//                                   <Eye size={14} />
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Tab>

//             <Tab
//               eventKey="security"
//               title={
//                 <>
//                   <Shield size={18} className="me-2" /> Security
//                 </>
//               }
//             >
//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Body className="p-4">
//                   <h6 className="fw-bold mb-3">Account Security</h6>
//                   <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3">
//                     <div>
//                       <div className="fw-bold small">Change Password</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         Update your login credentials regularly.
//                       </div>
//                     </div>
//                     <Button variant="white" className="btn-sm border shadow-sm">
//                       Update
//                     </Button>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
//                     <div>
//                       <div className="fw-bold small">Two-Factor Auth</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         Secure your account with OTP.
//                       </div>
//                     </div>
//                     <Form.Check type="switch" id="2fa" defaultChecked />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Tab>
//           </Tabs>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Badge,
//   Image,
//   Table,
//   ProgressBar,
//   Tab,
//   Tabs,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Activity,
//   Shield,
//   Edit2,
//   ShoppingBag,
//   Eye,
//   Camera,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import api from "../services/api";

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const fileInputRef = useRef(null);

//   // Consolidated profile state
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     chronicConditions: "",
//     emergencyContact: "",
//     profilePhoto: "",
//   });

//   // Backup state for Cancel action
//   const [initialProfile, setInitialProfile] = useState({});

//   // Image Upload State
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const [orders, setOrders] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);

//   // UI States
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   // Options
//   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   const genders = ["Male", "Female", "Other", "Prefer not to say"];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setDataLoading(true);
//         // Concurrent Fetching
//         const [userRes, orderRes, presRes] = await Promise.allSettled([
//           api.get("/users/profile"),
//           api.get("/orders/my"),
//           api.get("/prescriptions/my"), // Use the specific customer route we fixed
//         ]);

//         if (userRes.status === "fulfilled") {
//           const userData = userRes.value.data;

//           // ✅ FIX 1: Handle Address Object vs String to prevent crash
//           let addrString = userData.address || "";
//           if (
//             typeof userData.address === "object" &&
//             userData.address !== null
//           ) {
//             addrString = [
//               userData.address.street,
//               userData.address.city,
//               userData.address.province,
//               userData.address.postalCode,
//             ]
//               .filter(Boolean)
//               .join(", ");
//           }

//           // ✅ FIX 2: Ensure Phone is string
//           const phoneString = userData.phone ? String(userData.phone) : "";

//           const formattedData = {
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: phoneString,
//             address: addrString,
//             profilePhoto: userData.profilePhoto || "",
//             dob: userData.dob
//               ? new Date(userData.dob).toISOString().split("T")[0]
//               : "",
//             gender: userData.gender || "",
//             bloodGroup: userData.bloodGroup || "",
//             allergies: userData.allergies || "",
//             chronicConditions: userData.chronicConditions || "",
//             emergencyContact: userData.emergencyContact || "",
//           };
//           setProfile(formattedData);
//           setInitialProfile(formattedData);
//         }

//         if (orderRes.status === "fulfilled") {
//           setOrders(orderRes.value.data || []);
//         }

//         if (presRes.status === "fulfilled") {
//           setPrescriptions(presRes.value.data || []);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to sync profile data with server.");
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCancel = () => {
//     setProfile(initialProfile);
//     setPreview(null);
//     setSelectedFile(null);
//     setEditing(false);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const formData = new FormData();
//       Object.keys(profile).forEach((key) => {
//         if (key !== "profilePhoto") {
//           // Send as string to ensure compatibility
//           formData.append(key, profile[key] || "");
//         }
//       });

//       if (selectedFile) {
//         formData.append("profilePhoto", selectedFile);
//       }

//       const { data } = await api.put("/users/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Handle address returning as object or string from backend update
//       let addrString = data.address || "";
//       if (typeof data.address === "object" && data.address !== null) {
//         addrString = [
//           data.address.street,
//           data.address.city,
//           data.address.province,
//         ]
//           .filter(Boolean)
//           .join(", ");
//       }

//       const updatedData = {
//         ...data,
//         address: addrString,
//         dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
//       };

//       setProfile(updatedData);
//       setInitialProfile(updatedData);
//       setPreview(null);
//       setSelectedFile(null);
//       setMessage("Profile details saved successfully.");
//       setEditing(false);
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FIX 3: Robust Completion Calculation
//   const calculateCompletion = () => {
//     const fields = [
//       "name",
//       "email",
//       "phone",
//       "address",
//       "bloodGroup",
//       "emergencyContact",
//     ];

//     const filled = fields.filter((field) => {
//       const val = profile[field];
//       // Convert to string safely before checking trim()
//       // This fixes the "val.trim is not a function" error if val is a number
//       return val && String(val).trim() !== "";
//     }).length;

//     return Math.round((filled / fields.length) * 100);
//   };

//   if (dataLoading)
//     return (
//       <Container
//         className="py-5 text-center d-flex flex-column align-items-center justify-content-center"
//         style={{ minHeight: "70vh" }}
//       >
//         <Spinner animation="border" variant="primary" className="mb-3" />
//         <p className="text-muted fw-bold">Synchronizing medical profile...</p>
//       </Container>
//     );

//   return (
//     <Container className="py-5 animate-fade-in">
//       <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
//         <div
//           className="p-4 d-flex flex-column flex-md-row align-items-center gap-4"
//           style={{
//             background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
//           }}
//         >
//           <div className="position-relative">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleImageChange}
//               hidden
//               accept="image/*"
//             />
//             <Image
//               src={
//                 preview ||
//                 profile.profilePhoto ||
//                 user?.profilePhoto ||
//                 `https://ui-avatars.com/api/?name=${profile.name}&background=0d6efd&color=fff&size=128`
//               }
//               roundedCircle
//               style={{
//                 width: "120px",
//                 height: "120px",
//                 objectFit: "cover",
//                 border: "4px solid white",
//               }}
//               className="shadow-sm"
//             />
//             {editing && (
//               <div
//                 className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow cursor-pointer hover-scale"
//                 onClick={() => fileInputRef.current.click()}
//                 title="Change Photo"
//               >
//                 <Camera size={16} />
//               </div>
//             )}
//           </div>

//           <div className="flex-grow-1 text-center text-md-start">
//             <h2 className="fw-bold text-dark mb-1">{profile.name}</h2>
//             <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
//               <Badge
//                 bg="primary-subtle"
//                 className="text-primary border border-primary-subtle text-uppercase"
//               >
//                 {user?.role || "Customer"}
//               </Badge>
//               <span className="text-muted small">
//                 #{user?._id?.slice(-6).toUpperCase()}
//               </span>
//             </div>
//             <div style={{ maxWidth: "250px" }}>
//               <div className="d-flex justify-content-between small mb-1">
//                 <span className="text-muted">Profile Completion</span>
//                 <span className="fw-bold text-primary">
//                   {calculateCompletion()}%
//                 </span>
//               </div>
//               <ProgressBar
//                 now={calculateCompletion()}
//                 variant="primary"
//                 style={{ height: "6px" }}
//                 className="rounded"
//               />
//             </div>
//           </div>

//           {!editing && (
//             <Button
//               variant="primary"
//               className="rounded-pill px-4 shadow-sm"
//               onClick={() => setEditing(true)}
//             >
//               <Edit2 size={16} className="me-2" /> Edit Profile
//             </Button>
//           )}
//         </div>
//       </Card>

//       {message && (
//         <Alert
//           variant="success"
//           className="rounded-3 shadow-sm border-0 d-flex align-items-center"
//         >
//           <CheckCircle size={18} className="me-2" /> {message}
//         </Alert>
//       )}
//       {error && (
//         <Alert
//           variant="danger"
//           className="rounded-3 shadow-sm border-0 d-flex align-items-center"
//         >
//           <AlertCircle size={18} className="me-2" /> {error}
//         </Alert>
//       )}

//       <Row className="g-4">
//         {/* --- LEFT COLUMN --- */}
//         <Col lg={4}>
//           {editing ? (
//             /* --- EDIT MODE --- */
//             <Card className="border-0 shadow-sm rounded-4 mb-4">
//               <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
//                 <h5 className="fw-bold mb-0 text-primary">Edit Details</h5>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 <Form onSubmit={handleSubmit}>
//                   <h6 className="text-muted small fw-bold text-uppercase mb-3">
//                     Personal Info
//                   </h6>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">Full Name</Form.Label>
//                     <Form.Control
//                       name="name"
//                       value={profile.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </Form.Group>
//                   <Row className="g-2 mb-3">
//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small fw-bold">
//                           Gender
//                         </Form.Label>
//                         <Form.Select
//                           name="gender"
//                           value={profile.gender}
//                           onChange={handleChange}
//                         >
//                           <option value="">Select...</option>
//                           {genders.map((g) => (
//                             <option key={g} value={g}>
//                               {g}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                     <Col xs={6}>
//                       <Form.Group>
//                         <Form.Label className="small fw-bold">
//                           Birth Date
//                         </Form.Label>
//                         <Form.Control
//                           type="date"
//                           name="dob"
//                           value={profile.dob}
//                           onChange={handleChange}
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">Phone</Form.Label>
//                     <Form.Control
//                       name="phone"
//                       value={profile.phone}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">Address</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="address"
//                       value={profile.address}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>

//                   <hr className="my-4 opacity-10" />

//                   <h6 className="text-muted small fw-bold text-uppercase mb-3">
//                     Medical Info
//                   </h6>
//                   <Row className="g-2 mb-3">
//                     <Col xs={5}>
//                       <Form.Group>
//                         <Form.Label className="small fw-bold">
//                           Blood Type
//                         </Form.Label>
//                         <Form.Select
//                           name="bloodGroup"
//                           value={profile.bloodGroup}
//                           onChange={handleChange}
//                         >
//                           <option value="">--</option>
//                           {bloodGroups.map((bg) => (
//                             <option key={bg} value={bg}>
//                               {bg}
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Form.Group>
//                     </Col>
//                     <Col xs={7}>
//                       <Form.Group>
//                         <Form.Label className="small fw-bold">
//                           Emergency Contact
//                         </Form.Label>
//                         <Form.Control
//                           name="emergencyContact"
//                           value={profile.emergencyContact}
//                           onChange={handleChange}
//                           placeholder="Name & Phone"
//                         />
//                       </Form.Group>
//                     </Col>
//                   </Row>
//                   <Form.Group className="mb-3">
//                     <Form.Label className="small fw-bold">Allergies</Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="allergies"
//                       value={profile.allergies}
//                       onChange={handleChange}
//                       placeholder="e.g. Peanuts, Penicillin"
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-4">
//                     <Form.Label className="small fw-bold">
//                       Chronic Conditions
//                     </Form.Label>
//                     <Form.Control
//                       as="textarea"
//                       rows={2}
//                       name="chronicConditions"
//                       value={profile.chronicConditions}
//                       onChange={handleChange}
//                       placeholder="e.g. Diabetes, Asthma"
//                     />
//                   </Form.Group>

//                   <div className="d-flex gap-2">
//                     <Button
//                       variant="primary"
//                       type="submit"
//                       className="flex-grow-1 rounded-pill"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <Spinner as="span" animation="border" size="sm" />
//                       ) : (
//                         "Save Changes"
//                       )}
//                     </Button>
//                     <Button
//                       variant="light"
//                       className="flex-grow-1 rounded-pill border"
//                       onClick={handleCancel}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </Form>
//               </Card.Body>
//             </Card>
//           ) : (
//             /* --- VIEW MODE --- */
//             <>
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Body className="p-4">
//                   <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
//                     <User size={20} className="text-primary" /> Personal Info
//                   </h5>
//                   <div className="d-flex flex-column gap-4">
//                     {[
//                       { icon: Mail, label: "Email", val: profile.email },
//                       { icon: Phone, label: "Phone", val: profile.phone },
//                       { icon: User, label: "Gender", val: profile.gender },
//                       { icon: MapPin, label: "Address", val: profile.address },
//                       {
//                         icon: Calendar,
//                         label: "Birth Date",
//                         val: profile.dob,
//                       },
//                     ].map((item, i) => (
//                       <div key={i} className="d-flex gap-3">
//                         <div className="bg-light p-2 rounded-3 text-primary h-100">
//                           <item.icon size={18} />
//                         </div>
//                         <div>
//                           <div
//                             className="text-muted small text-uppercase fw-bold"
//                             style={{ fontSize: "0.65rem" }}
//                           >
//                             {item.label}
//                           </div>
//                           <div className="fw-bold text-dark">
//                             {item.val || (
//                               <span className="text-muted fw-normal fst-italic">
//                                 Not set
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>

//               <Card className="border-0 shadow-sm rounded-4 bg-primary bg-opacity-10 border-primary border-opacity-10">
//                 <Card.Body className="p-4">
//                   <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
//                     <Activity size={20} /> Medical Profile
//                   </h5>
//                   <div className="d-flex flex-column gap-3">
//                     <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 shadow-sm px-3">
//                       <span className="small fw-bold text-muted">
//                         Blood Group
//                       </span>
//                       <Badge bg="danger" className="rounded-pill">
//                         {profile.bloodGroup || "?"}
//                       </Badge>
//                     </div>
//                     <div className="bg-white p-3 rounded-3 shadow-sm">
//                       <span className="small fw-bold text-muted d-block mb-1">
//                         Allergies
//                       </span>
//                       <span className="text-dark small">
//                         {profile.allergies || "None declared"}
//                       </span>
//                     </div>
//                     <div className="bg-white p-3 rounded-3 shadow-sm">
//                       <span className="small fw-bold text-muted d-block mb-1">
//                         Chronic Conditions
//                       </span>
//                       <span className="text-dark small">
//                         {profile.chronicConditions || "None declared"}
//                       </span>
//                     </div>
//                     <div className="bg-white p-3 rounded-3 shadow-sm border-start border-warning border-4">
//                       <span className="small fw-bold text-muted d-block mb-1 text-warning">
//                         Emergency Contact
//                       </span>
//                       <span className="fw-bold text-dark">
//                         {profile.emergencyContact || "Not configured"}
//                       </span>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </>
//           )}
//         </Col>

//         {/* --- RIGHT COLUMN --- */}
//         <Col lg={8}>
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="mb-4 custom-tabs border-0"
//           >
//             <Tab
//               eventKey="overview"
//               title={
//                 <>
//                   <ShoppingBag size={18} className="me-2" /> Activity
//                 </>
//               }
//             >
//               <Card className="border-0 shadow-sm rounded-4 mb-4">
//                 <Card.Header className="bg-white p-4 border-0 pb-0">
//                   <h6 className="fw-bold mb-0">Recent Order History</h6>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {orders.length === 0 ? (
//                     <div className="p-5 text-center text-muted small">
//                       No transactions found.
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="align-middle mb-0">
//                         <thead className="bg-light small fw-bold text-muted text-uppercase">
//                           <tr>
//                             <th className="ps-4">Order</th>
//                             <th>Date</th>
//                             <th>Total</th>
//                             <th className="pe-4 text-end">Status</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {orders.slice(0, 5).map((o) => (
//                             <tr key={o._id}>
//                               <td className="ps-4 fw-bold">
//                                 #{o._id.slice(-6).toUpperCase()}
//                               </td>
//                               <td className="small">
//                                 {new Date(o.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="fw-bold text-primary">
//                                 Rs. {o.totalPrice}
//                               </td>
//                               <td className="pe-4 text-end">
//                                 <Badge
//                                   bg={
//                                     o.status === "Delivered"
//                                       ? "success-subtle"
//                                       : "warning-subtle"
//                                   }
//                                   className={`text-${
//                                     o.status === "Delivered"
//                                       ? "success"
//                                       : "warning"
//                                   } rounded-pill`}
//                                 >
//                                   {o.status}
//                                 </Badge>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>

//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Header className="bg-white p-4 border-0 pb-0">
//                   <h6 className="fw-bold mb-0">Medical Prescriptions</h6>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                   {prescriptions.length === 0 ? (
//                     <div className="p-5 text-center text-muted small">
//                       No prescriptions uploaded.
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table hover className="align-middle mb-0">
//                         <thead className="bg-light small fw-bold text-muted text-uppercase">
//                           <tr>
//                             <th className="ps-4">Document</th>
//                             <th>Verification</th>
//                             <th className="pe-4 text-end">File</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {prescriptions.slice(0, 3).map((p) => (
//                             <tr key={p._id}>
//                               <td className="ps-4">
//                                 <div className="small fw-bold">Rx-Record</div>
//                                 <div
//                                   className="text-muted"
//                                   style={{ fontSize: "0.7rem" }}
//                                 >
//                                   {new Date(p.createdAt).toLocaleDateString()}
//                                 </div>
//                               </td>
//                               <td>
//                                 <Badge
//                                   bg={
//                                     p.status === "Approved" ? "success" : "info"
//                                   }
//                                   className="rounded-pill"
//                                 >
//                                   {p.status}
//                                 </Badge>
//                               </td>
//                               <td className="pe-4 text-end">
//                                 <Button
//                                   variant="light"
//                                   size="sm"
//                                   className="rounded-circle border"
//                                   onClick={() => window.open(p.image, "_blank")}
//                                 >
//                                   <Eye size={14} />
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Tab>

//             <Tab
//               eventKey="security"
//               title={
//                 <>
//                   <Shield size={18} className="me-2" /> Security
//                 </>
//               }
//             >
//               <Card className="border-0 shadow-sm rounded-4">
//                 <Card.Body className="p-4">
//                   <h6 className="fw-bold mb-3">Account Security</h6>
//                   <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3">
//                     <div>
//                       <div className="fw-bold small">Change Password</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         Update your login credentials regularly.
//                       </div>
//                     </div>
//                     <Button variant="white" className="btn-sm border shadow-sm">
//                       Update
//                     </Button>
//                   </div>
//                   <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
//                     <div>
//                       <div className="fw-bold small">Two-Factor Auth</div>
//                       <div
//                         className="text-muted"
//                         style={{ fontSize: "0.75rem" }}
//                       >
//                         Secure your account with OTP.
//                       </div>
//                     </div>
//                     <Form.Check type="switch" id="2fa" defaultChecked />
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Tab>
//           </Tabs>
//         </Col>
//       </Row>
//       <style>{`.hover-scale:hover { transform: scale(1.1); transition: transform 0.2s; }`}</style>
//     </Container>
//   );
// };

// export default ProfilePage;

// import React, { useEffect, useState, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Badge,
//   Image,
//   Table,
//   ProgressBar,
//   Tab,
//   Tabs,
//   Alert,
//   Spinner,
// } from "react-bootstrap";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Activity,
//   Shield,
//   Edit2,
//   ShoppingBag,
//   Eye,
//   Camera,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   HeartPulse,
//   Droplet,
//   UserCheck,
//   Loader2,
// } from "lucide-react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   // Consolidated profile state
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//     address: "",
//     bloodGroup: "",
//     allergies: "",
//     chronicConditions: "",
//     emergencyContact: "",
//     profilePhoto: "",
//   });

//   // Backup state for Cancel action
//   const [initialProfile, setInitialProfile] = useState({});

//   // Image Upload State
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const [orders, setOrders] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);

//   // UI States
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [dataLoading, setDataLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");

//   // Options
//   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//   const genders = ["Male", "Female", "Other", "Prefer not to say"];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setDataLoading(true);
//         const [userRes, orderRes, presRes] = await Promise.allSettled([
//           api.get("/users/profile"),
//           api.get("/orders/my"),
//           api.get("/prescriptions/my"),
//         ]);

//         if (userRes.status === "fulfilled") {
//           const userData = userRes.value.data;

//           let addrString = userData.address || "";
//           if (
//             typeof userData.address === "object" &&
//             userData.address !== null
//           ) {
//             addrString = [
//               userData.address.street,
//               userData.address.city,
//               userData.address.province,
//               userData.address.postalCode,
//             ]
//               .filter(Boolean)
//               .join(", ");
//           }

//           const phoneString = userData.phone ? String(userData.phone) : "";

//           const formattedData = {
//             name: userData.name || "",
//             email: userData.email || "",
//             phone: phoneString,
//             address: addrString,
//             profilePhoto: userData.profilePhoto || "",
//             dob: userData.dob
//               ? new Date(userData.dob).toISOString().split("T")[0]
//               : "",
//             gender: userData.gender || "",
//             bloodGroup: userData.bloodGroup || "",
//             allergies: userData.allergies || "",
//             chronicConditions: userData.chronicConditions || "",
//             emergencyContact: userData.emergencyContact || "",
//           };
//           setProfile(formattedData);
//           setInitialProfile(formattedData);
//         }

//         if (orderRes.status === "fulfilled") {
//           setOrders(orderRes.value.data || []);
//         }

//         if (presRes.status === "fulfilled") {
//           setPrescriptions(presRes.value.data || []);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to sync profile data with server.");
//       } finally {
//         setDataLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((p) => ({ ...p, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedFile(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleCancel = () => {
//     setProfile(initialProfile);
//     setPreview(null);
//     setSelectedFile(null);
//     setEditing(false);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const formData = new FormData();
//       Object.keys(profile).forEach((key) => {
//         if (key !== "profilePhoto") {
//           formData.append(key, profile[key] || "");
//         }
//       });

//       if (selectedFile) {
//         formData.append("profilePhoto", selectedFile); // Using profilePhoto to match state
//       }

//       const { data } = await api.put("/users/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       let addrString = data.address || "";
//       if (typeof data.address === "object" && data.address !== null) {
//         addrString = [
//           data.address.street,
//           data.address.city,
//           data.address.province,
//         ]
//           .filter(Boolean)
//           .join(", ");
//       }

//       const updatedData = {
//         ...data,
//         address: addrString,
//         dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
//       };

//       setProfile(updatedData);
//       setInitialProfile(updatedData);
//       setPreview(null);
//       setSelectedFile(null);
//       setMessage("Profile details saved successfully.");
//       setEditing(false);
//       setTimeout(() => setMessage(""), 3000);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateCompletion = () => {
//     const fields = [
//       "name",
//       "email",
//       "phone",
//       "address",
//       "bloodGroup",
//       "emergencyContact",
//     ];
//     const filled = fields.filter((field) => {
//       const val = profile[field];
//       return val && String(val).trim() !== "";
//     }).length;
//     return Math.round((filled / fields.length) * 100);
//   };

//   // ✅ ROBUST IMAGE FORMATTER (Same as Doctor UI)
//   const getProfileImage = () => {
//     // 1. If user just selected a new photo, show the live preview immediately
//     if (preview) return preview;

//     // 2. Otherwise, check if they have a saved photo in the database
//     const photoPath = profile.profilePhoto || user?.profilePhoto;

//     // ✅ Block the specific sample path that is causing 404s/500s in logs
//     if (
//       photoPath &&
//       photoPath !== "none" &&
//       !photoPath.includes("sample-doctor.jpg")
//     ) {
//       if (photoPath.startsWith("http")) return photoPath;

//       let cleanPath = photoPath.replace(/\\/g, "/");
//       if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

//       return `http://localhost:5000${cleanPath}`;
//     }

//     // 3. Fallback: Professional Name Initials
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=eff6ff&color=2563eb&size=128`;
//   };

//   return (
//     <div
//       className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
//       style={{ backgroundColor: "#f8fafc" }}
//     >
//       {/* Header */}
//       <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
//         <button
//           className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
//           onClick={() => navigate("/customer-dashboard")}
//           title="Back to Dashboard"
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <h3 className="fw-black mb-0 text-dark tracking-tight">My Account</h3>
//       </div>

//       <Container className="p-0">
//         {/* Top Profile Banner */}
//         <div
//           className="bg-white border border-light-subtle shadow-sm rounded-4 mb-4 overflow-hidden position-relative"
//           style={{ minHeight: "200px" }}
//         >
//           {/* Decorative background */}
//           <div
//             className="bg-primary position-absolute top-0 w-100"
//             style={{ height: "100px", opacity: 0.1 }}
//           ></div>

//           <div className="p-4 pt-5 d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 position-relative z-1">
//             <div className="position-relative">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 hidden
//                 accept="image/*"
//               />
//               <img
//                 src={getProfileImage()}
//                 alt="Profile"
//                 className="rounded-circle object-fit-cover shadow border border-4 border-white bg-white"
//                 style={{ width: "130px", height: "130px" }}
//               />
//               {editing && (
//                 <button
//                   className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center hover-lift border border-2 border-white"
//                   onClick={() => fileInputRef.current.click()}
//                   title="Change Photo"
//                 >
//                   <Camera size={16} />
//                 </button>
//               )}
//             </div>

//             <div className="flex-grow-1 text-center text-md-start mb-2">
//               <h2 className="fw-black text-dark mb-1">{profile.name}</h2>
//               <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
//                 <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill shadow-sm">
//                   {user?.role === "customer" ? "Patient Account" : "Admin"}
//                 </span>
//                 <span className="text-muted small fw-medium">
//                   ID: #{user?._id?.slice(-6).toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             <div className="mb-2 w-100 w-md-auto" style={{ maxWidth: "300px" }}>
//               <div className="d-flex justify-content-between small fw-bold mb-2">
//                 <span className="text-muted">Profile Setup</span>
//                 <span className="text-primary">{calculateCompletion()}%</span>
//               </div>
//               <ProgressBar
//                 now={calculateCompletion()}
//                 variant="primary"
//                 style={{ height: "8px" }}
//                 className="rounded-pill bg-light border"
//               />

//               {!editing && (
//                 <button
//                   className="btn btn-white w-100 border-light-subtle rounded-pill mt-3 shadow-sm fw-bold text-dark hover-lift d-flex align-items-center justify-content-center gap-2"
//                   onClick={() => setEditing(true)}
//                 >
//                   <Edit2 size={16} className="text-primary" /> Edit Profile
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Alerts */}
//         {message && (
//           <Alert
//             variant="success"
//             className="rounded-4 shadow-sm border-0 d-flex align-items-center fw-bold"
//           >
//             <CheckCircle size={18} className="me-2" /> {message}
//           </Alert>
//         )}
//         {error && (
//           <Alert
//             variant="danger"
//             className="rounded-4 shadow-sm border-0 d-flex align-items-center fw-bold"
//           >
//             <AlertCircle size={18} className="me-2" /> {error}
//           </Alert>
//         )}

//         <Row className="g-4">
//           {/* --- LEFT COLUMN --- */}
//           <Col lg={4}>
//             {editing ? (
//               /* --- EDIT MODE --- */
//               <div className="bg-white border border-light-subtle shadow-sm rounded-4 overflow-hidden mb-4">
//                 <div className="bg-light bg-opacity-50 p-3 border-bottom border-light-subtle">
//                   <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//                     <Edit2 size={16} className="text-primary" /> Update Details
//                   </h6>
//                 </div>
//                 <div className="p-4">
//                   <Form onSubmit={handleSubmit}>
//                     <h6 className="text-muted small fw-bold text-uppercase mb-3 tracking-wider">
//                       Personal Info
//                     </h6>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="small fw-semibold text-muted">
//                         Full Name
//                       </Form.Label>
//                       <Form.Control
//                         className="modern-input"
//                         name="name"
//                         value={profile.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Row className="g-2 mb-3">
//                       <Col xs={6}>
//                         <Form.Group>
//                           <Form.Label className="small fw-semibold text-muted">
//                             Gender
//                           </Form.Label>
//                           <Form.Select
//                             className="modern-input cursor-pointer"
//                             name="gender"
//                             value={profile.gender}
//                             onChange={handleChange}
//                           >
//                             <option value="">Select...</option>
//                             {genders.map((g) => (
//                               <option key={g} value={g}>
//                                 {g}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                       <Col xs={6}>
//                         <Form.Group>
//                           <Form.Label className="small fw-semibold text-muted">
//                             Birth Date
//                           </Form.Label>
//                           <Form.Control
//                             type="date"
//                             className="modern-input"
//                             name="dob"
//                             value={profile.dob}
//                             onChange={handleChange}
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="small fw-semibold text-muted">
//                         Phone Number
//                       </Form.Label>
//                       <Form.Control
//                         className="modern-input"
//                         name="phone"
//                         value={profile.phone}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="small fw-semibold text-muted">
//                         Address
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         className="modern-input"
//                         name="address"
//                         value={profile.address}
//                         onChange={handleChange}
//                       />
//                     </Form.Group>

//                     <div className="border-top border-light-subtle my-4"></div>

//                     <h6 className="text-muted small fw-bold text-uppercase mb-3 tracking-wider">
//                       Medical Profile
//                     </h6>
//                     <Row className="g-2 mb-3">
//                       <Col xs={5}>
//                         <Form.Group>
//                           <Form.Label className="small fw-semibold text-muted">
//                             Blood Type
//                           </Form.Label>
//                           <Form.Select
//                             className="modern-input cursor-pointer"
//                             name="bloodGroup"
//                             value={profile.bloodGroup}
//                             onChange={handleChange}
//                           >
//                             <option value="">--</option>
//                             {bloodGroups.map((bg) => (
//                               <option key={bg} value={bg}>
//                                 {bg}
//                               </option>
//                             ))}
//                           </Form.Select>
//                         </Form.Group>
//                       </Col>
//                       <Col xs={7}>
//                         <Form.Group>
//                           <Form.Label className="small fw-semibold text-muted">
//                             Emergency Contact
//                           </Form.Label>
//                           <Form.Control
//                             className="modern-input"
//                             name="emergencyContact"
//                             value={profile.emergencyContact}
//                             onChange={handleChange}
//                             placeholder="Name & Phone"
//                           />
//                         </Form.Group>
//                       </Col>
//                     </Row>
//                     <Form.Group className="mb-3">
//                       <Form.Label className="small fw-semibold text-muted">
//                         Allergies
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         className="modern-input"
//                         name="allergies"
//                         value={profile.allergies}
//                         onChange={handleChange}
//                         placeholder="e.g. Peanuts, Penicillin"
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-4">
//                       <Form.Label className="small fw-semibold text-muted">
//                         Chronic Conditions
//                       </Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         rows={2}
//                         className="modern-input"
//                         name="chronicConditions"
//                         value={profile.chronicConditions}
//                         onChange={handleChange}
//                         placeholder="e.g. Diabetes, Asthma"
//                       />
//                     </Form.Group>

//                     <div className="d-flex gap-2">
//                       <button
//                         type="submit"
//                         className="btn btn-primary rounded-pill fw-bold flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2"
//                         disabled={loading}
//                       >
//                         {loading ? (
//                           <Loader2 size={16} className="spin-animation" />
//                         ) : (
//                           "Save Changes"
//                         )}
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-white border-light-subtle rounded-pill fw-bold px-4"
//                         onClick={handleCancel}
//                         disabled={loading}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </Form>
//                 </div>
//               </div>
//             ) : (
//               /* --- VIEW MODE --- */
//               <div className="d-flex flex-column gap-4">
//                 {/* Contact Card */}
//                 <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4">
//                   <h6 className="fw-bolder mb-4 text-dark d-flex align-items-center gap-2 border-bottom pb-2">
//                     <UserCheck size={18} className="text-primary" /> Contact
//                     Information
//                   </h6>
//                   <div className="d-flex flex-column gap-3">
//                     <div className="d-flex gap-3 align-items-center">
//                       <div className="bg-light p-2 rounded-circle text-primary">
//                         <Mail size={16} />
//                       </div>
//                       <div>
//                         <div
//                           className="text-muted small fw-bold text-uppercase"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           Email Address
//                         </div>
//                         <div className="fw-medium text-dark">
//                           {profile.email}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="d-flex gap-3 align-items-center">
//                       <div className="bg-light p-2 rounded-circle text-primary">
//                         <Phone size={16} />
//                       </div>
//                       <div>
//                         <div
//                           className="text-muted small fw-bold text-uppercase"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           Phone Number
//                         </div>
//                         <div className="fw-medium text-dark">
//                           {profile.phone || (
//                             <span className="text-muted fst-italic">
//                               Not set
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="d-flex gap-3 align-items-center">
//                       <div className="bg-light p-2 rounded-circle text-primary">
//                         <MapPin size={16} />
//                       </div>
//                       <div>
//                         <div
//                           className="text-muted small fw-bold text-uppercase"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           Delivery Address
//                         </div>
//                         <div className="fw-medium text-dark">
//                           {profile.address || (
//                             <span className="text-muted fst-italic">
//                               Not set
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="d-flex gap-3 align-items-center">
//                       <div className="bg-light p-2 rounded-circle text-primary">
//                         <Calendar size={16} />
//                       </div>
//                       <div>
//                         <div
//                           className="text-muted small fw-bold text-uppercase"
//                           style={{ fontSize: "0.65rem" }}
//                         >
//                           Date of Birth / Gender
//                         </div>
//                         <div className="fw-medium text-dark">
//                           {profile.dob || "N/A"} • {profile.gender || "N/A"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Medical Card */}
//                 <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4 position-relative overflow-hidden">
//                   <div className="position-absolute top-0 end-0 p-3 opacity-10">
//                     <HeartPulse size={80} className="text-danger" />
//                   </div>
//                   <h6 className="fw-bolder mb-4 text-dark d-flex align-items-center gap-2 border-bottom pb-2 position-relative z-1">
//                     <Activity size={18} className="text-danger" /> Medical
//                     Overview
//                   </h6>

//                   <div className="d-flex flex-column gap-3 position-relative z-1">
//                     <div className="d-flex justify-content-between align-items-center bg-light border border-light-subtle p-2 rounded-3 px-3">
//                       <span className="small fw-bold text-muted d-flex align-items-center gap-2">
//                         <Droplet size={14} className="text-danger" /> Blood
//                         Group
//                       </span>
//                       <span className="badge bg-danger rounded-pill shadow-sm px-3">
//                         {profile.bloodGroup || "Unknown"}
//                       </span>
//                     </div>

//                     <div>
//                       <span
//                         className="small fw-bold text-muted text-uppercase tracking-wider d-block mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Allergies
//                       </span>
//                       <div className="bg-light border border-light-subtle p-2 rounded-3 small fw-medium text-dark">
//                         {profile.allergies || "No allergies declared"}
//                       </div>
//                     </div>

//                     <div>
//                       <span
//                         className="small fw-bold text-muted text-uppercase tracking-wider d-block mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Chronic Conditions
//                       </span>
//                       <div className="bg-light border border-light-subtle p-2 rounded-3 small fw-medium text-dark">
//                         {profile.chronicConditions || "No conditions declared"}
//                       </div>
//                     </div>

//                     <div className="border-start border-warning border-4 ps-3 py-1 mt-2">
//                       <span
//                         className="small fw-bold text-warning text-uppercase tracking-wider d-block mb-1"
//                         style={{ fontSize: "0.7rem" }}
//                       >
//                         Emergency Contact
//                       </span>
//                       <span className="fw-bolder text-dark">
//                         {profile.emergencyContact || "Not configured"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Col>

//           {/* --- RIGHT COLUMN (TABS) --- */}
//           <Col lg={8}>
//             <Tabs
//               activeKey={activeTab}
//               onSelect={(k) => setActiveTab(k)}
//               className="mb-4 custom-tabs border-0 ecom-tabs"
//             >
//               <Tab
//                 eventKey="overview"
//                 title={
//                   <span className="fw-bold px-2 py-1">
//                     <ShoppingBag size={16} className="me-1 mb-1" /> Recent
//                     Activity
//                   </span>
//                 }
//               >
//                 {/* Orders Section */}
//                 <div className="bg-white border border-light-subtle shadow-sm rounded-4 mb-4 overflow-hidden">
//                   <div className="bg-light bg-opacity-50 p-3 px-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
//                     <h6 className="fw-bolder mb-0 text-dark">Recent Orders</h6>
//                     <button
//                       className="btn btn-link text-primary text-decoration-none small fw-bold p-0"
//                       onClick={() => navigate("/customer-orders")}
//                     >
//                       View All
//                     </button>
//                   </div>
//                   <div className="p-0">
//                     {orders.length === 0 ? (
//                       <div className="p-5 text-center text-muted small fw-medium">
//                         No order history found.
//                       </div>
//                     ) : (
//                       <div className="table-responsive">
//                         <Table
//                           hover
//                           className="align-middle mb-0 custom-saas-table border-0"
//                         >
//                           <thead className="bg-white">
//                             <tr>
//                               <th className="ps-4">Order Ref</th>
//                               <th>Date</th>
//                               <th>Total Amount</th>
//                               <th className="pe-4 text-end">Status</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {orders.slice(0, 5).map((o) => (
//                               <tr key={o._id}>
//                                 <td className="ps-4 fw-bold font-monospace text-secondary">
//                                   #{o._id.slice(-6).toUpperCase()}
//                                 </td>
//                                 <td className="small fw-medium text-dark">
//                                   {new Date(o.createdAt).toLocaleDateString()}
//                                 </td>
//                                 <td className="fw-bolder text-dark">
//                                   Rs. {o.totalPrice}
//                                 </td>
//                                 <td className="pe-4 text-end">
//                                   <span
//                                     className={`badge rounded-pill shadow-sm px-3 border ${o.status === "Delivered" ? "bg-success bg-opacity-10 text-success border-success" : "bg-warning bg-opacity-10 text-warning border-warning"}`}
//                                   >
//                                     {o.status}
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Prescriptions Section */}
//                 <div className="bg-white border border-light-subtle shadow-sm rounded-4 overflow-hidden">
//                   <div className="bg-light bg-opacity-50 p-3 px-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
//                     <h6 className="fw-bolder mb-0 text-dark">
//                       Uploaded Prescriptions
//                     </h6>
//                   </div>
//                   <div className="p-0">
//                     {prescriptions.length === 0 ? (
//                       <div className="p-5 text-center text-muted small fw-medium">
//                         No medical documents uploaded.
//                       </div>
//                     ) : (
//                       <div className="table-responsive">
//                         <Table
//                           hover
//                           className="align-middle mb-0 custom-saas-table border-0"
//                         >
//                           <thead className="bg-white">
//                             <tr>
//                               <th className="ps-4">Upload Date</th>
//                               <th>Verification</th>
//                               <th className="pe-4 text-end">Document</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {prescriptions.slice(0, 4).map((p) => (
//                               <tr key={p._id}>
//                                 <td className="ps-4">
//                                   <div
//                                     className="fw-bold text-dark"
//                                     style={{ fontSize: "0.9rem" }}
//                                   >
//                                     Rx Document
//                                   </div>
//                                   <div
//                                     className="text-muted"
//                                     style={{ fontSize: "0.75rem" }}
//                                   >
//                                     {new Date(p.createdAt).toLocaleDateString()}
//                                   </div>
//                                 </td>
//                                 <td>
//                                   <span
//                                     className={`badge rounded-pill shadow-sm px-3 border ${p.status === "Approved" ? "bg-primary bg-opacity-10 text-primary border-primary" : "bg-secondary bg-opacity-10 text-secondary border-secondary"}`}
//                                   >
//                                     {p.status}
//                                   </span>
//                                 </td>
//                                 <td className="pe-4 text-end">
//                                   <button
//                                     className="btn btn-light rounded-circle p-2 shadow-sm border text-primary hover-lift"
//                                     onClick={() =>
//                                       window.open(p.image, "_blank")
//                                     }
//                                   >
//                                     <Eye size={16} />
//                                   </button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </Tab>

//               <Tab
//                 eventKey="security"
//                 title={
//                   <span className="fw-bold px-2 py-1">
//                     <Shield size={16} className="me-1 mb-1" /> Security Settings
//                   </span>
//                 }
//               >
//                 <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4">
//                   <h6 className="fw-bolder mb-4 text-dark border-bottom pb-3">
//                     Account Security
//                   </h6>

//                   <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border border-light-subtle p-3 rounded-4 mb-3">
//                     <div className="mb-3 mb-md-0">
//                       <div className="fw-bold text-dark">Change Password</div>
//                       <div className="text-muted small">
//                         Update your login credentials regularly to keep your
//                         account safe.
//                       </div>
//                     </div>
//                     <button className="btn btn-white border-light-subtle rounded-pill fw-bold shadow-sm px-4 hover-lift text-primary">
//                       Update Password
//                     </button>
//                   </div>

//                   <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border border-light-subtle p-3 rounded-4">
//                     <div className="mb-3 mb-md-0">
//                       <div className="fw-bold text-dark">
//                         Two-Factor Authentication
//                       </div>
//                       <div className="text-muted small">
//                         Add an extra layer of security using an OTP code sent to
//                         your phone.
//                       </div>
//                     </div>
//                     <Form.Check
//                       type="switch"
//                       id="2fa-switch"
//                       className="fs-4 text-primary cursor-pointer"
//                       defaultChecked
//                     />
//                   </div>
//                 </div>
//               </Tab>
//             </Tabs>
//           </Col>
//         </Row>
//       </Container>

//       <style>{`
//         .tracking-wider { letter-spacing: 0.05em; }
//         .ecom-tabs .nav-link { color: #64748b; border: none; padding-bottom: 12px; margin-right: 15px; }
//         .ecom-tabs .nav-link.active { color: #2563eb; background: transparent; border-bottom: 3px solid #2563eb; }
//         .ecom-tabs .nav-link:hover:not(.active) { border-bottom: 3px solid #cbd5e1; color: #334155; }
//         .hover-scale:hover { transform: scale(1.1); transition: transform 0.2s; }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
  Badge,
  Image,
  Table,
  ProgressBar,
  Tab,
  Tabs,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Shield,
  Edit2,
  ShoppingBag,
  Eye,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  HeartPulse,
  Droplet,
  UserCheck,
  Loader2,
} from "lucide-react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Consolidated profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    profilePhoto: "",
  });

  // Backup state for Cancel action
  const [initialProfile, setInitialProfile] = useState({});

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // UI States
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [userRes, orderRes, presRes] = await Promise.allSettled([
          api.get("/users/profile"),
          api.get("/orders/my"),
          api.get("/prescriptions/my"),
        ]);

        if (userRes.status === "fulfilled") {
          const userData = userRes.value.data;

          let addrString = userData.address || "";
          if (
            typeof userData.address === "object" &&
            userData.address !== null
          ) {
            addrString = [
              userData.address.street,
              userData.address.city,
              userData.address.province,
              userData.address.postalCode,
            ]
              .filter(Boolean)
              .join(", ");
          }

          const phoneString = userData.phone ? String(userData.phone) : "";

          const formattedData = {
            name: userData.name || "",
            email: userData.email || "",
            phone: phoneString,
            address: addrString,
            profilePhoto: userData.profilePhoto || "",
            dob: userData.dob
              ? new Date(userData.dob).toISOString().split("T")[0]
              : "",
            gender: userData.gender || "",
            bloodGroup: userData.bloodGroup || "",
            allergies: userData.allergies || "",
            chronicConditions: userData.chronicConditions || "",
            emergencyContact: userData.emergencyContact || "",
          };
          setProfile(formattedData);
          setInitialProfile(formattedData);
        }

        if (orderRes.status === "fulfilled") {
          setOrders(orderRes.value.data || []);
        }

        if (presRes.status === "fulfilled") {
          setPrescriptions(presRes.value.data || []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to sync profile data with server.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setPreview(null);
    setSelectedFile(null);
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key !== "profilePhoto") {
          formData.append(key, profile[key] || "");
        }
      });

      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      // ✅ FIX: The multipart header MUST be here to prevent the image from turning into "{}"
      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let addrString = data.address || "";
      if (typeof data.address === "object" && data.address !== null) {
        addrString = [
          data.address.street,
          data.address.city,
          data.address.province,
        ]
          .filter(Boolean)
          .join(", ");
      }

      const updatedData = {
        ...data,
        address: addrString,
        dob: data.dob ? new Date(data.dob).toISOString().split("T")[0] : "",
      };

      setProfile(updatedData);
      setInitialProfile(updatedData);
      setPreview(null);
      setSelectedFile(null);
      setMessage("Profile details saved successfully.");
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    const fields = [
      "name",
      "email",
      "phone",
      "address",
      "bloodGroup",
      "emergencyContact",
    ];
    const filled = fields.filter((field) => {
      const val = profile[field];
      return val && String(val).trim() !== "";
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  // ✅ ROBUST IMAGE FORMATTER
  const getProfileImage = () => {
    if (preview) return preview;

    const photoPath = profile.profilePhoto || user?.profilePhoto;

    if (
      photoPath &&
      photoPath !== "none" &&
      !photoPath.includes("sample-doctor.jpg")
    ) {
      if (photoPath.startsWith("http")) return photoPath;

      let cleanPath = photoPath.replace(/\\/g, "/");
      if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;

      return `http://localhost:5000${cleanPath}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=eff6ff&color=2563eb&size=128`;
  };

  if (dataLoading)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary mb-3" size={48} />
        <span className="fw-bold text-secondary text-uppercase tracking-wider small">
          Loading Profile...
        </span>
      </div>
    );

  return (
    <div
      className="medical-dashboard-bg min-vh-100 py-4 px-3 px-md-4 px-xl-5 animate-fade-in"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="d-flex align-items-center gap-3 mb-4 border-bottom border-light-subtle pb-3">
        <button
          className="btn btn-white shadow-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-light-subtle text-secondary hover-lift"
          onClick={() => navigate("/customer-dashboard")}
          title="Back to Dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="fw-black mb-0 text-dark tracking-tight">My Account</h3>
      </div>

      <Container className="p-0">
        <div
          className="bg-white border border-light-subtle shadow-sm rounded-4 mb-4 overflow-hidden position-relative"
          style={{ minHeight: "200px" }}
        >
          <div
            className="bg-primary position-absolute top-0 w-100"
            style={{ height: "100px", opacity: 0.1 }}
          ></div>

          <div className="p-4 pt-5 d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4 position-relative z-1">
            <div className="position-relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
                accept="image/*"
              />
              <img
                src={getProfileImage()}
                alt="Profile"
                className="rounded-circle object-fit-cover shadow border border-4 border-white bg-white"
                style={{ width: "130px", height: "130px" }}
              />
              {editing && (
                <button
                  className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center hover-lift border border-2 border-white"
                  onClick={() => fileInputRef.current.click()}
                  title="Change Photo"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>

            <div className="flex-grow-1 text-center text-md-start mb-2">
              <h2 className="fw-black text-dark mb-1">{profile.name}</h2>
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill shadow-sm">
                  {user?.role === "customer" ? "Patient Account" : "Admin"}
                </span>
                <span className="text-muted small fw-medium">
                  ID: #{user?._id?.slice(-6).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mb-2 w-100 w-md-auto" style={{ maxWidth: "300px" }}>
              <div className="d-flex justify-content-between small fw-bold mb-2">
                <span className="text-muted">Profile Setup</span>
                <span className="text-primary">{calculateCompletion()}%</span>
              </div>
              <ProgressBar
                now={calculateCompletion()}
                variant="primary"
                style={{ height: "8px" }}
                className="rounded-pill bg-light border"
              />

              {!editing && (
                <button
                  className="btn btn-white w-100 border-light-subtle rounded-pill mt-3 shadow-sm fw-bold text-dark hover-lift d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setEditing(true)}
                >
                  <Edit2 size={16} className="text-primary" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {message && (
          <Alert
            variant="success"
            className="rounded-4 shadow-sm border-0 d-flex align-items-center fw-bold"
          >
            <CheckCircle size={18} className="me-2" /> {message}
          </Alert>
        )}
        {error && (
          <Alert
            variant="danger"
            className="rounded-4 shadow-sm border-0 d-flex align-items-center fw-bold"
          >
            <AlertCircle size={18} className="me-2" /> {error}
          </Alert>
        )}

        <Row className="g-4">
          <Col lg={4}>
            {editing ? (
              <div className="bg-white border border-light-subtle shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="bg-light bg-opacity-50 p-3 border-bottom border-light-subtle">
                  <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                    <Edit2 size={16} className="text-primary" /> Update Details
                  </h6>
                </div>
                <div className="p-4">
                  <Form onSubmit={handleSubmit}>
                    <h6 className="text-muted small fw-bold text-uppercase mb-3 tracking-wider">
                      Personal Info
                    </h6>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-muted">
                        Full Name
                      </Form.Label>
                      <Form.Control
                        className="modern-input"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Row className="g-2 mb-3">
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Gender
                          </Form.Label>
                          <Form.Select
                            className="modern-input cursor-pointer"
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select...</option>
                            {genders.map((g) => (
                              <option key={g} value={g}>
                                {g}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={6}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Birth Date
                          </Form.Label>
                          <Form.Control
                            type="date"
                            className="modern-input"
                            name="dob"
                            value={profile.dob}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-muted">
                        Phone Number
                      </Form.Label>
                      <Form.Control
                        className="modern-input"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-muted">
                        Address
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="modern-input"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <div className="border-top border-light-subtle my-4"></div>

                    <h6 className="text-muted small fw-bold text-uppercase mb-3 tracking-wider">
                      Medical Profile
                    </h6>
                    <Row className="g-2 mb-3">
                      <Col xs={5}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Blood Type
                          </Form.Label>
                          <Form.Select
                            className="modern-input cursor-pointer"
                            name="bloodGroup"
                            value={profile.bloodGroup}
                            onChange={handleChange}
                          >
                            <option value="">--</option>
                            {bloodGroups.map((bg) => (
                              <option key={bg} value={bg}>
                                {bg}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={7}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted">
                            Emergency Contact
                          </Form.Label>
                          <Form.Control
                            className="modern-input"
                            name="emergencyContact"
                            value={profile.emergencyContact}
                            onChange={handleChange}
                            placeholder="Name & Phone"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold text-muted">
                        Allergies
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="modern-input"
                        name="allergies"
                        value={profile.allergies}
                        onChange={handleChange}
                        placeholder="e.g. Peanuts, Penicillin"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-semibold text-muted">
                        Chronic Conditions
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        className="modern-input"
                        name="chronicConditions"
                        value={profile.chronicConditions}
                        onChange={handleChange}
                        placeholder="e.g. Diabetes, Asthma"
                      />
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill fw-bold flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 size={16} className="spin-animation" />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-white border-light-subtle rounded-pill fw-bold px-4"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4">
                  <h6 className="fw-bolder mb-4 text-dark d-flex align-items-center gap-2 border-bottom pb-2">
                    <UserCheck size={18} className="text-primary" /> Contact
                    Information
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3 align-items-center">
                      <div className="bg-light p-2 rounded-circle text-primary">
                        <Mail size={16} />
                      </div>
                      <div>
                        <div
                          className="text-muted small fw-bold text-uppercase"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Email Address
                        </div>
                        <div className="fw-medium text-dark">
                          {profile.email}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="bg-light p-2 rounded-circle text-primary">
                        <Phone size={16} />
                      </div>
                      <div>
                        <div
                          className="text-muted small fw-bold text-uppercase"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Phone Number
                        </div>
                        <div className="fw-medium text-dark">
                          {profile.phone || (
                            <span className="text-muted fst-italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="bg-light p-2 rounded-circle text-primary">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <div
                          className="text-muted small fw-bold text-uppercase"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Delivery Address
                        </div>
                        <div className="fw-medium text-dark">
                          {profile.address || (
                            <span className="text-muted fst-italic">
                              Not set
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="bg-light p-2 rounded-circle text-primary">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <div
                          className="text-muted small fw-bold text-uppercase"
                          style={{ fontSize: "0.65rem" }}
                        >
                          Date of Birth / Gender
                        </div>
                        <div className="fw-medium text-dark">
                          {profile.dob || "N/A"} • {profile.gender || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4 position-relative overflow-hidden">
                  <div className="position-absolute top-0 end-0 p-3 opacity-10">
                    <HeartPulse size={80} className="text-danger" />
                  </div>
                  <h6 className="fw-bolder mb-4 text-dark d-flex align-items-center gap-2 border-bottom pb-2 position-relative z-1">
                    <Activity size={18} className="text-danger" /> Medical
                    Overview
                  </h6>

                  <div className="d-flex flex-column gap-3 position-relative z-1">
                    <div className="d-flex justify-content-between align-items-center bg-light border border-light-subtle p-2 rounded-3 px-3">
                      <span className="small fw-bold text-muted d-flex align-items-center gap-2">
                        <Droplet size={14} className="text-danger" /> Blood
                        Group
                      </span>
                      <span className="badge bg-danger rounded-pill shadow-sm px-3">
                        {profile.bloodGroup || "Unknown"}
                      </span>
                    </div>

                    <div>
                      <span
                        className="small fw-bold text-muted text-uppercase tracking-wider d-block mb-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Allergies
                      </span>
                      <div className="bg-light border border-light-subtle p-2 rounded-3 small fw-medium text-dark">
                        {profile.allergies || "No allergies declared"}
                      </div>
                    </div>

                    <div>
                      <span
                        className="small fw-bold text-muted text-uppercase tracking-wider d-block mb-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Chronic Conditions
                      </span>
                      <div className="bg-light border border-light-subtle p-2 rounded-3 small fw-medium text-dark">
                        {profile.chronicConditions || "No conditions declared"}
                      </div>
                    </div>

                    <div className="border-start border-warning border-4 ps-3 py-1 mt-2">
                      <span
                        className="small fw-bold text-warning text-uppercase tracking-wider d-block mb-1"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Emergency Contact
                      </span>
                      <span className="fw-bolder text-dark">
                        {profile.emergencyContact || "Not configured"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>

          <Col lg={8}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4 custom-tabs border-0 ecom-tabs"
            >
              <Tab
                eventKey="overview"
                title={
                  <span className="fw-bold px-2 py-1">
                    <ShoppingBag size={16} className="me-1 mb-1" /> Recent
                    Activity
                  </span>
                }
              >
                <div className="bg-white border border-light-subtle shadow-sm rounded-4 mb-4 overflow-hidden">
                  <div className="bg-light bg-opacity-50 p-3 px-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
                    <h6 className="fw-bolder mb-0 text-dark">Recent Orders</h6>
                    <button
                      className="btn btn-link text-primary text-decoration-none small fw-bold p-0"
                      onClick={() => navigate("/customer-orders")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="p-0">
                    {orders.length === 0 ? (
                      <div className="p-5 text-center text-muted small fw-medium">
                        No order history found.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table
                          hover
                          className="align-middle mb-0 custom-saas-table border-0"
                        >
                          <thead className="bg-white">
                            <tr>
                              <th className="ps-4">Order Ref</th>
                              <th>Date</th>
                              <th>Total Amount</th>
                              <th className="pe-4 text-end">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.slice(0, 5).map((o) => (
                              <tr key={o._id}>
                                <td className="ps-4 fw-bold font-monospace text-secondary">
                                  #{o._id.slice(-6).toUpperCase()}
                                </td>
                                <td className="small fw-medium text-dark">
                                  {new Date(o.createdAt).toLocaleDateString()}
                                </td>
                                <td className="fw-bolder text-dark">
                                  Rs. {o.totalPrice}
                                </td>
                                <td className="pe-4 text-end">
                                  <span
                                    className={`badge rounded-pill shadow-sm px-3 border ${o.status === "Delivered" ? "bg-success bg-opacity-10 text-success border-success" : "bg-warning bg-opacity-10 text-warning border-warning"}`}
                                  >
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-light-subtle shadow-sm rounded-4 overflow-hidden">
                  <div className="bg-light bg-opacity-50 p-3 px-4 border-bottom border-light-subtle d-flex justify-content-between align-items-center">
                    <h6 className="fw-bolder mb-0 text-dark">
                      Uploaded Prescriptions
                    </h6>
                  </div>
                  <div className="p-0">
                    {prescriptions.length === 0 ? (
                      <div className="p-5 text-center text-muted small fw-medium">
                        No medical documents uploaded.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table
                          hover
                          className="align-middle mb-0 custom-saas-table border-0"
                        >
                          <thead className="bg-white">
                            <tr>
                              <th className="ps-4">Upload Date</th>
                              <th>Verification</th>
                              <th className="pe-4 text-end">Document</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptions.slice(0, 4).map((p) => (
                              <tr key={p._id}>
                                <td className="ps-4">
                                  <div
                                    className="fw-bold text-dark"
                                    style={{ fontSize: "0.9rem" }}
                                  >
                                    Rx Document
                                  </div>
                                  <div
                                    className="text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    {new Date(p.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td>
                                  <span
                                    className={`badge rounded-pill shadow-sm px-3 border ${p.status === "Approved" ? "bg-primary bg-opacity-10 text-primary border-primary" : "bg-secondary bg-opacity-10 text-secondary border-secondary"}`}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                                <td className="pe-4 text-end">
                                  <button
                                    className="btn btn-light rounded-circle p-2 shadow-sm border text-primary hover-lift"
                                    onClick={() =>
                                      window.open(p.image, "_blank")
                                    }
                                  >
                                    <Eye size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </div>
              </Tab>

              <Tab
                eventKey="security"
                title={
                  <span className="fw-bold px-2 py-1">
                    <Shield size={16} className="me-1 mb-1" /> Security Settings
                  </span>
                }
              >
                <div className="bg-white border border-light-subtle shadow-sm rounded-4 p-4">
                  <h6 className="fw-bolder mb-4 text-dark border-bottom pb-3">
                    Account Security
                  </h6>

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border border-light-subtle p-3 rounded-4 mb-3">
                    <div className="mb-3 mb-md-0">
                      <div className="fw-bold text-dark">Change Password</div>
                      <div className="text-muted small">
                        Update your login credentials regularly to keep your
                        account safe.
                      </div>
                    </div>
                    <button className="btn btn-white border-light-subtle rounded-pill fw-bold shadow-sm px-4 hover-lift text-primary">
                      Update Password
                    </button>
                  </div>

                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border border-light-subtle p-3 rounded-4">
                    <div className="mb-3 mb-md-0">
                      <div className="fw-bold text-dark">
                        Two-Factor Authentication
                      </div>
                      <div className="text-muted small">
                        Add an extra layer of security using an OTP code sent to
                        your phone.
                      </div>
                    </div>
                    <Form.Check
                      type="switch"
                      id="2fa-switch"
                      className="fs-4 text-primary cursor-pointer"
                      defaultChecked
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>

      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .ecom-tabs .nav-link { color: #64748b; border: none; padding-bottom: 12px; margin-right: 15px; }
        .ecom-tabs .nav-link.active { color: #2563eb; background: transparent; border-bottom: 3px solid #2563eb; }
        .ecom-tabs .nav-link:hover:not(.active) { border-bottom: 3px solid #cbd5e1; color: #334155; }
        .hover-scale:hover { transform: scale(1.1); transition: transform 0.2s; }
      `}</style>
    </div>
  );
};

export default ProfilePage;
