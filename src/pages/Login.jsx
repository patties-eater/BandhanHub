// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // helper to check profile and redirect
  async function checkProfileAndRedirect() {
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return navigate("/"); // fallback
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 may be thrown when not found; ignore and go to profile
      // (older clients might return different error codes — still safe)
      console.error(error);
    }

    if (profile) navigate("/dashboard");
    else navigate("/profile");
  }

  // 1) password login
  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    // session is set via client; now check profile & redirect
    await checkProfileAndRedirect();
  }

  // 2) send OTP (email) — Supabase will send magic link or 6-digit depending on config
  async function handleSendOtp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback`, shouldCreateUser: true },
    });
    if (error) return alert(error.message);
    alert("Check your email for the login link or OTP.");
    // if using 6-digit OTP code you can toggle otpMode to allow user to paste code
    setOtpMode(true);
  }

  // 3) verify OTP (6-digit code)
  async function handleVerifyOtp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) return alert(error.message);
    await checkProfileAndRedirect();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={otpMode ? handleVerifyOtp : handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

          {/* show password when not in otp-mode */}
          {!otpMode && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />
          )}

          {/* OTP input (if OTP mode active) */}
          {otpMode && (
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded"
            />
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded font-medium"
          >
            {otpMode ? "Verify OTP" : "Login"}
          </button>
        </form>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSendOtp}
            className="flex-1 bg-purple-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
          <Link to="/forgot-password" className="flex-1 text-center py-2 border rounded text-blue-600">
            Forgot?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
