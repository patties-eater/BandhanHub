




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

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
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

      const otherProfiles = data.filter((p) => p.id !== user.id);
      setProfiles(otherProfiles);
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
    const { error } = await supabase.from("likes").insert([
      { liker_id: user.id, liked_id: likedId },
    ]);
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
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );

  if (!profiles.length)
    return <p className="p-6 text-gray-600">No other profiles found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Suggested Profiles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center"
          >
            <img
              src={
                p.avatar_url ||
                `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`
              }
              alt={p.full_name}
              className="w-24 h-24 rounded-full mb-3 object-cover"
            />
            <h3 className="text-lg font-bold">{p.full_name}</h3>
            {p.birthdate && (
              <p className="text-sm text-gray-500">Age: {getAge(p.birthdate)}</p>
            )}
            {p.address && (
              <p className="text-sm text-gray-500">{p.address}</p>
            )}

            {/* --- Buttons --- */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate(`/dashboard/profile/${p.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate(`/dashboard/messages/${p.id}`)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Message
              </button>
              <button
                onClick={() => handleLike(p.id)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600"
              >
                ❤️ Like
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
