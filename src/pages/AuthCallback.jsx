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
    function isProfileComplete(profile) {
      if (!profile) return false;
      return (
        profile.full_name &&
        profile.birthdate &&
        profile.gender &&
        profile.address &&
        profile.qualification &&
        profile.job_status
      );
    }

    async function checkProfileAndRedirect() {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) return navigate("/");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "id, full_name, birthdate, gender, address, qualification, job_status"
        )
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Profile fetch error:", error);
      }

      if (isProfileComplete(profile)) navigate("/dashboard");
      else navigate("/profile-setup");
    }

    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (error) {
            console.error("Auth callback error:", error);
            return navigate("/");
          }
        }

        // we now have a session (or already had one); decide where to go based on profile
        await checkProfileAndRedirect();
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    }

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl px-8 py-10 flex flex-col items-center gap-4 w-full max-w-sm">
        <Spinner className="w-10 h-10 text-purple-600" />
        <p className="text-gray-700 font-medium">Processing authentication...</p>
      </div>
    </div>
  );
}
