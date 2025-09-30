




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMatches() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // My likes
      const { data: myLikes } = await supabase
        .from("likes")
        .select("liked_id")
        .eq("liker_id", user.id);

      // Others who liked me
      const { data: likedMe } = await supabase
        .from("likes")
        .select("liker_id")
        .eq("liked_id", user.id);

      if (!myLikes || !likedMe) return;

      // Mutual ids
      const mutualIds = myLikes
        .map((l) => l.liked_id)
        .filter((id) => likedMe.some((lm) => lm.liker_id === id));

      if (mutualIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("*")
          .in("id", mutualIds);

        setMatches(profiles || []);
      }
    }

    fetchMatches();
  }, []);

  if (!matches.length)
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Matches
        </h2>
        <p className="text-gray-600">
          No matches yet. Keep liking profiles and see who likes you back!
        </p>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Your Matches
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={
                m.avatar_url ||
                `https://api.dicebear.com/8.x/avataaars/svg?seed=${m.full_name}`
              }
              alt={m.full_name}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
            <h3 className="text-lg font-bold">{m.full_name}</h3>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/profile/${m.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate(`/dashboard/messages/${m.id}`)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
