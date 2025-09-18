// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // parse the url and store session (magic link / verification)
    // getSessionFromUrl may return session and store it in local storage when storeSession:true
    async function handleCallback() {
      try {
        // storeSession: true ensures the client stores the session after redirect
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
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
      <div>Processing authentication... please wait.</div>
    </div>
  );
}
