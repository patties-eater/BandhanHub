



// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user, refreshKey }) {
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user: currentUser },
//       } = await supabase.auth.getUser();
//       if (currentUser) setCurrentUserId(currentUser.id);
//     }
//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (!currentUserId) return;

//     async function fetchMessages() {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error("Error fetching messages:", error);
//         return;
//       }

//       setMessages(data || []);
//     }

//     fetchMessages();
//   }, [user.id, currentUserId, refreshKey]);

//   // format time as hh:mm AM/PM
//   function formatTime(timestamp) {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   }

//   // format date as Today, Yesterday, or full date
//   function formatDate(timestamp) {
//     const date = new Date(timestamp);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (
//       date.toDateString() === today.toDateString()
//     ) {
//       return "Today";
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return "Yesterday";
//     } else {
//       return date.toLocaleDateString([], {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       });
//     }
//   }

//   return (
//     <div className="p-4 space-y-2 overflow-y-auto h-[70vh]">
//       {messages.map((msg, index) => {
//         const msgDate = new Date(msg.created_at).toDateString();
//         const prevMsgDate =
//           index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;

//         const showDateDivider = msgDate !== prevMsgDate;

//         return (
//           <div key={msg.id}>
//             {/* Date Divider */}
//             {showDateDivider && (
//               <div className="flex justify-center my-2">
//                 <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
//                   {formatDate(msg.created_at)}
//                 </span>
//               </div>
//             )}

//            {/* Message Bubble */}
// <div
//   className={`flex ${
//     msg.sender_id === currentUserId ? "justify-end" : "justify-start"
//   }`}
// >
//   <div
//     className={`inline-block p-2 rounded-lg break-words ${
//       msg.audio_url ? "w-60" : "max-w-[70%]"
//     } ${
//       msg.sender_id === currentUserId
//         ? "bg-blue-500 text-white"
//         : "bg-gray-200 text-black"
//     }`}
//   >
//     {msg.audio_url ? (
//       <audio controls src={msg.audio_url} className="w-full" />
//     ) : (
//       <span>{msg.content}</span>
//     )}

//     {/* timestamp */}
//     <span
//       className={`block text-[10px] mt-1 text-right ${
//         msg.sender_id === currentUserId
//           ? "text-blue-100"
//           : "text-gray-500"
//       }`}
//     >
//       {formatTime(msg.created_at)}
//     </span>
//   </div>
// </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }









// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user, refreshKey }) {
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [editingMessageId, setEditingMessageId] = useState(null);
//   const [editContent, setEditContent] = useState("");

//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user: currentUser },
//       } = await supabase.auth.getUser();
//       if (currentUser) setCurrentUserId(currentUser.id);
//     }
//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (!currentUserId) return;

//     async function fetchMessages() {
//       // Delete messages older than 4 days
//       const cutoff = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
//       await supabase.from("messages").delete().lt("created_at", cutoff);

//       // Fetch conversation
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) {
//         console.error(error);
//         return;
//       }

//       setMessages(data || []);
//     }

//     fetchMessages();
//   }, [user.id, currentUserId, refreshKey]);

//   function formatTime(timestamp) {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   }

//   function formatDate(timestamp) {
//     const date = new Date(timestamp);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//     return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
//   }

//   // Save edited message
//   async function saveEdit() {
//     if (!editingMessageId) return;

//     await supabase.from("messages").update({ content: editContent }).eq("id", editingMessageId);
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === editingMessageId ? { ...msg, content: editContent } : msg))
//     );
//     setEditingMessageId(null);
//     setEditContent("");
//   }

//   // Cancel edit
//   function cancelEdit() {
//     setEditingMessageId(null);
//     setEditContent("");
//   }

//   return (
//     <div className="p-4 space-y-2 overflow-y-auto h-[70vh]">
//       {messages.map((msg, index) => {
//         const msgDate = new Date(msg.created_at).toDateString();
//         const prevMsgDate =
//           index > 0 ? new Date(messages[index - 1].created_at).toDateString() : null;

//         const showDateDivider = msgDate !== prevMsgDate;
//         const isOwn = msg.sender_id === currentUserId;

//         return (
//           <div key={msg.id}>
//             {showDateDivider && (
//               <div className="flex justify-center my-2">
//                 <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
//                   {formatDate(msg.created_at)}
//                 </span>
//               </div>
//             )}

//             <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
//               <div className={`inline-block p-2 rounded-lg break-words max-w-[70%] ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
//                 {editingMessageId === msg.id ? (
//                   <div className="flex gap-2">
//                     <input
//                       className="flex-1 p-1 rounded border"
//                       value={editContent}
//                       onChange={(e) => setEditContent(e.target.value)}
//                     />
//                     <button onClick={saveEdit} className="px-2 bg-green-500 text-white rounded">
//                       Save
//                     </button>
//                     <button onClick={cancelEdit} className="px-2 bg-gray-400 text-white rounded">
//                       Cancel
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <span>{msg.content}</span>
//                     {isOwn && (
//                       <button
//                         onClick={() => {
//                           setEditingMessageId(msg.id);
//                           setEditContent(msg.content);
//                         }}
//                         className="ml-2 text-xs text-blue-100 hover:underline"
//                       >
//                         Edit
//                       </button>
//                     )}
//                     <span className="block text-[10px] mt-1 text-right">{formatTime(msg.created_at)}</span>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }



// import { useEffect, useRef, useState } from "react";
// import { supabase } from "../supabaseClient";

// const reactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

// export default function ChatBox({ user, refreshKey }) {
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [reactionMenuId, setReactionMenuId] = useState(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     async function getCurrentUser() {
//       const { data: { user: currentUser } } = await supabase.auth.getUser();
//       if (currentUser) setCurrentUserId(currentUser.id);
//     }
//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (!currentUserId || !user?.id) return;

//     async function fetchMessages() {
//       const cutoff = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
//       await supabase.from("messages").delete().lt("created_at", cutoff);

//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUserId})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) return console.error(error);
//       setMessages(data || []);
//     }

//     fetchMessages();
//   }, [user.id, currentUserId, refreshKey]);

//   useEffect(() => {
//     const el = containerRef.current;
//     if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//   }, [messages]);

//   function formatTime(timestamp) {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   }

//   function formatDate(timestamp) {
//     const date = new Date(timestamp);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(today.getDate() - 1);
//     if (date.toDateString() === today.toDateString()) return "Today";
//     if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
//     return date.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
//   }

//   async function deleteMessage(id) {
//     const ok = confirm("Delete this message?");
//     if (!ok) return;
//     await supabase.from("messages").delete().eq("id", id);
//     setMessages((prev) => prev.filter((m) => m.id !== id));
//   }

//   async function addReaction(msgId, reaction) {
//     const message = messages.find((m) => m.id === msgId);
//     const currentReactions = message.reactions || [];
//     const updatedReactions = [...currentReactions, reaction];
//     await supabase.from("messages").update({ reactions: updatedReactions }).eq("id", msgId);
//     setMessages((prev) =>
//       prev.map((m) => (m.id === msgId ? { ...m, reactions: updatedReactions } : m))
//     );
//     setReactionMenuId(null);
//   }

//   return (
//     <div className="flex flex-col h-[70vh]">
//       <div ref={containerRef} className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
//         {messages.map((msg, i) => {
//           const isOwn = msg.sender_id === currentUserId;
//           const msgDate = new Date(msg.created_at).toDateString();
//           const prevDate = i > 0 ? new Date(messages[i - 1].created_at).toDateString() : null;
//           const showDivider = msgDate !== prevDate;

//           return (
//             <div key={msg.id} className="relative">
//               {showDivider && (
//                 <div className="flex justify-center my-2">
//                   <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
//                     {formatDate(msg.created_at)}
//                   </span>
//                 </div>
//               )}

//               <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
//                 <div
//                   className={`inline-block p-3 rounded-2xl break-words max-w-[70%] ${
//                     isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
//                   }`}
//                 >
//                   <span className="whitespace-pre-wrap">{msg.content}</span>

//                   {msg.reactions && msg.reactions.length > 0 && (
//                     <div className="flex gap-1 mt-1 text-sm">
//                       {msg.reactions.map((r, idx) => (
//                         <span key={idx}>{r}</span>
//                       ))}
//                     </div>
//                   )}

//                   <span className="block text-[10px] mt-1 text-right">{formatTime(msg.created_at)}</span>

//                   {isOwn && (
//                     <div className="absolute top-0 right-0">
//                       <details>
//                         <summary className="cursor-pointer select-none text-gray-400 px-1">⋮</summary>
//                         <ul className="absolute right-0 mt-1 w-32 bg-white border rounded shadow-lg text-black text-sm list-none p-1">
//                           <li
//                             className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => setReactionMenuId(msg.id)}
//                           >
//                             React
//                           </li>
//                           <li
//                             className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => deleteMessage(msg.id)}
//                           >
//                             Delete
//                           </li>
//                           <li
//                             className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//                             onClick={() => navigator.clipboard.writeText(msg.content)}
//                           >
//                             Copy
//                           </li>
//                         </ul>
//                       </details>

//                       {reactionMenuId === msg.id && (
//                         <div className="absolute -top-8 right-0 flex gap-1 bg-white p-1 rounded shadow-lg">
//                           {reactions.map((r, idx) => (
//                             <span
//                               key={idx}
//                               className="cursor-pointer"
//                               onClick={() => addReaction(msg.id, r)}
//                             >
//                               {r}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }






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
