import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { AuthProvider } from "./state/AuthContext";
import { AppErrorProvider } from "./state/AppErrorContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppErrorProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AppErrorProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
