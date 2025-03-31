import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes"; 
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom"; 
import 'leaflet/dist/leaflet.css';
import 'font-awesome/css/font-awesome.min.css';


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
