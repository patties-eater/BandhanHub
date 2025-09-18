import Navbar from "../../components/Navbar";
import MatchList from "../../components/MatchList";

export default function Matches() {
  const matches = [
    { name: "Anisha", bio: "Loves hiking", image: "https://i.pravatar.cc/100?img=5" },
    { name: "Sanjay", bio: "Plays guitar", image: "https://i.pravatar.cc/100?img=6" },
  ];

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <MatchList matches={matches} />
    </div>
  );
}
