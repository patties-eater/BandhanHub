import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) setUser(currentUser);
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // Delete profile data
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);
      if (error) throw error;

      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      alert("Error deleting account: " + error.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Spinner className="w-8 h-8 text-gray-500" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          👤 Account Information
        </h2>
        {user ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-500">
                Email Address
              </label>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">User ID</label>
              <p className="font-mono text-xs text-gray-400 bg-gray-50 p-2 rounded">
                {user.id}
              </p>
            </div>
          </div>
        ) : (
          <p>No user data.</p>
        )}
      </div>

      {/* Privacy Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          🔒 Privacy & Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Show my profile to others</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Receive email notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
          ⚠️ Danger Zone
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
          >
            Sign Out
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-200"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Account?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-red-200"
                disabled={deleting}
              >
                {deleting ? (
                  <Spinner className="w-4 h-4 text-white" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
