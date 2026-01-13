// // frontend/src/services/api.js
// import axios from "axios";

// // Adjust baseURL if your backend runs on a different port or path
// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: false, // set true if you rely on cookies/sessions
// });

// // Automatically attach JWT token if present
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

import axios from "axios";

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000, // 10-second timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// --- Request Interceptor ---
// Automatically attach JWT token to every outgoing request if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// Handle global error responses, like token expiration
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // If the backend returns 401 (Unauthorized), the token might be invalid or expired
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized. Logging out...");

      // Clear local storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");

      // Force a redirect to the login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
