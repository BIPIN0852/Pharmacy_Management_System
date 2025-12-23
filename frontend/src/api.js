// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// export async function api(path, method = "GET", body = null, token = null) {
//   const headers = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   });

//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   return res.json();
// }

// frontend/src/services/api.js

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// async function request(path, method = "GET", body = null, token = null) {
//   const headers = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch {
//     data = null;
//   }

//   if (!res.ok) {
//     const error = new Error(data?.message || `API error: ${res.status}`);
//     error.response = { status: res.status, data };
//     throw error;
//   }

//   return data;
// }

// const api = {
//   get: (path, config = {}) => request(path, "GET", null, config.token || null),
//   post: (path, body, config = {}) =>
//     request(path, "POST", body, config.token || null),
//   put: (path, body, config = {}) =>
//     request(path, "PUT", body, config.token || null),
//   delete: (path, body, config = {}) =>
//     request(path, "DELETE", body, config.token || null),
// };

// export default api;

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// async function request(path, method = "GET", body = null, token = null) {
//   const headers = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(`${API_BASE}${path}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   });

//   let data;
//   try {
//     data = await res.json();
//   } catch {
//     data = null;
//   }

//   if (!res.ok) {
//     const error = new Error(data?.message || `API error: ${res.status}`);
//     error.response = { status: res.status, data };
//     throw error;
//   }

//   return data;
// }

// const api = {
//   get: (path, config = {}) => request(path, "GET", null, config.token || null),
//   post: (path, body, config = {}) =>
//     request(path, "POST", body, config.token || null),
//   put: (path, body, config = {}) =>
//     request(path, "PUT", body, config.token || null),
//   delete: (path, body, config = {}) =>
//     request(path, "DELETE", body, config.token || null),
// };

// export default api;

// src/services/api.js
const BASE_URL = "http://localhost:5000/api";

async function request(path, method = "GET", body, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed with ${res.status}`;
    const error = new Error(message);
    error.response = { status: res.status, data };
    throw error;
  }

  return data;
}

const api = {
  get: (path, config = {}) => request(path, "GET", null, config.token || null),
  post: (path, body, config = {}) =>
    request(path, "POST", body, config.token || null),
  put: (path, body, config = {}) =>
    request(path, "PUT", body, config.token || null),
  del: (path, config = {}) =>
    request(path, "DELETE", null, config.token || null),
};

export default api;
