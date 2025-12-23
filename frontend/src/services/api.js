// frontend/src/services/api.js
import axios from "axios";

// Adjust baseURL if your backend runs on a different port or path
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // set true if you rely on cookies/sessions
});

// Automatically attach JWT token if present
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

export default api;
