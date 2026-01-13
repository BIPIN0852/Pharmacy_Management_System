// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import store from "./redux/store";
// import App from "./App.jsx";

// // Import Bootstrap CSS first
// import "bootstrap/dist/css/bootstrap.min.css";

// // Import your custom styles after Bootstrap
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import store from "./redux/store";
// import App from "./App.jsx";

// // Import Bootstrap CSS first
// import "bootstrap/dist/css/bootstrap.min.css";

// // Import your custom styles after Bootstrap
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";
// import store from "./redux/store";
// import App from "./App.jsx";

// // Import Bootstrap CSS first
// import "bootstrap/dist/css/bootstrap.min.css";
// // ✅ ADD Bootstrap JS bundle for accordion/dropdown/modal support
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// // Import your custom styles after Bootstrap
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App.jsx";

// 1. Import Bootstrap CSS first so custom styles can override it
import "bootstrap/dist/css/bootstrap.min.css";

// 2. ✅ Bootstrap JS bundle (Includes Popper.js)
// Necessary for: Dropdowns, Modals, Tooltips, and Responsive Navbars
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 3. Import Bootstrap Icons (Optional but recommended for the UI we built)
// If you haven't installed it, run: npm install bootstrap-icons
import "bootstrap-icons/font/bootstrap-icons.css";

// 4. Import your custom index.css last to ensure your :root variables
// and utility classes take precedence
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider for Global State Management */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
