import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  async function sendOtp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("OTP sent to your email!");
      setStep(2);
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Logged in successfully!");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-96">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter Email</h2>
            <form onSubmit={sendOtp} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
            <form onSubmit={verifyOtp} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
