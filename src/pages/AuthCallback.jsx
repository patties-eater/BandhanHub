// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // parse the url and store session (magic link / verification)
    // getSessionFromUrl may return session and store it in local storage when storeSession:true
    async function handleCallback() {
      try {
        // storeSession: true ensures the client stores the session after redirect
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });
        if (error) {
          console.error("Auth callback error:", error);
          // just redirect to login on error
          return navigate("/");
        }
        // we now have a session; decide where to go (profile check handled by /profile route)
        navigate("/profile");
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-10 h-10 text-purple-600" />
        <p>Processing authentication...</p>
      </div>
    </div>
  );
}
