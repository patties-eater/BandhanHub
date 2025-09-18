import Navbar from "../../components/Navbar";
import ChatBox from "../../components/ChatBox";

export default function Messages() {
  const user = { name: "Anisha", image: "https://i.pravatar.cc/100?img=5" };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ChatBox user={user} />
      </div>
    </div>
  );
}
