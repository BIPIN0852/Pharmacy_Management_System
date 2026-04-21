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

  //  ROBUST IMAGE FORMATTER
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

      return `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "")}${cleanPath}`;
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
