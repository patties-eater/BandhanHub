import Navbar from "../../components/Navbar";

export default function Profile() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="mt-2">Edit your details, upload photo, update bio, etc.</p>
      </div>
    </div>
  );
}
