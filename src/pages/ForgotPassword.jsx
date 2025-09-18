import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleReset(e) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    if (error) return alert(error.message);
    alert("Password reset email sent. Check your inbox.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <input type="email" required placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded"/>
          <button className="bg-blue-600 text-white py-2 rounded">Send Reset Link</button>
        </form>
        <div className="mt-3 text-sm text-center">
          <Link to="/" className="text-blue-600 underline">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
