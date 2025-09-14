import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CustomToastContainer from "./components/ToastContainer.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";
import React from "react";

const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
        <CustomToastContainer/>
      </GoogleOAuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
