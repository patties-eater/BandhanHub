// export default function Matches() {
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Matches</h2>
//       <p className="text-gray-600">This is where your matched profiles will appear.</p>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";

// export default function Matches() {
//   const [matches, setMatches] = useState([]);

//   useEffect(() => {
//     async function fetchMatches() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       // Get all likes where current user liked others
//       const { data: myLikes } = await supabase
//         .from("likes")
//         .select("liked_id")
//         .eq("liker_id", user.id);

//       if (!myLikes) return;

//       // Get all likes where others liked me
//       const { data: likedMe } = await supabase
//         .from("likes")
//         .select("liker_id")
//         .eq("liked_id", user.id);

//       if (!likedMe) return;

//       // Find mutual likes
//       const mutualIds = myLikes
//         .map((l) => l.liked_id)
//         .filter((id) => likedMe.some((lm) => lm.liker_id === id));

//       if (mutualIds.length > 0) {
//         const { data: profiles } = await supabase
//           .from("profiles")
//           .select("*")
//           .in("id", mutualIds);

//         setMatches(profiles || []);
//       }
//     }

//     fetchMatches();
//   }, []);

//   if (!matches.length)
//     return (
//       <div className="p-6">
//         <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//           Your Matches
//         </h2>
//         <p className="text-gray-600">
//           No matches yet. Keep liking profiles and see who likes you back!
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         Your Matches
//       </h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {matches.map((m) => (
//           <div
//             key={m.id}
//             className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
//           >
//             <img
//               src={
//                 m.avatar_url ||
//                 `https://api.dicebear.com/8.x/avataaars/svg?seed=${m.full_name}`
//               }
//               alt={m.full_name}
//               className="w-24 h-24 rounded-full mb-3 object-cover"
//             />
//             <h3 className="text-lg font-bold">{m.full_name}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }










import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Matches() {
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current user once
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("Error fetching user:", error);
        return navigate("/"); // redirect if not logged in
      }

      setUser(user);
    }

    fetchUser();
  }, [navigate]);

  // Fetch all profiles except current user
  useEffect(() => {
    if (!user) return;

    async function fetchProfiles() {
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
        return;
      }

      const otherProfiles = data.filter((p) => p.id !== user.id);
      setProfiles(otherProfiles);
      setLoading(false);
    }

    fetchProfiles();
  }, [user]);

  // Fetch mutual matches
  useEffect(() => {
    if (!user) return;

    async function fetchMatches() {
      // Get all likes where current user liked others
      const { data: myLikes } = await supabase
        .from("likes")
        .select("liked_id")
        .eq("liker_id", user.id);

      if (!myLikes) return;

      // Get all likes where others liked me
      const { data: likedMe } = await supabase
        .from("likes")
        .select("liker_id")
        .eq("liked_id", user.id);

      if (!likedMe) return;

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
    }

    fetchMatches();
  }, [user]);

  if (loading)
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Loading Matches...
        </h2>
      </div>
    );

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

            {/* --- Buttons --- */}
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
