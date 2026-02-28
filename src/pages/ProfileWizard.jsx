// src/pages/ProfileWizard.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";

export default function ProfileWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    birthdate: "",
    gender: "",
    address: "",
    qualification: "",
    job_status: "",
    job_type: "",
    bio: "",
  });

  useEffect(() => {
    // ensure user is logged in
    async function check() {
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) return navigate("/"); // not logged in, go to login
      // If profile already exists, redirect dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (profile) navigate("/dashboard");
      setLoading(false);
    }
    check();
  }, [navigate]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  }

  function handleNext() {
    if (step === 1) {
      if (
        !form.full_name.trim() ||
        !form.birthdate ||
        !form.gender ||
        !form.address.trim()
      ) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    if (step === 2) {
      if (!form.qualification.trim() || !form.job_status) {
        setError("Please fill in qualification and job status.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  }

  async function saveProfile() {
    setSubmitting(true);
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) {
      alert("Not logged in.");
      return navigate("/");
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/dashboard");
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header / Progress */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Setup Profile</h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Step {step} of 3
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
              <Input
                label="Birthdate"
                name="birthdate"
                type="date"
                value={form.birthdate}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                placeholder="Select Gender"
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />
              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="City, Country"
              />
              <button
                onClick={handleNext}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition hover:-translate-y-0.5"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <Textarea
                label="About Me (Bio)"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
              />
              <Input
                label="Qualification"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. Bachelor's in CS"
              />
              <Select
                label="Job Status"
                name="job_status"
                value={form.job_status}
                onChange={handleChange}
                placeholder="Select Status"
                options={[
                  { value: "Employed", label: "Employed" },
                  { value: "Unemployed", label: "Unemployed" },
                  { value: "Student", label: "Student" },
                  { value: "Self-Employed", label: "Self-Employed" },
                ]}
              />
              <Select
                label="Job Type (Optional)"
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                placeholder="Select Type"
                options={[
                  { value: "Full-time", label: "Full-time" },
                  { value: "Part-time", label: "Part-time" },
                  { value: "Freelance", label: "Freelance" },
                  { value: "Contract", label: "Contract" },
                ]}
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-0.5"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Name</span>
                    <span className="font-medium">{form.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Gender</span>
                    <span className="font-medium">{form.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Birthdate</span>
                    <span className="font-medium">{form.birthdate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Address</span>
                    <span className="font-medium">{form.address}</span>
                  </div>
                  {form.bio && (
                    <div className="col-span-2">
                      <span className="text-gray-500 block">Bio</span>
                      <span className="font-medium text-gray-700 italic">
                        "{form.bio}"
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 border-b pb-2 pt-2">
                  Professional Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">Qualification</span>
                    <span className="font-medium">{form.qualification}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Status</span>
                    <span className="font-medium">{form.job_status}</span>
                  </div>
                  {form.job_type && (
                    <div className="col-span-2">
                      <span className="text-gray-500 block">Job Type</span>
                      <span className="font-medium">{form.job_type}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={saveProfile}
                  disabled={submitting}
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-green-700 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {submitting ? (
                    <Spinner className="w-5 h-5 text-white" />
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
