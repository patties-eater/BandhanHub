



import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const containerRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) setCurrentUserId(currentUser.id);
    }
    getUser();
  }, []);

  // Fetch & realtime messages
  useEffect(() => {
    if (!currentUserId || !user?.id) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      setMessages(data || []);
    }
    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [currentUserId, user?.id]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function deleteMessage(id) {
    await supabase.from("messages").delete().eq("id", id);
  }

  async function addReaction(msgId, reaction) {
    const msg = messages.find((m) => m.id === msgId);
    const updated = [...(msg.reactions || []), reaction];
    await supabase.from("messages").update({ reactions: updated }).eq("id", msgId);
    setActiveMsgId(null);
  }

  // Long press handler for mobile
  const handleTouchStart = (id) => {
    longPressTimer.current = setTimeout(() => setActiveMsgId(id), 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div ref={containerRef} className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className="relative"
              onMouseEnter={() => setActiveMsgId(msg.id)} // PC hover
              onMouseLeave={() => setActiveMsgId(null)} // PC leave
              onTouchStart={() => handleTouchStart(msg.id)} // Mobile long press
              onTouchEnd={handleTouchEnd}
            >
              <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`inline-block p-3 rounded-2xl max-w-[70%] break-words ${
                    isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  <span>{msg.content}</span>
                  <div className="text-[10px] mt-1 text-right">{formatTime(msg.created_at)}</div>

                  {msg.reactions?.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {msg.reactions.map((r, i) => (
                        <span key={i}>{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown menu */}
              {activeMsgId === msg.id && (
                <div className="absolute -top-10 right-0 flex gap-2 bg-white shadow-md rounded p-1">
                  {reactions.map((r, i) => (
                    <span
                      key={i}
                      className="cursor-pointer hover:scale-125 transition"
                      onClick={() => addReaction(msg.id, r)}
                    >
                      {r}
                    </span>
                  ))}
                  <button
                    className="text-xs px-2 py-1 hover:bg-gray-100 rounded"
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                  >
                    Copy
                  </button>
                  {isOwn && (
                    <button
                      className="text-xs px-2 py-1 hover:bg-gray-100 rounded text-red-500"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
