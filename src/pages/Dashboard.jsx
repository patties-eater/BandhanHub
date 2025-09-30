


import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const location = useLocation();

  // Hide Navbar only on individual chat pages (/dashboard/messages/:id)
  const hideNavbar =
    location.pathname.startsWith("/dashboard/messages/") &&
    location.pathname !== "/dashboard/messages";

  return (
    <div className="h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
