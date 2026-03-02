import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App.jsx";

// 1. Import Bootstrap CSS first
import "bootstrap/dist/css/bootstrap.min.css";

// 2. Bootstrap JS bundle (Includes Popper.js)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// 3. Import Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// 4. ✅ IMPORT CUSTOM CSS LAST
// This ensures your :root variables and vibrant gradients take precedence
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
