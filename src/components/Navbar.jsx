// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="flex justify-between items-center px-6 py-3 bg-pink-600 text-white shadow-md">
//       <Link to="/dashboard" className="text-2xl font-bold">
//         BandhanHub ❤️
//       </Link>
//       <div className="flex gap-6">
//         <Link to="/dashboard/matches">Matches</Link>
//         <Link to="/dashboard/messages">Messages</Link>
//         <Link to="/dashboard/profile">Profile</Link>
//         <Link to="/dashboard/settings">Settings</Link>
//       </div>
//     </nav>
//   );
// }




// import { Link } from "react-router-dom";

// export default function Navbar() {
//   return (
//     <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
//       <h1 className="text-xl font-bold text-blue-600">BandhanHub</h1>
//       <div className="space-x-4">
//         <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Home</Link>
//         <Link to="/dashboard/matches" className="text-gray-700 hover:text-blue-600">Matches</Link>
//         <Link to="/dashboard/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
//       </div>
//     </nav>
//   );
// }




import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-pink-600 shadow px-6 py-3 flex justify-between items-center relative">
      {/* Logo / Brand */}
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-white hover:text-pink-200"
      >
        BandhanHub ❤️
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        <Link to="/dashboard" className="text-white hover:text-pink-200">
          Home
        </Link>
        <Link to="/dashboard/messages" className="text-white hover:text-pink-200">
          Messages
        </Link>
        <Link to="/dashboard/matches" className="text-white hover:text-pink-200">
          Matches
        </Link>
        <Link to="/dashboard/profile" className="text-white hover:text-pink-200">
          Profile
        </Link>
        <Link to="/dashboard/settings" className="text-white hover:text-pink-200">
          Settings
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-pink-600 shadow-md md:hidden flex flex-col items-start space-y-4 p-4">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 w-full"
          >
            Home
          </Link>
          <Link
            to="/dashboard/messages"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 w-full"
          >
            Messages
          </Link>
          <Link
            to="/dashboard/matches"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 w-full"
          >
            Matches
          </Link>
          <Link
            to="/dashboard/profile"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 w-full"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/settings"
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-pink-200 w-full"
          >
            Settings
          </Link>
        </div>
      )}
    </nav>
  );
}
