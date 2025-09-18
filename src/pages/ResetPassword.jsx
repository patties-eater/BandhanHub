import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  async function handleUpdatePassword(e) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully! You can now login.");
      window.location.href = "/";
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
