import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-pink-600 text-white shadow-md">
      <Link to="/dashboard" className="text-2xl font-bold">
        BandhanHub ❤️
      </Link>
      <div className="flex gap-6">
        <Link to="/dashboard/matches">Matches</Link>
        <Link to="/dashboard/messages">Messages</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </div>
    </nav>
  );
}
