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

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App.jsx";

// Import Bootstrap CSS first
import "bootstrap/dist/css/bootstrap.min.css";
// ✅ ADD Bootstrap JS bundle for accordion/dropdown/modal support
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import your custom styles after Bootstrap
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
