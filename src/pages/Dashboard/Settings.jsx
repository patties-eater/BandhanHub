import Navbar from "../../components/Navbar";

export default function Settings() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2">Update account preferences, privacy, and logout.</p>
      </div>
    </div>
  );
}
