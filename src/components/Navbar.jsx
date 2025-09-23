


// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="bg-pink-600 shadow px-6 py-3 flex justify-between items-center relative">
//       {/* Logo / Brand */}
//       <Link
//         to="/dashboard"
//         className="text-2xl font-bold text-white hover:text-pink-200"
//       >
//         BandhanHub ❤️
//       </Link>

//       {/* Desktop Menu */}
//       <div className="hidden md:flex space-x-6">
//         <Link to="/dashboard" className="text-white hover:text-pink-200">
//           Home
//         </Link>
//         <Link to="/dashboard/messages" className="text-white hover:text-pink-200">
//           Messages
//         </Link>
//         <Link to="/dashboard/matches" className="text-white hover:text-pink-200">
//           Matches
//         </Link>
//         <Link to="/dashboard/profile" className="text-white hover:text-pink-200">
//           Profile
//         </Link>
//         <Link to="/dashboard/settings" className="text-white hover:text-pink-200">
//           Settings
//         </Link>
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden text-white focus:outline-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={28} /> : <Menu size={28} />}
//       </button>

//       {/* Mobile Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full left-0 w-full bg-pink-600 shadow-md md:hidden flex flex-col items-start space-y-4 p-4">
//           <Link
//             to="/dashboard"
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-pink-200 w-full"
//           >
//             Home
//           </Link>
//           <Link
//             to="/dashboard/messages"
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-pink-200 w-full"
//           >
//             Messages
//           </Link>
//           <Link
//             to="/dashboard/matches"
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-pink-200 w-full"
//           >
//             Matches
//           </Link>
//           <Link
//             to="/dashboard/profile"
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-pink-200 w-full"
//           >
//             Profile
//           </Link>
//           <Link
//             to="/dashboard/settings"
//             onClick={() => setIsOpen(false)}
//             className="text-white hover:text-pink-200 w-full"
//           >
//             Settings
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// }





// // src/components/Navbar.jsx
// import { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
// import { Menu, X } from "lucide-react";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);

//   const links = [
//     { name: "Home", to: "/dashboard" },
//     { name: "Inbox", to: "/dashboard/inbox" },
//     { name: "Matches", to: "/dashboard/matches" },
//     { name: "Profile", to: "/dashboard/profile" },
//     { name: "Settings", to: "/dashboard/settings" },
//   ];

//   return (
//     <nav className="bg-pink-600 shadow px-6 py-3 flex justify-between items-center relative">
//       {/* Logo */}
//       <Link
//         to="/dashboard"
//         className="text-2xl font-bold text-white hover:text-pink-200"
//       >
//         BandhanHub ❤️
//       </Link>

//       {/* Desktop Links */}
//       <div className="hidden md:flex space-x-6">
//         {links.map((link) => (
//           <NavLink
//             key={link.to}
//             to={link.to}
//             className={({ isActive }) =>
//               isActive
//                 ? "text-yellow-300 font-semibold"
//                 : "text-white hover:text-pink-200"
//             }
//           >
//             {link.name}
//           </NavLink>
//         ))}
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden text-white focus:outline-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {isOpen ? <X size={28} /> : <Menu size={28} />}
//       </button>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="absolute top-full left-0 w-full bg-pink-600 shadow-md md:hidden flex flex-col items-start space-y-4 p-4">
//           {links.map((link) => (
//             <NavLink
//               key={link.to}
//               to={link.to}
//               onClick={() => setIsOpen(false)}
//               className={({ isActive }) =>
//                 isActive
//                   ? "text-yellow-300 font-semibold w-full"
//                   : "text-white hover:text-pink-200 w-full"
//               }
//             >
//               {link.name}
//             </NavLink>
//           ))}
//         </div>
//       )}
//     </nav>
//   );
// }










import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

      <div className="hidden md:flex space-x-6">
        {links.map(link => (
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
      </div>

      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-pink-600 shadow-md md:hidden flex flex-col items-start space-y-4 p-4">
          {links.map(link => (
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
        </div>
      )}
    </nav>
  );
}
