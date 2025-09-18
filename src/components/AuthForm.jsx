import { useState } from "react";

export default function AuthForm({ title, onSubmit, buttonLabel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(email, password);
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">{title}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      {buttonLabel !== "Send Reset Link" && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
      )}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {buttonLabel}
      </button>
    </form>
  );
}
