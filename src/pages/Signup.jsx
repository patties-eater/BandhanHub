// src/pages/Signup.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // async function handleSignup(e) {
  //   e.preventDefault();
  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       emailRedirectTo: `${bandhan-hub.vercel.app}/auth/callback`,
  //     },
  //   });
  //   if (error) return alert(error.message);
  //   alert("Signup successful. Check your email for confirmation link.");
  //   navigate("/"); // go to login (user should click link in email)
  // }

  async function handleSignup(e) {
  e.preventDefault();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://bandhan-hub.vercel.app/auth/callback", // fixed
    },
  });
  if (error) return alert(error.message);
  alert("Signup successful. Check your email for confirmation link.");
  navigate("/"); // redirect user to login (they'll confirm via email)
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create account</h2>
        <form onSubmit={handleSignup} className="flex flex-col gap-3">
          <input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border p-2 rounded" />
          <input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="border p-2 rounded" />
          <button className="bg-green-600 text-white py-2 rounded">Signup</button>
        </form>
      </div>
    </div>
  );
}
