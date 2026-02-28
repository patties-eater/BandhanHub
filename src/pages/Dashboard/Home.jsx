// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// export default function Home() {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchProfiles() {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user:", userError);
//         return navigate("/"); // redirect if not logged in
//       }

//       const { data, error } = await supabase.from("profiles").select("*");

//       if (error) {
//         console.error("Error fetching profiles:", error);
//         setLoading(false);
//         return;
//       }

//       const otherProfiles = data.filter((p) => p.id !== user.id);

//       setProfiles(otherProfiles);
//       setLoading(false);
//     }

//     fetchProfiles();
//   }, [navigate]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">Loading…</div>
//     );

//   if (!profiles.length)
//     return <p className="p-6 text-gray-600">No other profiles found.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         Suggested Profiles
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {profiles.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
//           >
//             <img
//               src={
//                 p.avatar_url ||
//                 `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`
//               }
//               alt={p.full_name}
//               className="w-24 h-24 rounded-full mb-3 object-cover"
//             />
//             <h3 className="text-lg font-bold">{p.full_name}</h3>
//             {p.birthdate && (
//               <p className="text-sm text-gray-500">Age: {getAge(p.birthdate)}</p>
//             )}
//             {p.address && (
//               <p className="text-sm text-gray-500">{p.address}</p>
//             )}

//             {/* --- New Buttons --- */}
//             <div className="mt-4 flex gap-3">
//               <button
//                 onClick={() => navigate(`/profile/${p.id}`)}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
//               >
//                 View Profile
//               </button>
//               <button
//                 onClick={() => navigate(`/messages/${p.id}`)}
//                 className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
//               >
//                 Message
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function getAge(birthdate) {
//   const dob = new Date(birthdate);
//   const diff = Date.now() - dob.getTime();
//   return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
// }

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// export default function Home() {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchProfiles() {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user:", userError);
//         return navigate("/"); // redirect if not logged in
//       }

//       const { data, error } = await supabase.from("profiles").select("*");

//       if (error) {
//         console.error("Error fetching profiles:", error);
//         setLoading(false);
//         return;
//       }

//       const otherProfiles = data.filter((p) => p.id !== user.id);

//       setProfiles(otherProfiles);
//       setLoading(false);
//     }

//     fetchProfiles();
//   }, [navigate]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">Loading…</div>
//     );

//   if (!profiles.length)
//     return <p className="p-6 text-gray-600">No other profiles found.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         Suggested Profiles
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {profiles.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
//           >
//             <img
//               src={
//                 p.avatar_url ||
//                 `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`
//               }
//               alt={p.full_name}
//               className="w-24 h-24 rounded-full mb-3 object-cover"
//             />
//             <h3 className="text-lg font-bold">{p.full_name}</h3>
//             {p.birthdate && (
//               <p className="text-sm text-gray-500">Age: {getAge(p.birthdate)}</p>
//             )}
//             {p.address && (
//               <p className="text-sm text-gray-500">{p.address}</p>
//             )}

//             {/* --- Buttons --- */}
//             <div className="mt-4 flex gap-3">
//               <button
//                 onClick={() => navigate(`/dashboard/profile/${p.id}`)} // ✅ fixed
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
//               >
//                 View Profile
//               </button>
//               <button
//                 onClick={() => navigate(`/dashboard/messages/${p.id}`)} // ✅ fixed
//                 className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
//               >
//                 Message
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function getAge(birthdate) {
//   const dob = new Date(birthdate);
//   const diff = Date.now() - dob.getTime();
//   return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Spinner from "../../components/Spinner";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({ likes: 0, views: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfiles() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return navigate("/"); // redirect if not logged in
      }

      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching profiles:", error);
        setLoading(false);
        return;
      }

      const myProfile = data.find((p) => p.id === user.id);
      setCurrentUser(myProfile);

      const otherProfiles = data.filter((p) => p.id !== user.id);
      setProfiles(otherProfiles);

      // Fetch stats (likes count)
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("liked_id", user.id);

      setStats({
        likes: count || 0,
        views: Math.floor(Math.random() * 100) + 12,
      }); // Mock views
      setLoading(false);
    }

    fetchProfiles();
  }, [navigate]);

  async function handleLike(likedId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Insert a like
    const { error } = await supabase
      .from("likes")
      .insert([{ liker_id: user.id, liked_id: likedId }]);
    if (error) {
      console.error("Error liking:", error);
      return;
    }

    // Check if the other user already liked back
    const { data: matchCheck } = await supabase
      .from("likes")
      .select("*")
      .eq("liker_id", likedId)
      .eq("liked_id", user.id);

    if (matchCheck && matchCheck.length > 0) {
      alert("🎉 It's a match!");
      // Optionally, insert into a matches table
    } else {
      alert("👍 You liked this profile!");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Spinner className="w-10 h-10 text-purple-600" />
      </div>
    );

  if (!profiles.length)
    return <p className="p-6 text-gray-600">No other profiles found.</p>;

  return (
    <div className="min-h-full bg-gray-50 pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white pt-10 pb-24 px-6 rounded-b-[3rem] shadow-xl mb-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Hello, {currentUser?.full_name?.split(" ")[0] || "Friend"}! 👋
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Discover new connections and find your perfect match today.
          </p>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 mb-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-2 gap-8 divide-x divide-gray-100">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-pink-600 mb-1">
              {stats.likes}
            </p>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Profile Likes
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-purple-600 mb-1">
              {stats.views}
            </p>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-wide">
              Profile Views
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          ✨ Suggested For You
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-gray-200">
                <img
                  src={
                    p.avatar_url ||
                    `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`
                  }
                  alt={p.full_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                  <h3 className="text-xl font-bold text-white truncate">
                    {p.full_name}
                    {p.birthdate && (
                      <span className="font-normal text-sm ml-2 opacity-90">
                        {getAge(p.birthdate)}
                      </span>
                    )}
                  </h3>
                  {p.address && (
                    <p className="text-xs text-gray-200 truncate">
                      {p.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 flex gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/dashboard/profile/${p.id}`)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleLike(p.id)}
                  className="flex-1 py-2 bg-pink-100 text-pink-600 rounded-lg text-sm font-semibold hover:bg-pink-200 transition flex items-center justify-center gap-1"
                >
                  ❤️ Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
