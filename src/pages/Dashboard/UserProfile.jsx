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

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import Spinner from "../../components/Spinner";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      else setProfile(data);

      setLoading(false);
    }
    fetchProfile();
  }, []);

  function handleChange(e) {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", profile.id);
    setSaving(false);

    if (error) alert(error.message);
    else alert("Profile updated!");
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: data.publicUrl });
    } catch (err) {
      console.error(err);
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 flex justify-center">
        <Spinner className="w-10 h-10 text-pink-600" />
      </div>
    );
  if (!profile) return <div className="p-6">No profile found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Profile
      </h1>

      <div className="flex flex-col items-center mb-8">
        <img
          src={
            profile.avatar_url ||
            `https://api.dicebear.com/8.x/avataaars/svg?seed=${profile.full_name}`
          }
          alt="Avatar"
          className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-pink-200 shadow-md"
        />
        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition">
          {uploading ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" /> Uploading...
            </div>
          ) : (
            "Change Photo"
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <Input
          label="Full Name"
          name="full_name"
          type="text"
          value={profile.full_name || ""}
          onChange={handleChange}
          placeholder="Full name"
        />
        <Input
          label="Birthdate"
          name="birthdate"
          type="date"
          value={profile.birthdate || ""}
          onChange={handleChange}
        />
        <Textarea
          label="About Me"
          name="bio"
          value={profile.bio || ""}
          onChange={handleChange}
          placeholder="Share your hobbies, interests, and what you're looking for..."
        />
        <Select
          label="Gender"
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
          placeholder="Select Gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <Input
          label="Address"
          name="address"
          value={profile.address || ""}
          onChange={handleChange}
          placeholder="City, Country"
        />
        <Input
          label="Qualification"
          name="qualification"
          value={profile.qualification || ""}
          onChange={handleChange}
          placeholder="e.g. Bachelor's in CS"
        />
        <Select
          label="Job Status"
          name="job_status"
          value={profile.job_status || ""}
          onChange={handleChange}
          placeholder="Select Status"
          options={[
            { value: "Employed", label: "Employed" },
            { value: "Unemployed", label: "Unemployed" },
            { value: "Student", label: "Student" },
            { value: "Self-Employed", label: "Self-Employed" },
          ]}
        />
        <Select
          label="Job Type"
          name="job_type"
          value={profile.job_type || ""}
          onChange={handleChange}
          placeholder="Select Type"
          options={[
            { value: "Full-time", label: "Full-time" },
            { value: "Part-time", label: "Part-time" },
            { value: "Freelance", label: "Freelance" },
            { value: "Contract", label: "Contract" },
          ]}
        />

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {saving ? <Spinner className="w-5 h-5 text-white" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
