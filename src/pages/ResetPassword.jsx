// src/pages/ResetPassword.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // When user arrives via reset link, parse and store session
    async function init() {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });
        if (error) {
          console.error("Reset callback parse error", error);
          // still allow manual entry? But better fall back to login
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReady(true);
      }
    }
    init();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    // user should already have a session after clicking the reset link; update password
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return alert(error.message);
    alert("Password updated. Please login with your new password.");
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Choose a new password</h2>
        {!ready ? (
          <div className="flex justify-center p-4">
            <Spinner className="w-8 h-8 text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <input
              type="password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
            />
            <button className="bg-green-600 text-white py-2 rounded">
              Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
