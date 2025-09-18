import { supabase } from "../supabaseClient";
import AuthForm from "../components/AuthForm";

export default function Signup() {
  async function handleSignup(email, password) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! Check your email for confirmation.");
    }
  }

  return <AuthForm title="Signup" onSubmit={handleSignup} buttonLabel="Signup" />;
}
