import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import VoiceMessage from "./VoiceMessage";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

export default function ChatBox({
  user,
  currentUserId: propCurrentUserId,
  onStartCall,
  onAnswerCall,
  onDeclineCall,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(propCurrentUserId);
  const [activeMsgId, setActiveMsgId] = useState(null);
  const containerRef = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    if (propCurrentUserId) {
      setCurrentUserId(propCurrentUserId);
      return;
    }
    async function getUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) setCurrentUserId(currentUser.id);
    }
    getUser();
  }, [propCurrentUserId]);

  // Fetch & realtime messages
  useEffect(() => {
    if (!currentUserId || !user?.id) return;

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`,
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
            // Only add if it belongs to this chat
            const isRelevant =
              (payload.new.sender_id === currentUserId &&
                payload.new.receiver_id === user.id) ||
              (payload.new.sender_id === user.id &&
                payload.new.receiver_id === currentUserId);

            if (isRelevant) {
              setMessages((prev) => [...prev, payload.new]);
            }
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m)),
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [currentUserId, user?.id]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function deleteMessage(id) {
    await supabase.from("messages").delete().eq("id", id);
  }

  async function addReaction(msgId, reaction) {
    const msg = messages.find((m) => m.id === msgId);
    const updated = [...(msg.reactions || []), reaction];
    await supabase
      .from("messages")
      .update({ reactions: updated })
      .eq("id", msgId);
    setActiveMsgId(null);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !currentUserId || !user?.id) return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUserId,
        receiver_id: user.id,
        content: newMessage.trim(),
      },
    ]);

    if (!error) setNewMessage("");
  }

  // Long press handler for mobile
  const handleTouchStart = (id) => {
    longPressTimer.current = setTimeout(() => setActiveMsgId(id), 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh] bg-gray-50 rounded-xl shadow-lg text-gray-500">
        Select a match to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white p-3 border-b flex items-center justify-between gap-3 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img
            src={
              user.avatar_url ||
              `https://api.dicebear.com/8.x/avataaars/svg?seed=${user.full_name}`
            }
            alt={user.full_name}
            className="w-10 h-10 rounded-full bg-gray-200 object-cover"
          />
          <div>
            <h3 className="font-bold text-gray-800">{user.full_name}</h3>
          </div>
        </div>
        {onStartCall && (
          <button
            onClick={onStartCall}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
            title="Start Call"
          >
            📞
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50"
      >
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;

          return (
            <div
              key={msg.id}
              className={`relative flex ${isOwn ? "justify-end" : "justify-start"}`}
              onMouseEnter={() => setActiveMsgId(msg.id)} // PC hover
              onMouseLeave={() => setActiveMsgId(null)} // PC leave
              onTouchStart={() => handleTouchStart(msg.id)} // Mobile long press
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={`relative max-w-[75%] p-3 rounded-2xl shadow-sm ${
                  isOwn
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                }`}
              >
                {msg.type === "call_request" ? (
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isOwn ? "bg-white/20" : "bg-green-100 text-green-600"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {isOwn ? "Outgoing Call" : "Incoming Call"}{" "}
                      </p>
                      <p className="text-xs opacity-90">
                        {msg.status === "pending" &&
                          (isOwn ? "Calling..." : "Wants to call you")}
                        {msg.status === "answered" && "Call answered"}
                        {msg.status === "declined" &&
                          (isOwn ? "Call declined" : "You declined the call")}
                        {msg.status === "ended" && "Call ended"}
                        {msg.status === "missed" && "Missed call"}
                      </p>

                      {/* Answer/Decline buttons for incoming call */}
                      {!isOwn && msg.status === "pending" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => onAnswerCall(msg)}
                            className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-green-600"
                          >
                            Answer
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeclineCall(msg)}
                            className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-red-600"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : msg.audio_url ? (
                  <audio
                    controls
                    src={msg.audio_url}
                    className="w-full min-w-[200px] h-8"
                  />
                ) : (
                  <p className="text-sm md:text-base break-words">
                    {msg.content}
                  </p>
                )}

                <div
                  className={`text-[10px] mt-1 ${isOwn ? "text-pink-100" : "text-gray-400"} text-right`}
                >
                  {formatTime(msg.created_at)}
                </div>

                {msg.reactions?.length > 0 && (
                  <div className="absolute -bottom-2 right-0 bg-white rounded-full px-1 shadow-sm border border-gray-100 flex text-xs text-black">
                    {msg.reactions.map((r, i) => (
                      <span key={i}>{r}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown menu */}
              {activeMsgId === msg.id && (
                <div
                  className={`absolute -top-8 ${isOwn ? "right-0" : "left-0"} flex gap-1 bg-white shadow-lg rounded-full p-1 z-20 border border-gray-100`}
                >
                  {reactions.map((r, i) => (
                    <button
                      key={i}
                      className="hover:scale-125 transition p-1"
                      onClick={() => addReaction(msg.id, r)}
                    >
                      {r}
                    </button>
                  ))}
                  {msg.content && (
                    <button
                      className="text-xs px-2 py-1 hover:bg-gray-100 rounded-full text-gray-600"
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                      title="Copy"
                    >
                      📋
                    </button>
                  )}
                  {isOwn && (
                    <button
                      className="text-xs px-2 py-1 hover:bg-red-50 rounded-full text-red-500"
                      onClick={() => deleteMessage(msg.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex items-center gap-2">
        <VoiceMessage receiverId={user.id} />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50"
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
