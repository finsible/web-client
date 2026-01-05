import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CustomToastContainer from "./components/ToastContainer.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
        <CustomToastContainer />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
