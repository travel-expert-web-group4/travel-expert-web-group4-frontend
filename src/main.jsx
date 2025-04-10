import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes"; 
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom"; 
import { LoadScript } from "@react-google-maps/api";  
import 'font-awesome/css/font-awesome.min.css';


const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={["places", "marker"]} // Load Places library for autocomplete
    >
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LoadScript>
  </React.StrictMode>
);
