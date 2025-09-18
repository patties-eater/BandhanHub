// src/pages/ProfileWizard.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    address: "",
    qualification: "",
    job_status: "",
    job_type: "",
  });

  useEffect(() => {
    // ensure user is logged in
    async function check() {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) return navigate("/"); // not logged in, go to login
      // If profile already exists, redirect dashboard
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single();
      if (profile) navigate("/dashboard");
      setLoading(false);
    }
    check();
  }, [navigate]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function saveProfile() {
    setLoading(true);
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) {
      alert("Not logged in.");
      return navigate("/");
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    navigate("/dashboard");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Complete your profile (Step {step} of 3)</h2>

        {step === 1 && (
          <>
            <input name="full_name" placeholder="Full name" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <input name="birthdate" type="date" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <input name="gender" placeholder="Gender" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <input name="address" placeholder="Address" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-blue-600 text-white p-2 rounded">Next</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <input name="qualification" placeholder="Qualification" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <input name="job_status" placeholder="Job status (employed/unemployed/student)" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <input name="job_type" placeholder="Job type (full-time/part-time/freelance)" className="w-full p-2 border mb-2 rounded" onChange={handleChange} />
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-gray-300 p-2 rounded">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-blue-600 text-white p-2 rounded">Next</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="mb-3">Review & submit</p>
            <pre className="bg-gray-100 p-2 rounded mb-3 text-sm">{JSON.stringify(form, null, 2)}</pre>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 bg-gray-300 p-2 rounded">Back</button>
              <button onClick={saveProfile} className="flex-1 bg-green-600 text-white p-2 rounded">Submit</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
