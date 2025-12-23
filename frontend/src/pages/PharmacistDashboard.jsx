import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import avatar from "../assets/avatar.jpg";

const API_BASE_URL = "http://localhost:5000/api";

// Sorting hook
function useSortableData(items, config = null) {
  const [sortConfig, setSortConfig] = useState(config);
  const sortedItems = useMemo(() => {
    const sortable = [...items];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      sortable.sort((a, b) => {
        const av = a[key];
        const bv = b[key];
        if (typeof av === "number" && typeof bv === "number") {
          return direction === "ascending" ? av - bv : bv - av;
        }
        const sa = String(av ?? "").toLowerCase();
        const sb = String(bv ?? "").toLowerCase();
        if (sa < sb) return direction === "ascending" ? -1 : 1;
        if (sa > sb) return direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}

const TablePagination = ({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <div className="d-flex align-items-center gap-2">
        <label className="mb-0">Rows</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="form-select form-select-sm"
          style={{ width: "70px" }}
        >
          {[5, 10, 15].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const PharmacistDashboard = () => {
  const navigate = useNavigate();

  // layout/ui
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard"); // dashboard | orders | medicines

  // orders
  const [ordersQuery, setOrdersQuery] = useState("");
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(5);
  const [orders, setOrders] = useState([]);

  // medicines
  const [medicines, setMedicines] = useState([]);
  const [medQuery, setMedQuery] = useState("");
  const [medPage, setMedPage] = useState(1);
  const [medPageSize, setMedPageSize] = useState(5);

  // extra data
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [extraError, setExtraError] = useState("");

  const [prescriptionsPreview, setPrescriptionsPreview] = useState({});

  const bgMain = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardBg = darkMode ? "bg-secondary" : "bg-white";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchAll = async () => {
      try {
        setLoadingExtra(true);
        setExtraError("");
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, medsRes, pRes, aRes, dRes] = await Promise.all([
          fetch(`${API_BASE_URL}/pharmacist/orders`, { headers }),
          fetch(`${API_BASE_URL}/pharmacist/medicines`, { headers }),
          fetch(`${API_BASE_URL}/pharmacist/prescriptions`, { headers }),
          fetch(`${API_BASE_URL}/appointments/pharmacist/appointments`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/pharmacist/doctors`, { headers }),
        ]);

        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        if (!medsRes.ok) throw new Error("Failed to fetch medicines");
        if (!pRes.ok) throw new Error("Failed to fetch prescriptions");
        if (!aRes.ok) throw new Error("Failed to fetch appointments");
        if (!dRes.ok) throw new Error("Failed to fetch doctors");

        const [ordersData, medsData, pData, aData, dData] = await Promise.all([
          ordersRes.json(),
          medsRes.json(),
          pRes.json(),
          aRes.json(),
          dRes.json(),
        ]);

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setMedicines(Array.isArray(medsData) ? medsData : []);
        setPrescriptionsData(Array.isArray(pData) ? pData : []);
        setAppointmentsData(Array.isArray(aData) ? aData : []);
        setDoctorsData(Array.isArray(dData) ? dData : []);
      } catch (err) {
        console.error("Pharmacist dashboard fetch error:", err);
        setExtraError(err.message || "Failed to load dashboard data");
        setOrders([]);
        setMedicines([]);
        setPrescriptionsData([]);
        setAppointmentsData([]);
        setDoctorsData([]);
      } finally {
        setLoadingExtra(false);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePrescriptionUpload = (orderId, file) => {
    if (!file) return;
    setPrescriptionsPreview((prev) => ({
      ...prev,
      [orderId]: URL.createObjectURL(file),
    }));
  };

  // demo payment handlers
  const handleStripePayment = (orderId) => {
    alert("Redirecting to Stripe Checkout (demo)...");
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: "Paid via Stripe" } : o
      )
    );
  };
  const handleESWAPayment = (orderId) => {
    alert("Processing ESWA payment (demo)...");
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: "Paid via ESWA" } : o
      )
    );
  };
  const handleCODPayment = (orderId) => {
    alert("Order marked as Cash on Delivery (demo).");
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: "Pending (COD)" } : o
      )
    );
  };

  const menuItems = [
    { key: "dashboard", name: "Dashboard", icon: Users },
    { key: "orders", name: "Orders", icon: ShoppingCart },
    { key: "medicines", name: "Medicines", icon: Package },
  ];

  // Orders list
  const { items: sortedOrders, requestSort: requestSortOrder } =
    useSortableData(orders);
  const filteredOrders = sortedOrders.filter((o) => {
    const q = ordersQuery.toLowerCase();
    return (
      o.customer?.toLowerCase().includes(q) ||
      o.medicine?.toLowerCase().includes(q) ||
      String(o.id ?? o._id).includes(q)
    );
  });
  const ordersPageItems = filteredOrders.slice(
    (ordersPage - 1) * ordersPageSize,
    ordersPage * ordersPageSize
  );

  // Medicines list
  const { items: sortedMeds, requestSort: requestSortMed } =
    useSortableData(medicines);
  const filteredMeds = sortedMeds.filter((m) => {
    const q = medQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.category?.toLowerCase().includes(q) ||
      String(m.id ?? m._id).includes(q)
    );
  });
  const medsPageItems = filteredMeds.slice(
    (medPage - 1) * medPageSize,
    medPage * medPageSize
  );

  return (
    <div
      className={`d-flex min-vh-100 flex-column ${bgMain}`}
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Mobile top bar (same pattern as customer) */}
      <header className="d-flex d-lg-none justify-content-between align-items-center bg-primary text-light px-3 py-2 sticky-top">
        <button
          className="btn btn-primary"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>
        <span className="fs-5 fw-semibold">Pharmacist Workspace</span>
      </header>

      {/* Sidebar (same slide logic as CustomerDashboard) */}
      <aside
        className={`position-fixed top-0 vh-100 p-3 d-flex flex-column ${cardBg} border-end`}
        style={{
          width: "240px",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease-out",
          zIndex: 1040,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1
            className="h5 text-primary cursor-pointer mb-0"
            onClick={() => setActiveSection("dashboard")}
          >
            Pharmacy Panel
          </h1>
          <button
            className="btn btn-outline-secondary d-lg-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-grow-1">
          <ul className="nav flex-column gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.key;
              return (
                <li key={item.key} className="nav-item">
                  <button
                    type="button"
                    className={`btn align-items-center rounded w-100 text-start d-flex py-2 px-2 ${
                      isActive ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => setActiveSection(item.key)}
                  >
                    <Icon size={20} />
                    <span className="ms-2">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto d-flex flex-column gap-2">
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "Light" : "Dark"} Mode</span>
          </button>
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content – marginLeft tied to sidebarOpen, same as customer */}
      <main
        className="flex-grow-1 p-3"
        style={{
          marginLeft: sidebarOpen ? "240px" : 0,
          transition: "margin-left 0.25s ease-out",
        }}
      >
        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <span className="fs-4 fw-semibold">
            {activeSection === "dashboard"
              ? "Pharmacist Overview"
              : activeSection === "orders"
              ? "Customer Orders"
              : "Medicine Inventory"}
          </span>
          <div className="d-flex align-items-center gap-3">
            <Bell size={22} className="cursor-pointer" />
            <img
              src={avatar}
              alt="avatar"
              className="rounded-circle border border-primary"
              width={40}
              height={40}
            />
          </div>
        </div>

        <div className="row g-3">
          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <>
              {/* Prescriptions */}
              <section className="col-12 col-lg-6">
                <div className={`${cardBg} card`}>
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Customer Prescriptions</h5>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    {loadingExtra && <p>Loading prescriptions...</p>}
                    {!loadingExtra && prescriptionsData.length === 0 && (
                      <p>No prescriptions uploaded yet.</p>
                    )}
                    {prescriptionsData.map((p) => (
                      <div
                        key={p._id}
                        className="d-flex justify-content-between align-items-center mb-3 border rounded p-2"
                      >
                        <div className="me-2">
                          <div className="fw-semibold">
                            {p.customerName} ({p.customerEmail})
                          </div>
                          <small className="text-muted">
                            Status: {p.status} · Uploaded:{" "}
                            {new Date(p.createdAt).toLocaleString()}
                          </small>
                        </div>
                        {p.imageUrl && (
                          <img
                            src={p.imageUrl}
                            alt="prescription"
                            width={64}
                            height={64}
                            className="rounded flex-shrink-0"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Appointments */}
              <section className="col-12 col-lg-6">
                <div className={`${cardBg} card`}>
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Doctor Appointments</h5>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: 300, overflowY: "auto" }}
                  >
                    {loadingExtra && <p>Loading appointments...</p>}
                    {!loadingExtra && appointmentsData.length === 0 && (
                      <p>No appointments reserved yet.</p>
                    )}
                    {appointmentsData.map((a) => (
                      <div
                        key={a._id}
                        className="d-flex justify-content-between align-items-center mb-3 border rounded p-2"
                      >
                        <div className="me-2">
                          <div className="fw-semibold">
                            {a.customerName} ({a.customerEmail})
                          </div>
                          <small className="text-muted d-block">
                            Doctor: {a.doctorName} ({a.doctorSpeciality}) · NMC:{" "}
                            {a.doctorNMC}
                          </small>
                        </div>
                        <div
                          className="text-end small flex-shrink-0"
                          style={{ minWidth: 110 }}
                        >
                          <div>{a.date}</div>
                          <div>{a.timeSlot}</div>
                          <div>Status: {a.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Doctors */}
              <section className="col-12">
                <div className={`${cardBg} card`}>
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Doctors (NMC)</h5>
                  </div>
                  <div
                    className="card-body"
                    style={{ maxHeight: 240, overflowY: "auto" }}
                  >
                    {loadingExtra && <p>Loading doctors...</p>}
                    {extraError && (
                      <p className="text-danger mb-2">{extraError}</p>
                    )}
                    {!loadingExtra && doctorsData.length === 0 && (
                      <p>No doctors found.</p>
                    )}
                    {doctorsData.map((doc) => (
                      <div
                        key={doc._id}
                        className="d-flex justify-content-between align-items-center mb-2 border rounded p-2"
                      >
                        <div className="me-2">
                          <div className="fw-semibold">{doc.name}</div>
                          <small className="text-muted">{doc.speciality}</small>
                        </div>
                        <div
                          className="text-end small flex-shrink-0"
                          style={{ minWidth: 110 }}
                        >
                          <div>NMC: {doc.nmcNumber}</div>
                          <div
                            style={{
                              color: doc.isAvailable ? "#22c55e" : "#f97316",
                            }}
                          >
                            {doc.isAvailable ? "Available" : "Not available"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ORDERS */}
          {activeSection === "orders" && (
            <section className="col-12">
              <div className={`${cardBg} card`}>
                <div className="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <h5 className="mb-0">Customer Orders</h5>
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 220 }}
                    placeholder="Search orders..."
                    value={ordersQuery}
                    onChange={(e) => {
                      setOrdersQuery(e.target.value);
                      setOrdersPage(1);
                    }}
                  />
                </div>
                <div className="table-responsive">
                  <table
                    className={`table table-striped table-hover ${
                      darkMode ? "table-dark" : ""
                    } mb-0`}
                  >
                    <thead>
                      <tr>
                        <th
                          role="button"
                          onClick={() => requestSortOrder("id")}
                        >
                          Order ID
                        </th>
                        <th>Customer</th>
                        <th>Medicine</th>
                        <th>Qty</th>
                        <th>Prescription</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersPageItems.map((o) => (
                        <tr key={o.id ?? o._id}>
                          <td>#{o.id ?? o._id}</td>
                          <td>{o.customer}</td>
                          <td>{o.medicine}</td>
                          <td>{o.qty}</td>
                          <td>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control form-control-sm"
                              style={{ maxWidth: 160 }}
                              onChange={(e) =>
                                handlePrescriptionUpload(
                                  o.id ?? o._id,
                                  e.target.files[0]
                                )
                              }
                            />
                            {prescriptionsPreview[o.id ?? o._id] && (
                              <motion.img
                                src={prescriptionsPreview[o.id ?? o._id]}
                                alt="prescription"
                                className="img-thumbnail mt-1"
                                style={{
                                  width: 80,
                                  height: 80,
                                  objectFit: "cover",
                                }}
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex flex-column flex-sm-row flex-wrap gap-1">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  handleStripePayment(o.id ?? o._id)
                                }
                              >
                                Stripe
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn btn-success btn-sm"
                                onClick={() => handleESWAPayment(o.id ?? o._id)}
                              >
                                ESWA
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="btn btn-warning btn-sm"
                                onClick={() => handleCODPayment(o.id ?? o._id)}
                              >
                                COD
                              </motion.button>
                            </div>
                            <small className="text-muted mt-1 d-block">
                              {o.paymentStatus}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePagination
                  total={filteredOrders.length}
                  page={ordersPage}
                  pageSize={ordersPageSize}
                  onPageChange={setOrdersPage}
                  onPageSizeChange={(s) => {
                    setOrdersPageSize(s);
                    setOrdersPage(1);
                  }}
                />
              </div>
            </section>
          )}

          {/* MEDICINES */}
          {activeSection === "medicines" && (
            <section className="col-12">
              <div className={`${cardBg} card`}>
                <div className="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <h5 className="mb-0">Medicines</h5>
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 220 }}
                    placeholder="Search medicines..."
                    value={medQuery}
                    onChange={(e) => {
                      setMedQuery(e.target.value);
                      setMedPage(1);
                    }}
                  />
                </div>
                <div className="table-responsive">
                  <table
                    className={`table table-striped table-hover ${
                      darkMode ? "table-dark" : ""
                    } mb-0`}
                  >
                    <thead>
                      <tr>
                        <th role="button" onClick={() => requestSortMed("_id")}>
                          ID
                        </th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medsPageItems.map((m) => (
                        <tr key={m._id ?? m.id}>
                          <td>{m._id ?? m.id}</td>
                          <td>{m.name}</td>
                          <td>{m.category}</td>
                          <td>{m.quantity ?? m.stock}</td>
                          <td>
                            {m.expiryDate
                              ? String(m.expiryDate).slice(0, 10)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePagination
                  total={filteredMeds.length}
                  page={medPage}
                  pageSize={medPageSize}
                  onPageChange={setMedPage}
                  onPageSizeChange={(s) => {
                    setMedPageSize(s);
                    setMedPage(1);
                  }}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PharmacistDashboard;
