// src/pages/Dashboard.jsx
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import MatchList from "../components/MatchList";
import ChatBox from "../components/ChatBox";

export default function Dashboard() {
  const profiles = [
    { name: "Anisha", age: 23, bio: "Loves hiking and momo", image: "https://i.pravatar.cc/150?img=1" },
    { name: "Sanjay", age: 25, bio: "Guitarist, foodie", image: "https://i.pravatar.cc/150?img=2" },
  ];

  const matches = [
    { name: "Anisha", bio: "Loves hiking", image: "https://i.pravatar.cc/100?img=5" },
    { name: "Sanjay", bio: "Plays guitar", image: "https://i.pravatar.cc/100?img=6" },
  ];

  const user = { name: "Anisha", image: "https://i.pravatar.cc/100?img=5" };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-100">
        <Routes>
          {/* Default dashboard feed */}
          <Route
            index
            element={
              <div className="flex justify-center items-center gap-6 p-6">
                {profiles.map((p, i) => (
                  <ProfileCard key={i} {...p} />
                ))}
              </div>
            }
          />

          {/* Matches */}
          <Route path="matches" element={<MatchList matches={matches} />} />

          {/* Messages */}
          <Route path="messages" element={<ChatBox user={user} />} />

          {/* Profile */}
          <Route
            path="profile"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Your Profile</h1>
                <p className="mt-2">Edit your details, upload photo, update bio, etc.</p>
              </div>
            }
          />

          {/* Settings */}
          <Route
            path="settings"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="mt-2">Update account preferences, privacy, and logout.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
