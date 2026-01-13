// // src/services/Pharmacyapi.js
// import api from "./api";

// const withToken = () => {
//   const token = localStorage.getItem("token");
//   return { token };
// };

// // MEDICINES
// export const getMedicines = () => api.get("/medicines", withToken());

// export const createMedicine = (payload) =>
//   api.post("/medicines", payload, withToken());

// // DOCTORS
// export const getDoctors = () => api.get("/doctors", withToken());

// // APPOINTMENTS
// export const createAppointment = (payload) =>
//   api.post("/appointments", payload, withToken());

// export const getMyAppointments = () => api.get("/appointments/my", withToken()); // if you add such route

// // PRESCRIPTIONS
// export const uploadPrescription = (payload) =>
//   api.post("/prescriptions", payload, withToken());

// export const getPendingPrescriptions = () =>
//   api.get("/prescriptions?status=pending", withToken());

// // ORDERS
// export const getMyOrders = () => api.get("/orders/my", withToken());

// export const getAllOrders = () => api.get("/orders", withToken());

import api from "./api";

// --- MEDICINES ---
// Fetch all medicines with optional query params (search/category)
export const getMedicines = (params) => api.get("/medicines", { params });

// Add new medicine to inventory (Admin/Pharmacist)
export const createMedicine = (payload) => api.post("/medicines", payload);

// Update medicine stock or details
export const updateMedicine = (id, payload) =>
  api.put(`/medicines/${id}`, payload);

// Delete medicine
export const deleteMedicine = (id) => api.delete(`/medicines/${id}`);

// --- DOCTORS ---
// Fetch all doctors for appointment booking
export const getDoctors = () => api.get("/doctors");

// --- APPOINTMENTS ---
// Book a new appointment
export const createAppointment = (payload) =>
  api.post("/appointments", payload);

// Fetch logged-in user's appointments
export const getMyAppointments = () => api.get("/appointments/my");

// --- PRESCRIPTIONS ---
// Upload prescription image (Multipart/Form-Data)
export const uploadPrescription = (formData) =>
  api.post("/prescriptions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Get prescriptions by status (Pharmacist view)
export const getPrescriptionsByStatus = (status = "pending") =>
  api.get(`/prescriptions?status=${status}`);

// --- ORDERS ---
// Customer: Get personal order history
export const getMyOrders = () => api.get("/orders/my");

// Admin/Pharmacist: Get all system orders
export const getAllOrders = () => api.get("/orders");

// Update order status (e.g., pending to delivered)
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status });

// --- USERS ---
// Admin: Fetch all users or customers
export const getAllUsers = () => api.get("/users");

// Admin: Create staff/pharmacist/doctor
export const createStaffUser = (payload) => api.post("/users", payload);
