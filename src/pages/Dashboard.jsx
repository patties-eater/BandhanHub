// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function load() {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <pre className="bg-gray-50 p-4 rounded">{profile ? JSON.stringify(profile, null, 2) : "Loading profile..."}</pre>
      </div>
    </div>
  );
}
