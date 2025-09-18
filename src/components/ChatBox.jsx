import { useState } from "react";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([
    { from: "them", text: "Hi! 👋" },
    { from: "me", text: "Hey, how are you?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 bg-pink-100">
        <img
          src={user.image}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="font-semibold">{user.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs ${
              msg.from === "me" ? "bg-pink-500 text-white ml-auto" : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-3 gap-2">
        <input
          className="flex-1 border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-pink-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
