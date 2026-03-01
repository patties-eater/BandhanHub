import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Notifications from "../pages/Dashboard/Notifications";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    getUser();
  }, []);

  const links = [
    { name: "Home", to: "/dashboard" },
    { name: "Inbox", to: "/dashboard/inbox" },
    { name: "Matches", to: "/dashboard/matches" },
    { name: "Profile", to: "/dashboard/profile" },
    { name: "Settings", to: "/dashboard/settings" },
  ];

  return (
    <nav className="bg-pink-600 shadow px-6 py-3 flex justify-between items-center relative">
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-white hover:text-pink-200"
      >
        BandhanHub ❤️
      </Link>

      <div className="hidden md:flex items-center space-x-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "text-yellow-300 font-semibold"
                : "text-white hover:text-pink-200"
            }
          >
            {link.name}
          </NavLink>
        ))}
        {currentUserId && <Notifications currentUserId={currentUserId} />}
      </div>

      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-pink-600 shadow-md md:hidden flex flex-col items-start space-y-4 p-4 z-50">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 font-semibold w-full"
                  : "text-white hover:text-pink-200 w-full"
              }
            >
              {link.name}
            </NavLink>
          ))}
          {currentUserId && <Notifications currentUserId={currentUserId} />}
        </div>
      )}
    </nav>
  );
}
