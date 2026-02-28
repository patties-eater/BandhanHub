import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Spinner from "../../components/Spinner";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );

  if (!profile)
    return <div className="p-6 text-gray-600">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Cover / Header */}
        <div className="h-48 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition"
          >
            ← Back
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar & Basic Info */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
            <img
              src={
                profile.avatar_url ||
                `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.full_name}`
              }
              alt={profile.full_name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.full_name}
              </h1>
              <p className="text-gray-500 font-medium">
                {profile.birthdate
                  ? `${getAge(profile.birthdate)} years old`
                  : "Age N/A"}
                {profile.gender && ` • ${profile.gender}`}
                {profile.address && ` • ${profile.address}`}
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/messages/${profile.id}`)}
                className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-pink-700 transition transform hover:-translate-y-0.5"
              >
                Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Bio */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  About Me
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {profile.bio || "This user hasn't written a bio yet."}
                </p>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Details
                </h3>
                <ul className="space-y-4">
                  <DetailItem
                    icon="🎓"
                    label="Qualification"
                    value={profile.qualification}
                  />
                  <DetailItem
                    icon="💼"
                    label="Job Status"
                    value={profile.job_status}
                  />
                  <DetailItem
                    icon="🏢"
                    label="Job Type"
                    value={profile.job_type}
                  />
                  <DetailItem
                    icon="📅"
                    label="Joined"
                    value={new Date(profile.created_at).toLocaleDateString()}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
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

function DetailItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <li className="flex items-start">
      <span className="text-xl mr-3">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
          {label}
        </p>
        <p className="text-gray-700 font-medium">{value}</p>
      </div>
    </li>
  );
}
