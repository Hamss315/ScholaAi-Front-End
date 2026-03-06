import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { RegisterProvider } from "./context/register-context";
import { AuthProvider } from "./context/auth-context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
    <RegisterProvider>
      <App />
    </RegisterProvider>
    </AuthProvider>
  </React.StrictMode>
);
