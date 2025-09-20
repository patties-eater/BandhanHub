import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );

  if (!profile)
    return <div className="p-6 text-gray-600">Profile not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <div className="flex flex-col items-center">
        <img
          src={
            profile.avatar_url ||
            `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.full_name}`
          }
          alt={profile.full_name}
          className="w-32 h-32 rounded-full mb-4 object-cover"
        />
        <h2 className="text-2xl font-bold">{profile.full_name}</h2>
        {profile.birthdate && (
          <p className="text-gray-500">Age: {getAge(profile.birthdate)}</p>
        )}
        {profile.gender && (
          <p className="text-gray-500">Gender: {profile.gender}</p>
        )}
      </div>

      <div className="mt-6 space-y-3 text-gray-700">
        {profile.address && (
          <p>
            <span className="font-semibold">Address:</span> {profile.address}
          </p>
        )}
        {profile.qualification && (
          <p>
            <span className="font-semibold">Qualification:</span>{" "}
            {profile.qualification}
          </p>
        )}
        {profile.job_status && (
          <p>
            <span className="font-semibold">Job Status:</span>{" "}
            {profile.job_status}
          </p>
        )}
        {profile.job_type && (
          <p>
            <span className="font-semibold">Job Type:</span> {profile.job_type}
          </p>
        )}
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

// helper
function getAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
