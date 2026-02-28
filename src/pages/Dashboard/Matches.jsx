import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Spinner from "../../components/Spinner";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMatches() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      // Get all likes where current user liked others
      const { data: myLikes } = await supabase
        .from("likes")
        .select("liked_id")
        .eq("liker_id", user.id);

      // Get all likes where others liked me
      const { data: likedMe } = await supabase
        .from("likes")
        .select("liker_id")
        .eq("liked_id", user.id);

      if (!myLikes || !likedMe) {
        setLoading(false);
        return;
      }

      // Find mutual likes
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
      setLoading(false);
    }

    fetchMatches();
  }, [navigate]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Spinner className="w-10 h-10 text-pink-600" />
      </div>
    );

  if (!matches.length)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-pink-50 p-6 rounded-full mb-4">
          <span className="text-4xl">💔</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Matches Yet
        </h2>
        <p className="text-gray-500 max-w-md">
          Don't worry! Keep exploring and liking profiles. When someone likes
          you back, they'll appear here.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition shadow-lg hover:shadow-xl"
        >
          Find People
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        Your Matches{" "}
        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {matches.length}
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={
                  m.avatar_url ||
                  `https://api.dicebear.com/8.x/avataaars/svg?seed=${m.full_name}`
                }
                alt={m.full_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium">Matched! 🎉</span>
              </div>
            </div>

            <div className="p-5 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {m.full_name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {m.address || "No location"}
              </p>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => navigate(`/dashboard/profile/${m.id}`)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate(`/dashboard/messages/${m.id}`)}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition shadow-md hover:shadow-lg"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
