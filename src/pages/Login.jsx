import { supabase } from "../supabaseClient";
import AuthForm from "../components/AuthForm";

export default function Login() {
  async function handleLogin(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Logged in successfully!");
    }
  }

  return <AuthForm title="Login" onSubmit={handleLogin} buttonLabel="Login" />;
}
