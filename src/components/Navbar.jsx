import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, MessageCircle, Heart, User, Settings } from "lucide-react";
import Notifications from "../pages/Dashboard/Notifications";
import { supabase } from "../supabaseClient";

export default function Navbar() {
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
    { name: "Home", to: "/dashboard", icon: <Home size={24} /> },
    {
      name: "Inbox",
      to: "/dashboard/inbox",
      icon: <MessageCircle size={24} />,
    },
    { name: "Matches", to: "/dashboard/matches", icon: <Heart size={24} /> },
    { name: "Profile", to: "/dashboard/profile", icon: <User size={24} /> },
    {
      name: "Settings",
      to: "/dashboard/settings",
      icon: <Settings size={24} />,
    },
  ];

  return (
    <>
      {/* Top Navbar (Desktop & Mobile Header) */}
      <nav className="bg-pink-600 shadow px-6 py-3 flex justify-between items-center relative z-10">
        <Link
          to="/dashboard"
          className="text-2xl font-bold text-white hover:text-pink-200"
        >
          BandhanHub ❤️
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/dashboard"}
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

        {/* Mobile Notifications (Top Right) */}
        <div className="md:hidden flex items-center">
          {currentUserId && <Notifications currentUserId={currentUserId} />}
        </div>
      </nav>

      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "text-pink-600" : "text-gray-500 hover:text-pink-400"
              }`
            }
          >
            {link.icon}
            <span className="text-[10px] font-medium mt-1">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
