

// export default function Settings() {
//   return (
//     <div className="h-screen flex flex-col">
      
//       <div className="p-6">
//         <h1 className="text-2xl font-bold">Settings</h1>
//         <p className="mt-2">Update account preferences, privacy, and logout.</p>
//       </div>
//     </div>
//   );
// }




import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function Settings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) setUser(currentUser);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="p-6 bg-white shadow">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-600">Update account preferences, privacy, and logout.</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Profile Info */}
        {user && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p><strong>Name:</strong> {user.user_metadata?.full_name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        {/* Privacy */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Privacy</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" />
            Show my profile to others
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="form-checkbox" />
            Receive notifications
          </label>
        </div>

        {/* Logout */}
        <div className="bg-white p-4 rounded-lg shadow">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
