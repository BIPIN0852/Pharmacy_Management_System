import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  Clock,
  Activity,
  Loader2,
  ArrowRight,
  BellRing,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    today: 0,
    totalPatients: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apptRes, patientsRes] = await Promise.all([
          api.get("/doctor/appointments"),
          api.get("/doctor/patients"),
        ]);

        const appointments = apptRes.data?.appointments || [];
        const patients = patientsRes.data?.patients || [];

        // 1. Calculate Stats (Case Insensitive)
        const todayStr = new Date().toDateString();
        const pendingAppts = appointments.filter(
          (a) => a.status?.toLowerCase() === "pending",
        );
        const todayAppts = appointments.filter(
          (a) => new Date(a.date).toDateString() === todayStr,
        );

        setStats({
          pending: pendingAppts.length,
          today: todayAppts.length,
          totalPatients: patients.length,
        });

        // 2. Generate Real-World Notifications from Pending Appointments
        const alerts = pendingAppts.map((app) => ({
          id: app._id,
          type: "booking",
          title: "New Appointment Request",
          message: `${app.patient?.name || "A patient"} has requested a visit on ${new Date(app.date).toLocaleDateString()} at ${app.time}.`,
          time: new Date(app.createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setNotifications(alerts);

        // 3. Get 5 most recent pending/upcoming (Case Insensitive)
        const upcoming = appointments
          .filter((a) =>
            ["pending", "confirmed"].includes(a.status?.toLowerCase()),
          )
          .slice(0, 5);

        setRecentAppointments(upcoming);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Optional: Poll every 30 seconds for new notifications
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Loader2 className="spin-animation text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100 animate-fade-in">
      {/* 🚀 REAL-TIME NOTIFICATION BANNER */}
      {notifications.length > 0 && (
        <div className="alert alert-warning border-warning shadow-sm rounded-4 d-flex align-items-center justify-content-between p-3 mb-4 animate-slide-down">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white text-warning rounded-circle p-2 shadow-sm d-flex justify-content-center align-items-center">
              <BellRing size={24} className="ring-animation" />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-dark">
                You have {notifications.length} new booking request(s)!
              </h6>
              <p className="mb-0 small text-muted">
                Please review and approve them to allow patients to message you.
              </p>
            </div>
          </div>
          <button
            className="btn btn-warning fw-bold rounded-pill px-4 shadow-sm"
            onClick={() => navigate("/doctor/appointments")}
          >
            Review Now
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="fw-black text-dark mb-1">
          Welcome back, Dr. {user?.name.split(" ")[0]}! 👋
        </h3>
        <p className="text-muted fw-medium">
          Here is what's happening with your schedule today.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center gap-3 bg-white hover-lift">
            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-muted fw-bold mb-0 small text-uppercase">
                Pending Approvals
              </p>
              <h3 className="fw-black mb-0 text-dark">{stats.pending}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center gap-3 bg-white hover-lift">
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle">
              <CalendarCheck size={28} />
            </div>
            <div>
              <p className="text-muted fw-bold mb-0 small text-uppercase">
                Today's Visits
              </p>
              <h3 className="fw-black mb-0 text-dark">{stats.today}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center gap-3 bg-white hover-lift">
            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle">
              <Users size={28} />
            </div>
            <div>
              <p className="text-muted fw-bold mb-0 small text-uppercase">
                Total Patients
              </p>
              <h3 className="fw-black mb-0 text-dark">{stats.totalPatients}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS & CHAT ACCESS */}
      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-light-subtle bg-light bg-opacity-50">
          <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <Activity className="text-primary" size={20} /> Action Required &
            Active Consultations
          </h5>
          <button
            className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-1 hover-lift"
            onClick={() => navigate("/doctor/appointments")}
          >
            View All Schedule <ArrowRight size={16} />
          </button>
        </div>

        <div className="p-0">
          {recentAppointments.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <CheckCircle size={48} className="mb-3 opacity-25 text-success" />
              <h6 className="fw-bold">You are all caught up!</h6>
              <p className="small">
                You have no pending or upcoming appointments right now.
              </p>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {recentAppointments.map((app) => {
                const isPending = app.status?.toLowerCase() === "pending";

                return (
                  <li
                    key={app._id}
                    className="list-group-item p-4 d-flex justify-content-between align-items-center hover-bg-light transition-all"
                  >
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">
                        {app.patient?.name || "Unknown Patient"}
                      </h6>
                      <small className="text-muted d-flex align-items-center gap-2">
                        <CalendarCheck size={14} />{" "}
                        {new Date(app.date).toLocaleDateString()} at {app.time}
                      </small>
                      {!isPending && (
                        <small className="text-primary d-flex align-items-center gap-1 mt-1 fw-medium">
                          Reason: {app.reason || "General Checkup"}
                        </small>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      {isPending ? (
                        <button
                          className="btn btn-sm btn-warning fw-bold rounded-pill px-4 shadow-sm"
                          onClick={() => navigate("/doctor/appointments")}
                        >
                          Needs Approval
                        </button>
                      ) : (
                        <>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill d-flex align-items-center">
                            Confirmed
                          </span>
                          {/* 💬 QUICK CHAT BUTTON INTEGRATION */}
                          <button
                            className="btn btn-sm btn-primary fw-bold rounded-pill px-3 shadow-sm d-flex align-items-center gap-2 hover-lift"
                            onClick={() =>
                              navigate(`/doctor/chat/${app._id}`, {
                                state: {
                                  partnerId: app.patient?._id,
                                  partnerName: app.patient?.name,
                                },
                              })
                            }
                          >
                            <MessageCircle size={14} /> Open Chat
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        .hover-lift:hover { transform: translateY(-3px); transition: transform 0.2s ease-in-out; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .transition-all { transition: all 0.2s ease; }
        .spin-animation { animation: spin 1s linear infinite; }
        .ring-animation { animation: ring 2s ease infinite; transform-origin: top center; }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes ring {
          0% { transform: rotate(0); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-10deg); }
          15% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          25% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
