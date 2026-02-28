// // src/pages/Login.jsx
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { supabase } from "../supabaseClient";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otpMode, setOtpMode] = useState(false);
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();

//   // ✅ helper → check profile and redirect
//   async function checkProfileAndRedirect() {
//     const { data: { user } = {} } = await supabase.auth.getUser();
//     if (!user) return navigate("/");

//     const { data: profile, error } = await supabase
//       .from("profiles")
//       .select("id")
//       .eq("id", user.id)
//       .single();

//     if (error && error.code !== "PGRST116") {
//       console.error("Profile fetch error:", error);
//     }

//     if (profile) navigate("/dashboard");
//     else navigate("/profile-setup");
//   }

//   // ✅ password login
//   async function handlePasswordLogin(e) {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) return alert(error.message);
//     await checkProfileAndRedirect();
//   }

//   // ✅ send OTP
//   async function handleSendOtp() {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         emailRedirectTo: `${window.location.origin}/auth/callback`,
//         shouldCreateUser: true,
//       },
//     });
//     if (error) return alert(error.message);
//     setOtpMode(true);
//     alert("Check your email for the login link or OTP code.");
//   }

//   // ✅ verify OTP
//   async function handleVerifyOtp(e) {
//     e.preventDefault();
//     const { error } = await supabase.auth.verifyOtp({
//       email,
//       token: otp,
//       type: "email",
//     });
//     if (error) return alert(error.message);
//     await checkProfileAndRedirect();
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
//       <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

//         <form
//           onSubmit={otpMode ? handleVerifyOtp : handlePasswordLogin}
//           className="flex flex-col gap-3"
//         >
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="border p-2 rounded"
//             required
//           />

//           {!otpMode && (
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="border p-2 rounded"
//               required
//             />
//           )}

//           {otpMode && (
//             <input
//               type="text"
//               placeholder="Enter 6-digit code"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="border p-2 rounded"
//             />
//           )}

//           <button
//             type="submit"
//             className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             {otpMode ? "Verify OTP" : "Login"}
//           </button>
//         </form>

//         <div className="mt-3 flex gap-2">
//           <button
//             onClick={handleSendOtp}
//             className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
//           >
//             Send OTP
//           </button>
//           <Link
//             to="/forgot-password"
//             className="flex-1 text-center py-2 border rounded text-blue-600"
//           >
//             Forgot?
//           </Link>
//         </div>

//         <div className="mt-4 text-center text-sm">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="text-blue-600 underline">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Spinner from "../components/Spinner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) return alert(error.message);
    await checkProfileAndRedirect();
  }

  // ✅ magic link login
  async function handleMagicLink(e) {
    e.preventDefault();
    if (!email) return alert("Please enter your email to send a magic link.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (error) return alert(error.message);
    alert("✅ Check your email for a magic login link.");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to BandhanHub</p>
        </div>

        <form onSubmit={handlePasswordLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200 outline-none transition-all duration-200"
              required
            />
            <div className="flex justify-end mt-1">
              <Link
                to="/forgot-password"
                class="text-xs text-purple-600 hover:text-purple-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center">
                <Spinner className="w-6 h-6 text-white" />
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="mt-6 w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors focus:ring-4 focus:ring-gray-100 flex items-center justify-center gap-2"
          >
            <span>✨</span> Send Magic Link
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-purple-600 hover:text-purple-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
          <p className="mt-6 text-xs text-gray-400 font-medium">
            Made by Prashin
          </p>
        </div>
      </div>
    </div>
  );
}
