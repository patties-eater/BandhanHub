// src/pages/Signup.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://bandhan-hub.vercel.app/auth/callback`,
      },
    });
    setLoading(false);
    if (error) return alert(error.message);
    alert("Signup successful. Check your email for confirmation link.");
    navigate("/"); // go to login (user should click link in email)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-4">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500">Join BandhanHub today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 outline-none transition-all duration-200"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="w-6 h-6 text-white" />
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold text-pink-600 hover:text-pink-500 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
