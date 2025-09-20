// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// export default function Home() {
//   const [profiles, setProfiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchProfiles() {
//       // Get the current logged-in user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return navigate("/"); // redirect to login if not logged in

//       // Fetch other profiles (exclude self)
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .neq("id", user.id);

//       if (error) console.error(error);
//       else setProfiles(data);

//       setLoading(false);
//     }

//     fetchProfiles();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );
//   }

//   if (!profiles.length) {
//     return <p className="p-6 text-gray-600">No other profiles found.</p>;
//   }

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
//               <p className="text-sm text-gray-500">
//                 Age: {getAge(p.birthdate)}
//               </p>
//             )}
//             <p className="text-sm text-gray-500">{p.address}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Helper to calculate age
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
//       // Get the logged-in user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return navigate("/");

//       // Fetch all profiles (exclude current user safely)
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*");

//       if (error) {
//         console.error(error);
//         setLoading(false);
//         return;
//       }

//       // Filter out current user in JS (to avoid UUID mismatches)
//       const otherProfiles = data.filter(p => p.id !== user.id);

//       setProfiles(otherProfiles);
//       setLoading(false);
//     }

//     fetchProfiles();
//   }, [navigate]);

//   if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
//   if (!profiles.length) return <p className="p-6 text-gray-600">No other profiles found.</p>;

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         Suggested Profiles
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {profiles.map(p => (
//           <div key={p.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center">
//             <img
//               src={p.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${p.full_name}`}
//               alt={p.full_name}
//               className="w-24 h-24 rounded-full mb-3 object-cover"
//             />
//             <h3 className="text-lg font-bold">{p.full_name}</h3>
//             {p.birthdate && <p className="text-sm text-gray-500">Age: {getAge(p.birthdate)}</p>}
//             {p.address && <p className="text-sm text-gray-500">{p.address}</p>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Helper to calculate age
// function getAge(birthdate) {
//   const dob = new Date(birthdate);
//   const diff = Date.now() - dob.getTime();
//   return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
// }





// import DummyProfiles from "./DummyProfiles";

// export default function Home() {
//   return <DummyProfiles />;
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
//       // 1️⃣ Get logged-in user
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user:", userError);
//         return navigate("/"); // redirect if not logged in
//       }

//       console.log("Logged-in user ID:", user.id);

//       // 2️⃣ Fetch all profiles
//       const { data, error } = await supabase.from("profiles").select("*");

//       if (error) {
//         console.error("Error fetching profiles:", error);
//         setLoading(false);
//         return;
//       }

//       console.log("All profiles IDs:", data.map((p) => p.id));

//       // 3️⃣ Filter out the logged-in user in JS (safe)
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

//   // ---------------- Render Cards ----------------
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
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ---------------- Helper to calculate age ----------------
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
                onClick={() => navigate(`/dashboard/profile/${p.id}`)} // ✅ fixed
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate(`/dashboard/messages/${p.id}`)} // ✅ fixed
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

function getAge(birthdate) {
  const dob = new Date(birthdate);
  const diff = Date.now() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
