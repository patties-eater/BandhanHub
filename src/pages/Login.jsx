// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // ✅ helper → check profile and redirect
  async function checkProfileAndRedirect() {
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return navigate("/");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Profile fetch error:", error);
    }

    if (profile) navigate("/dashboard");
    else navigate("/profile-setup");
  }

  // ✅ password login
  async function handlePasswordLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    await checkProfileAndRedirect();
  }

  // ✅ send OTP
  async function handleSendOtp() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    if (error) return alert(error.message);
    setOtpMode(true);
    alert("Check your email for the login link or OTP code.");
  }

  // ✅ verify OTP
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <form
          onSubmit={otpMode ? handleVerifyOtp : handlePasswordLogin}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
            required
          />

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
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {otpMode ? "Verify OTP" : "Login"}
          </button>
        </form>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSendOtp}
            className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Send OTP
          </button>
          <Link
            to="/forgot-password"
            className="flex-1 text-center py-2 border rounded text-blue-600"
          >
            Forgot?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
