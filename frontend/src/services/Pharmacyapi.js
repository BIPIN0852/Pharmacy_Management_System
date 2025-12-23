// src/services/Pharmacyapi.js
import api from "./api";

const withToken = () => {
  const token = localStorage.getItem("token");
  return { token };
};

// MEDICINES
export const getMedicines = () => api.get("/medicines", withToken());

export const createMedicine = (payload) =>
  api.post("/medicines", payload, withToken());

// DOCTORS
export const getDoctors = () => api.get("/doctors", withToken());

// APPOINTMENTS
export const createAppointment = (payload) =>
  api.post("/appointments", payload, withToken());

export const getMyAppointments = () => api.get("/appointments/my", withToken()); // if you add such route

// PRESCRIPTIONS
export const uploadPrescription = (payload) =>
  api.post("/prescriptions", payload, withToken());

export const getPendingPrescriptions = () =>
  api.get("/prescriptions?status=pending", withToken());

// ORDERS
export const getMyOrders = () => api.get("/orders/my", withToken());

export const getAllOrders = () => api.get("/orders", withToken());
