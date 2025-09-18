import Navbar from "../../components/Navbar";
import ProfileCard from "../../components/ProfileCard";

export default function DashboardHome() {
  const profiles = [
    { name: "Anisha", age: 23, bio: "Loves hiking and momo", image: "https://i.pravatar.cc/150?img=1" },
    { name: "Sanjay", age: 25, bio: "Guitarist, foodie", image: "https://i.pravatar.cc/150?img=2" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center gap-6 bg-gray-100 p-6">
        {profiles.map((p, i) => (
          <ProfileCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}
