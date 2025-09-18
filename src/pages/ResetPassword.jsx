import { supabase } from "../supabaseClient";
import { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  async function handleUpdatePassword(e) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully! You can now login.");
    }
  }

  return (
    <form onSubmit={handleUpdatePassword} className="p-4 flex flex-col gap-3 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Update Password
      </button>
    </form>
  );
}
