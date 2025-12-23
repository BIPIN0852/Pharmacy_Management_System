import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth(); // assuming user has { name, email, role }
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend endpoint to update profile
    setMessage("Profile update API not connected yet. Add backend later.");
    setError("");
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="container py-5">
        <h4>You are not logged in.</h4>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="fw-bold mb-0">My Profile</h3>
                  <p className="text-muted mb-0">
                    View and manage your account information.
                  </p>
                </div>
                <span className="badge bg-primary text-uppercase">
                  {profile.role || "user"}
                </span>
              </div>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}
              {message && (
                <div className="alert alert-success py-2" role="alert">
                  {message}
                </div>
              )}

              {!editing ? (
                <>
                  <dl className="row mb-4">
                    <dt className="col-sm-3">Name</dt>
                    <dd className="col-sm-9">{profile.name || "-"}</dd>

                    <dt className="col-sm-3">Email</dt>
                    <dd className="col-sm-9">{profile.email || "-"}</dd>

                    <dt className="col-sm-3">Role</dt>
                    <dd className="col-sm-9 text-capitalize">
                      {profile.role || "-"}
                    </dd>
                  </dl>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={profile.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.role}
                      disabled
                      readOnly
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditing(false);
                        setMessage("");
                        setError("");
                        setProfile({
                          name: user.name || "",
                          email: user.email || "",
                          role: user.role || "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Optional: password section */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-2">Change Password</h5>
              <p className="text-muted small mb-3">
                Implement password update by calling your auth backend.
              </p>
              <button type="button" className="btn btn-warning btn-sm" disabled>
                Change password (not wired yet)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
