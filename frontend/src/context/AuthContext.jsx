// import React, { createContext, useContext, useState, useEffect } from "react";
// import { api } from "../api";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       const res = await api("/auth/login", "POST", { email, password });
//       setUser(res.user);
//       localStorage.setItem("user", JSON.stringify(res.user));
//       window.location.href = "/";
//     } catch (err) {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (name, email, password) => {
//     try {
//       setLoading(true);
//       await api("/auth/register", "POST", { name, email, password });
//       alert("Registration successful! Please login.");
//       window.location.href = "/login";
//     } catch (err) {
//       setError("Registration failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, loading, error }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Check if user is already logged in on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // -----------------------
//   // LOGIN
//   // -----------------------
//   const login = async (email, password) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim(),
//           password: password.trim(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         // Handle validation errors from backend
//         if (data.errors) {
//           setError(data.errors.map((e) => e.msg).join(", "));
//         } else {
//           setError(data.message || "Login failed");
//         }
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------
//   // REGISTER
//   // -----------------------
//   const register = async (
//     name,
//     email,
//     password,
//     role = "customer",
//     phone = ""
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           email: email.trim(),
//           password,
//           role,
//           phone,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.errors) {
//           setError(data.errors.map((e) => e.msg).join(", "));
//         } else {
//           setError(data.message || "Registration failed");
//         }
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//       }
//     } catch (err) {
//       console.error("Register error:", err);
//       setError(err.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------
//   // LOGOUT
//   // -----------------------
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, error, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initLoading, setInitLoading] = useState(true); // Track initial load

//   // Check if user is already logged in on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//     setInitLoading(false); // Done initializing
//   }, []);

//   // -----------------------
//   // LOGIN
//   // -----------------------
//   const login = async (email, password) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim(),
//           password: password.trim(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.errors) {
//           setError(data.errors.map((e) => e.msg).join(", "));
//         } else {
//           setError(data.message || "Login failed");
//         }
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------
//   // REGISTER
//   // -----------------------
//   const register = async (
//     name,
//     email,
//     password,
//     role = "customer",
//     phone = ""
//   ) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name.trim(),
//           email: email.trim(),
//           password,
//           role,
//           phone,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         if (data.errors) {
//           setError(data.errors.map((e) => e.msg).join(", "));
//         } else {
//           setError(data.message || "Registration failed");
//         }
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         setUser(data.user);
//       }
//     } catch (err) {
//       console.error("Register error:", err);
//       setError(err.message || "Something went wrong. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------
//   // LOGOUT
//   // -----------------------
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, error, loading, initLoading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook
// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true); // Track initial load

  // 🧹 Clear login data on startup (only in development mode)
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      console.log("🔄 Clearing stored user and token (development mode)");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // -----------------------
  // Check if user is already logged in on mount
  // -----------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setInitLoading(false); // Done initializing
  }, []);

  // -----------------------
  // LOGIN
  // -----------------------
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setError(data.errors.map((e) => e.msg).join(", "));
        } else {
          setError(data.message || "Login failed");
        }
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // REGISTER
  // -----------------------
  const register = async (
    name,
    email,
    password,
    role = "customer",
    phone = ""
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setError(data.errors.map((e) => e.msg).join(", "));
        } else {
          setError(data.message || "Registration failed");
        }
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // LOGOUT
  // -----------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, error, loading, initLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
