// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { registerSW } from "virtual:pwa-register";
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

// ✅ Register the Service Worker for PWA
registerSW({
  onNeedRefresh() {
    console.log("⚡ New content available, please refresh.");
  },
  onOfflineReady() {
    console.log("📦 App is ready to work offline!");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
