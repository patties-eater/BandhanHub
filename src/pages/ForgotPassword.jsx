import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
