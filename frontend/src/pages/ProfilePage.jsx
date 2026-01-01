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

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Image,
  Table,
  ProgressBar,
  Tab,
  Tabs,
  Alert,
} from "react-bootstrap";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet, // Blood
  AlertCircle, // Allergies
  Activity, // Conditions
  Shield,
  Edit2,
  Save,
  X,
  FileText, // Prescription
  ShoppingBag, // Orders
  Eye,
  Camera,
  Truck,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const ProfilePage = () => {
  const { user } = useAuth(); // Initial user data from context

  // -- State for Profile Data (Synced with DB) --
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
  });

  // -- State for Real Lists --
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // -- State for UI --
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false); // For saving
  const [dataLoading, setDataLoading] = useState(true); // For initial fetch
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // --- 1. FETCH REAL DATA FROM API ---
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // A. Fetch Full User Profile (Personal + Medical)
        const userRes = await fetch(`${API_BASE_URL}/customer/profile`, {
          headers,
        });
        if (userRes.ok) {
          const userData = await userRes.json();

          // Handle Address Object vs String
          let addrString = "";
          if (userData.address && typeof userData.address === "object") {
            addrString = `${userData.address.street || ""}, ${
              userData.address.city || ""
            }`;
          } else {
            addrString = userData.address || "";
          }

          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            gender: userData.gender || "",
            dob: userData.dob
              ? new Date(userData.dob).toISOString().split("T")[0]
              : "",
            address: addrString,
            bloodGroup: userData.bloodGroup || "",
            allergies: userData.allergies || "",
            chronicConditions: userData.chronicConditions || "",
            emergencyContact: userData.emergencyContact || "",
          });
        }

        // B. Fetch Orders
        const orderRes = await fetch(`${API_BASE_URL}/customer/orders`, {
          headers,
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          // Handle different API response structures ({ orders: [] } vs [])
          setOrders(
            orderData.orders || (Array.isArray(orderData) ? orderData : [])
          );
        }

        // C. Fetch Prescriptions
        const presRes = await fetch(`${API_BASE_URL}/customer/prescriptions`, {
          headers,
        });
        if (presRes.ok) {
          const presData = await presRes.json();
          setPrescriptions(
            presData.prescriptions || (Array.isArray(presData) ? presData : [])
          );
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
        setError("Failed to load some profile data. Please refresh.");
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

  // --- 2. UPDATE PROFILE HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      // Use the generic update endpoint or creating a specific one if needed
      // Assuming PUT /api/users/profile updates logged in user
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          dob: profile.dob,
          address: profile.address,
          // Medical fields
          bloodGroup: profile.bloodGroup,
          allergies: profile.allergies,
          chronicConditions: profile.chronicConditions,
          emergencyContact: profile.emergencyContact,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      setMessage("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: "60vh" }}>
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 text-muted">Loading your medical profile...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* --- 1. PROFILE HEADER --- */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div
          className="bg-light p-4 d-flex flex-column flex-md-row align-items-center gap-4"
          style={{ background: "linear-gradient(to right, #e3f2fd, #ffffff)" }}
        >
          {/* Avatar */}
          <div className="position-relative">
            <Image
              src={
                user.profilePhoto ||
                `https://ui-avatars.com/api/?name=${profile.name}&background=0d6efd&color=fff`
              }
              roundedCircle
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                border: "4px solid white",
              }}
              className="shadow-sm"
            />
            {/* Camera Icon - Placeholder for upload functionality */}
            <div
              className="position-absolute bottom-0 end-0 bg-white p-1 rounded-circle shadow-sm text-primary cursor-pointer"
              title="Change Photo (Coming Soon)"
            >
              <Camera size={20} />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-grow-1 text-center text-md-start">
            <h2 className="fw-bold mb-1">{profile.name}</h2>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-2 text-muted">
              <span className="small">
                Customer ID:{" "}
                <strong className="text-dark">
                  #{user._id?.slice(-6).toUpperCase()}
                </strong>
              </span>
              <span className="mx-1">•</span>
              <Badge
                bg={user.accountStatus === "verified" ? "success" : "primary"}
                className="fw-normal"
              >
                {user.accountStatus || "Active"}
              </Badge>
            </div>

            {/* Dynamic Profile Strength */}
            <div
              className="d-flex align-items-center gap-2"
              style={{ maxWidth: "300px" }}
            >
              <small className="text-muted">Profile Strength</small>
              {/* 100% if blood group is set, else 50% */}
              <ProgressBar
                now={profile.bloodGroup ? 90 : 50}
                variant={profile.bloodGroup ? "success" : "warning"}
                style={{ height: "6px", flex: 1 }}
              />
              <small
                className={
                  profile.bloodGroup
                    ? "fw-bold text-success"
                    : "fw-bold text-warning"
                }
              >
                {profile.bloodGroup ? "90%" : "50%"}
              </small>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            {!editing && (
              <Button
                variant="outline-primary"
                className="rounded-pill px-4"
                onClick={() => setEditing(true)}
              >
                <Edit2 size={16} className="me-2" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Messages */}
      {message && (
        <Alert variant="success" dismissible onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* --- LEFT COLUMN: Personal & Medical Info --- */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 mb-4 h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="fw-bold text-primary mb-0">
                <User size={20} className="me-2" />
                Personal Information
              </h5>
            </Card.Header>
            <Card.Body>
              {editing ? (
                /* EDIT MODE FORM */
                <Form onSubmit={handleSubmit}>
                  <h6 className="text-muted small border-bottom pb-2 mb-3">
                    General
                  </h6>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      size="sm"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      size="sm"
                    />
                  </Form.Group>
                  <Row>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          size="sm"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">DOB</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={profile.dob}
                          onChange={handleChange}
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label className="small">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      size="sm"
                    />
                  </Form.Group>

                  <h6 className="text-muted small border-bottom pb-2 mb-3 mt-4">
                    Medical
                  </h6>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Blood Group</Form.Label>
                    <Form.Control
                      type="text"
                      name="bloodGroup"
                      value={profile.bloodGroup}
                      onChange={handleChange}
                      size="sm"
                      placeholder="e.g. O+"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Allergies</Form.Label>
                    <Form.Control
                      type="text"
                      name="allergies"
                      value={profile.allergies}
                      onChange={handleChange}
                      size="sm"
                      placeholder="e.g. Peanuts"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Conditions</Form.Label>
                    <Form.Control
                      type="text"
                      name="chronicConditions"
                      value={profile.chronicConditions}
                      onChange={handleChange}
                      size="sm"
                      placeholder="e.g. Asthma"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small">Emergency Contact</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContact"
                      value={profile.emergencyContact}
                      onChange={handleChange}
                      size="sm"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      variant="primary"
                      type="submit"
                      size="sm"
                      className="w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save size={16} className="me-1" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      className="w-100"
                      onClick={() => setEditing(false)}
                    >
                      <X size={16} className="me-1" /> Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                /* READ ONLY VIEW */
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                      <Mail size={16} />
                    </div>
                    <div>
                      <div className="small text-muted">Email</div>
                      <div className="fw-medium text-break">
                        {profile.email}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                      <Phone size={16} />
                    </div>
                    <div>
                      <div className="small text-muted">Phone</div>
                      <div className="fw-medium">
                        {profile.phone || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="small text-muted">Gender</div>
                      <div className="fw-medium">
                        {profile.gender || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="small text-muted">DOB</div>
                      <div className="fw-medium">
                        {profile.dob || "Not set"}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3 text-primary">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="small text-muted">Address</div>
                      <div className="fw-medium">
                        {profile.address || "Not set"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* 3. MEDICAL INFORMATION (Read Only View) */}
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-danger bg-opacity-10 border-0 pt-4 pb-0">
              <h5 className="fw-bold text-danger mb-0">
                <Activity size={20} className="me-2" />
                Medical Information
              </h5>
            </Card.Header>
            <Card.Body>
              {!editing ? (
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <div className="d-flex align-items-center text-muted">
                      <Droplet size={16} className="me-2" />
                      Blood
                    </div>
                    <Badge
                      bg={profile.bloodGroup ? "danger" : "light"}
                      text={profile.bloodGroup ? "white" : "dark"}
                      className="rounded-pill px-3"
                    >
                      {profile.bloodGroup || "Not Set"}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <div className="d-flex align-items-center text-muted">
                      <AlertCircle size={16} className="me-2" />
                      Allergies
                    </div>
                    <span className="fw-medium text-end small">
                      {profile.allergies || "None"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                    <div className="d-flex align-items-center text-muted">
                      <Activity size={16} className="me-2" />
                      Conditions
                    </div>
                    <span className="fw-medium text-end small">
                      {profile.chronicConditions || "None"}
                    </span>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-2 rounded mt-2">
                    <div className="small text-muted mb-1">
                      Emergency Contact
                    </div>
                    <div className="fw-bold text-dark">
                      {profile.emergencyContact || "Not Set"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <small>Editing in form above...</small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* --- RIGHT COLUMN: History & Security --- */}
        <Col lg={8}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 border-0 custom-tabs"
          >
            <Tab eventKey="overview" title="History & Orders">
              {/* 4. PRESCRIPTION HISTORY (REAL DATA) */}
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0 text-primary">
                    <FileText size={20} className="me-2" />
                    Prescriptions
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {prescriptions.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                      <FileText size={40} className="mb-2 opacity-50" />
                      <p>No prescriptions uploaded yet.</p>
                    </div>
                  ) : (
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4">Date</th>
                          <th>Status</th>
                          <th>Notes</th>
                          <th className="text-end pe-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.map((p) => (
                          <tr key={p._id}>
                            <td className="ps-4">
                              {new Date(p.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <Badge
                                bg={
                                  p.status === "approved"
                                    ? "success"
                                    : p.status === "rejected"
                                    ? "danger"
                                    : "warning"
                                }
                                className="rounded-pill fw-normal"
                              >
                                {p.status}
                              </Badge>
                            </td>
                            <td
                              className="text-truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {p.notes || "No notes provided"}
                            </td>
                            <td className="text-end pe-4">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="rounded-pill"
                                href={`${API_BASE_URL}${p.imageUrl}`} // Adjust path if needed based on backend
                                target="_blank"
                              >
                                <Eye size={14} className="me-1" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>

              {/* 5. ORDER HISTORY (REAL DATA) */}
              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Header className="bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0 text-success">
                    <ShoppingBag size={20} className="me-2" />
                    Recent Orders
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {orders.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                      <ShoppingBag size={40} className="mb-2 opacity-50" />
                      <p>No orders placed yet.</p>
                    </div>
                  ) : (
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4">Order ID</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th className="text-end pe-4">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id}>
                            <td className="ps-4 fw-medium text-primary">
                              #{o._id.slice(-6).toUpperCase()}
                            </td>
                            <td>
                              {new Date(o.createdAt).toLocaleDateString()}
                            </td>
                            <td className="fw-bold">
                              ₹{o.totalAmount || o.price || 0}
                            </td>
                            <td>
                              <Badge
                                bg={
                                  o.status === "delivered"
                                    ? "success"
                                    : o.status === "cancelled"
                                    ? "danger"
                                    : "info"
                                }
                                className="rounded-pill fw-normal"
                              >
                                {o.status}
                              </Badge>
                            </td>
                            <td className="text-end pe-4">
                              <Button
                                variant="light"
                                size="sm"
                                className="rounded-pill text-primary border"
                              >
                                Invoice
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="security" title="Security Settings">
              {/* 6. SECURITY SETTINGS (UI Only for now) */}
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">
                    <Shield size={20} className="me-2" />
                    Security & Login
                  </h5>

                  <Row className="mb-4 align-items-center">
                    <Col md={8}>
                      <h6 className="mb-1">Change Password</h6>
                      <p className="text-muted small mb-0">
                        It's a good idea to use a strong password that you're
                        not using elsewhere.
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <Button
                        variant="outline-primary"
                        className="rounded-pill"
                      >
                        Update Password
                      </Button>
                    </Col>
                  </Row>
                  <hr className="bg-light" />
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h6 className="mb-1">Two-Factor Authentication</h6>
                      <p className="text-muted small mb-0">
                        Add an extra layer of security to your account.
                      </p>
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                      <Form.Check
                        type="switch"
                        id="2fa-switch"
                        label="Enable 2FA"
                        className="fs-5"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      <style jsx>{`
        .custom-tabs .nav-link {
          color: #6c757d;
          font-weight: 500;
          border: none;
          border-bottom: 3px solid transparent;
          padding-bottom: 12px;
        }
        .custom-tabs .nav-link.active {
          color: #0d6efd;
          background: transparent;
          border-bottom: 3px solid #0d6efd;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default ProfilePage;
