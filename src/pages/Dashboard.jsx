// src/pages/Dashboard.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Nested routes (Home, Profile, Matches, etc.) will render here */}
        <Outlet />
      </div>
    </div>
  );
}
