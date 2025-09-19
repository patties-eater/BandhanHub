// import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// export default function UserProfile() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   // Fetch logged-in user profile
//   useEffect(() => {
//     async function fetchProfile() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", user.id)
//         .single();

//       if (error) {
//         console.error(error);
//       } else {
//         setProfile(data);
//       }
//       setLoading(false);
//     }
//     fetchProfile();
//   }, []);

//   // Handle form submission (update profile)
//   async function handleUpdate(e) {
//     e.preventDefault();
//     const { error } = await supabase
//       .from("profiles")
//       .update(profile)
//       .eq("id", profile.id);

//     if (error) alert(error.message);
//     else alert("Profile updated!");
//   }

//   // Handle avatar upload
//   async function uploadAvatar(event) {
//     try {
//       setUploading(true);
//       const file = event.target.files[0];
//       if (!file) return;

//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       const fileExt = file.name.split(".").pop();
//       const fileName = `${user.id}.${fileExt}`;
//       const filePath = `avatars/${fileName}`;

//       // Upload file to Supabase Storage (avatars bucket)
//       const { error: uploadError } = await supabase.storage
//         .from("avatars")
//         .upload(filePath, file, { upsert: true });

//       if (uploadError) throw uploadError;

//       // Get public URL
//       const { data: { publicUrl } } = supabase.storage
//         .from("avatars")
//         .getPublicUrl(filePath);

//       // Update profile with avatar URL
//       const { error: updateError } = await supabase
//         .from("profiles")
//         .update({ avatar_url: publicUrl })
//         .eq("id", user.id);

//       if (updateError) throw updateError;

//       setProfile({ ...profile, avatar_url: publicUrl });
//     } catch (error) {
//       alert("Error uploading avatar!");
//       console.error(error);
//     } finally {
//       setUploading(false);
//     }
//   }

//   if (loading) return <div className="p-6">Loading…</div>;
//   if (!profile) return <div className="p-6">No profile found</div>;

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

//       {/* Avatar Section */}
//       <div className="flex flex-col items-center mb-4">
//         <img
//           src={
//             profile.avatar_url ||
//             `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.full_name}`
//           }
//           alt="Avatar"
//           className="w-24 h-24 rounded-full mb-2 object-cover"
//         />
//         <label className="cursor-pointer bg-gray-200 px-3 py-1 rounded text-sm">
//           {uploading ? "Uploading…" : "Change Photo"}
//           <input
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={uploadAvatar}
//             disabled={uploading}
//           />
//         </label>
//       </div>

//       {/* Profile Form */}
//       <form onSubmit={handleUpdate} className="space-y-3">
//         <input
//           type="text"
//           value={profile.full_name || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, full_name: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Full name"
//         />
//         <input
//           type="date"
//           value={profile.birthdate || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, birthdate: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//         />
//         <input
//           type="text"
//           value={profile.gender || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, gender: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Gender"
//         />
//         <input
//           type="text"
//           value={profile.address || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, address: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Address"
//         />
//         <input
//           type="text"
//           value={profile.qualification || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, qualification: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Qualification"
//         />
//         <input
//           type="text"
//           value={profile.job_status || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, job_status: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Job status"
//         />
//         <input
//           type="text"
//           value={profile.job_type || ""}
//           onChange={(e) =>
//             setProfile({ ...profile, job_type: e.target.value })
//           }
//           className="w-full border p-2 rounded"
//           placeholder="Job type"
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           Save Changes
//         </button>
//       </form>
//     </div>
//   );
// }
