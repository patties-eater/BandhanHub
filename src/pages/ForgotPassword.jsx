import { supabase } from "../supabaseClient";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Password reset link sent! Check your email.");
    }
  }

  return (
    <form onSubmit={handleReset} className="p-4 flex flex-col gap-3 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Reset Link
      </button>
    </form>
  );
}
