import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ChatBox({ user, refreshKey }) {
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) setCurrentUserId(currentUser.id);
    }
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchMessages() {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data || []);
    }

    fetchMessages();
  }, [user.id, currentUserId, refreshKey]);

  // format time as hh:mm AM/PM
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // format date as Today, Yesterday, or full date
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (
      date.toDateString() === today.toDateString()
    ) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  return (
    <div className="p-4 space-y-2 overflow-y-auto h-[70vh]">
      {messages.map((msg, index) => {
        const msgDate = new Date(msg.created_at).toDateString();
        const prevMsgDate =
          index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;

        const showDateDivider = msgDate !== prevMsgDate;

        return (
          <div key={msg.id}>
            {/* Date Divider */}
            {showDateDivider && (
              <div className="flex justify-center my-2">
                <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                  {formatDate(msg.created_at)}
                </span>
              </div>
            )}

           {/* Message Bubble */}
<div
  className={`flex ${
    msg.sender_id === currentUserId ? "justify-end" : "justify-start"
  }`}
>
  <div
    className={`inline-block p-2 rounded-lg break-words ${
      msg.audio_url ? "w-60" : "max-w-[70%]"
    } ${
      msg.sender_id === currentUserId
        ? "bg-blue-500 text-white"
        : "bg-gray-200 text-black"
    }`}
  >
    {msg.audio_url ? (
      <audio controls src={msg.audio_url} className="w-full" />
    ) : (
      <span>{msg.content}</span>
    )}

    {/* timestamp */}
    <span
      className={`block text-[10px] mt-1 text-right ${
        msg.sender_id === currentUserId
          ? "text-blue-100"
          : "text-gray-500"
      }`}
    >
      {formatTime(msg.created_at)}
    </span>
  </div>
</div>
          </div>
        );
      })}
    </div>
  );
}
