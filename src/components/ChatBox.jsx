// import { useState } from "react";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([
//     { from: "them", text: "Hi! 👋" },
//     { from: "me", text: "Hey, how are you?" },
//   ]);
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { from: "me", text: input }]);
//     setInput("");
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex items-center gap-3 p-3 bg-pink-100">
//         <img
//           src={user.image}
//           alt={user.name}
//           className="w-10 h-10 rounded-full object-cover"
//         />
//         <h2 className="font-semibold">{user.name}</h2>
//       </div>
//       <div className="flex-1 overflow-y-auto p-3 space-y-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded-lg max-w-xs ${
//               msg.from === "me" ? "bg-pink-500 text-white ml-auto" : "bg-gray-200"
//             }`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex p-3 gap-2">
//         <input
//           className="flex-1 border rounded-lg p-2"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage} className="px-4 py-2 bg-pink-500 text-white rounded-lg">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }



// // src/components/ChatBox.jsx


// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const messageEndRef = useRef(null);

//   // Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
//   }, []);

//   // Fetch messages between currentUser and user.id
//   useEffect(() => {
//     if (!currentUser) return;

//     async function fetchMessages() {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) console.error(error);
//       else setMessages(data);
//     }

//     fetchMessages();

//     // Real-time updates
//     const subscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (
//             (msg.sender_id === currentUser.id && msg.receiver_id === user.id) ||
//             (msg.sender_id === user.id && msg.receiver_id === currentUser.id)
//           ) {
//             setMessages((prev) => [...prev, msg]);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(subscription);
//   }, [currentUser, user.id]);

//   // Auto scroll
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send message
//   async function handleSend() {
//     if (!newMessage.trim()) return;
//     await supabase.from("messages").insert([
//       {
//         sender_id: currentUser.id,
//         receiver_id: user.id,
//         content: newMessage,
//       },
//     ]);
//     setNewMessage("");
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       <div className="flex-1 overflow-y-auto mb-4">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 my-1 rounded-xl max-w-xs ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }





// src/components/ChatBox.jsx
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const messageEndRef = useRef(null);

//   // Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
//   }, []);

//   // Fetch messages and subscribe to real-time updates
//   useEffect(() => {
//     if (!currentUser) return;

//     async function fetchMessages() {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),
//            and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) console.error(error);
//       else setMessages(data);
//     }

//     fetchMessages();

//     // Real-time subscription for new messages
//     const subscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (
//             (msg.sender_id === currentUser.id && msg.receiver_id === user.id) ||
//             (msg.sender_id === user.id && msg.receiver_id === currentUser.id)
//           ) {
//             setMessages((prev) => [...prev, msg]);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(subscription);
//   }, [currentUser, user.id]);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send new message
//   async function handleSend() {
//     if (!newMessage.trim()) return;
//     await supabase.from("messages").insert([
//       {
//         sender_id: currentUser.id,
//         receiver_id: user.id,
//         content: newMessage,
//       },
//     ]);
//     setNewMessage("");
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       {/* Message List */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       {/* Input Box */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }



// src/components/ChatBox.jsx
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messageEndRef = useRef(null);

//   // 1️⃣ Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });
//   }, []);

//   // 2️⃣ Fetch messages and subscribe to real-time updates
//   useEffect(() => {
//     if (!currentUser || !user) return;

//     async function fetchMessages() {
//       try {
//         const filter = `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`;

//         const { data, error } = await supabase
//           .from("messages")
//           .select("*")
//           .or(filter)
//           .order("created_at", { ascending: true });

//         if (error) throw error;
//         setMessages(data);
//       } catch (err) {
//         console.error("Error fetching messages:", err.message);
//       }
//     }

//     fetchMessages();

//     // Real-time subscription
//     const subscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (
//             (msg.sender_id === currentUser?.id && msg.receiver_id === user?.id) ||
//             (msg.sender_id === user?.id && msg.receiver_id === currentUser?.id)
//           ) {
//             setMessages((prev) => [...prev, msg]);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(subscription);
//   }, [currentUser, user]);

//   // 3️⃣ Auto-scroll to latest message
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 4️⃣ Send new message
//   async function handleSend() {
//     if (!newMessage.trim() || !currentUser || !user) return;
//     try {
//       await supabase.from("messages").insert([
//         {
//           sender_id: currentUser.id,
//           receiver_id: user.id,
//           content: newMessage,
//         },
//       ]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err.message);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         Loading chat…
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       {/* Message List */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       {/* Input Box */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }



// src/components/ChatBox.jsx
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messageEndRef = useRef(null);

//   // Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });
//   }, []);

//   // Fetch messages & subscribe to real-time
//   useEffect(() => {
//     if (!currentUser || !user) return;

//     const fetchMessages = async () => {
//       try {
//         const filter = `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`;
//         const { data, error } = await supabase
//           .from("messages")
//           .select("*")
//           .or(filter)
//           .order("created_at", { ascending: true });

//         if (error) throw error;
//         setMessages(data);
//       } catch (err) {
//         console.error("Error fetching messages:", err.message);
//       }
//     };

//     fetchMessages();

//     const subscription = supabase
//       .channel("public:messages")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "messages" },
//         (payload) => {
//           const msg = payload.new;
//           if (
//             (msg.sender_id === currentUser?.id && msg.receiver_id === user?.id) ||
//             (msg.sender_id === user?.id && msg.receiver_id === currentUser?.id)
//           ) {
//             setMessages((prev) => [...prev, msg]);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(subscription);
//   }, [currentUser, user]);

//   // Auto-scroll
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send message
//   const handleSend = async () => {
//     if (!newMessage.trim() || !currentUser || !user) return;
//     try {
//       await supabase.from("messages").insert([
//         { sender_id: currentUser.id, receiver_id: user.id, content: newMessage },
//       ]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err.message);
//     }
//   };

//   if (loading) return <div className="flex items-center justify-center h-full">Loading chat…</div>;

//   return (
//     <div className="flex flex-col h-full p-4">
//       {/* Message List */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       {/* Input */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messageEndRef = useRef(null);

//   // Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       setCurrentUser(user);
//       setLoading(false);
//     });
//   }, []);

//   // Fetch messages and subscribe to real-time
//   useEffect(() => {
//     if (!currentUser || !user) return;

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) console.error(error);
//       else setMessages(data);
//     };

//     fetchMessages();

//     // Real-time subscription
//     const subscription = supabase
//       .channel("messages-channel") // unique channel name
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//         },
//         (payload) => {
//           const msg = payload.new;
//           // Only add message if it's between currentUser and chat partner
//           if (
//             (msg.sender_id === currentUser?.id && msg.receiver_id === user?.id) ||
//             (msg.sender_id === user?.id && msg.receiver_id === currentUser?.id)
//           ) {
//             setMessages((prev) => [...prev, msg]);
//           }
//         }
//       )
//       .subscribe();

//     // Cleanup
//     return () => supabase.removeChannel(subscription);
//   }, [currentUser, user]);

//   // Auto-scroll
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       await supabase.from("messages").insert([
//         { sender_id: currentUser.id, receiver_id: user.id, content: newMessage },
//       ]);
//       setNewMessage(""); // clear input
//       // The new message will appear via the real-time listener
//     } catch (err) {
//       console.error("Error sending message:", err.message);
//     }
//   };

//   if (loading) return <div className="flex items-center justify-center h-full">Loading chat…</div>;

//   return (
//     <div className="flex flex-col h-full p-4">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }





// src/components/ChatBox.jsx
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messageEndRef = useRef(null);

//   // Get current user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) setCurrentUser(user);
//       setLoading(false);
//     });
//   }, []);

//   // Fetch messages + subscribe real-time
//   useEffect(() => {
//     if (!currentUser || !user) return;

//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from("messages")
//         .select("*")
//         .or(
//           `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
//         )
//         .order("created_at", { ascending: true });

//       if (error) console.error("Error fetching messages:", error);
//       else setMessages(data || []);
//     };

//     fetchMessages();

//     // Real-time subscription
//     const subscription = supabase
//       .from("messages")
//       .on("INSERT", (payload) => {
//         const msg = payload.new;
//         if (
//           (msg.sender_id === currentUser.id && msg.receiver_id === user.id) ||
//           (msg.sender_id === user.id && msg.receiver_id === currentUser.id)
//         ) {
//           setMessages((prev) => [...prev, msg]);
//         }
//       })
//       .subscribe();

//     // Cleanup
//     return () => supabase.removeSubscription(subscription);
//   }, [currentUser, user]);

//   // Auto-scroll
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMessage.trim() || !currentUser || !user) return;

//     try {
//       await supabase.from("messages").insert([
//         {
//           sender_id: currentUser.id,
//           receiver_id: user.id,
//           content: newMessage,
//         },
//       ]);
//       setNewMessage(""); // clear input
//       // New message appears via real-time listener
//     } catch (err) {
//       console.error("Error sending message:", err.message);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-full">
//         Loading chat…
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full p-4">
//       {/* Message list */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       {/* Input */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }









// // src/components/ChatBox.jsx
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const messageEndRef = useRef(null);

//   // 1️⃣ Get current logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => {
//       if (user) setCurrentUser(user);
//       setLoading(false);
//     }).catch((err) => {
//       console.error("Failed to get current user:", err);
//       setLoading(false);
//     });
//   }, []);

//   // 2️⃣ Fetch messages + subscribe to real-time updates
//   useEffect(() => {
//     if (!currentUser || !user?.id) return;

//     let isMounted = true; // prevent state updates if component unmounts

//     const fetchMessages = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("messages")
//           .select("*")
//           .or(
//             `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
//           )
//           .order("created_at", { ascending: true });

//         if (error) throw error;
//         if (isMounted) setMessages(data || []);
//       } catch (err) {
//         console.error("Error fetching messages:", err.message);
//       }
//     };

//     fetchMessages();

//     const subscription = supabase
//       .from("messages")
//       .on("INSERT", (payload) => {
//         const msg = payload.new;
//         if (
//           msg?.sender_id && msg?.receiver_id &&
//           ((msg.sender_id === currentUser.id && msg.receiver_id === user.id) ||
//             (msg.sender_id === user.id && msg.receiver_id === currentUser.id))
//         ) {
//           setMessages((prev) => [...prev, msg]);
//         }
//       })
//       .subscribe();

//     return () => {
//       isMounted = false;
//       supabase.removeSubscription(subscription);
//     };
//   }, [currentUser, user]);

//   // 3️⃣ Auto-scroll to newest message
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 4️⃣ Send message
//   const handleSend = async () => {
//     if (!newMessage.trim() || !currentUser?.id || !user?.id) return;

//     try {
//       await supabase.from("messages").insert([
//         { sender_id: currentUser.id, receiver_id: user.id, content: newMessage },
//       ]);
//       setNewMessage(""); // clear input
//       // Real-time subscription handles displaying the message
//     } catch (err) {
//       console.error("Error sending message:", err.message);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-full">
//         Loading chat…
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-full p-4">
//       {/* Messages list */}
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`p-2 rounded-xl max-w-xs break-words ${
//               msg.sender_id === currentUser?.id
//                 ? "bg-blue-500 text-white ml-auto"
//                 : "bg-gray-200 text-gray-800 mr-auto"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         <div ref={messageEndRef}></div>
//       </div>

//       {/* Input */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type a message..."
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




// src/components/ChatBox.jsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  // 1️⃣ Get logged-in user
  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        if (user) setCurrentUser(user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get current user:", err);
        setLoading(false);
      });
  }, []);

  // 2️⃣ Fetch messages + subscribe to real-time
  useEffect(() => {
    if (!currentUser || !user?.id) return;

    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${currentUser.id})`
          )
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (isMounted) setMessages(data || []);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    };

    fetchMessages();

    // Real-time subscription using the new API
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new;
          if (
            msg?.sender_id &&
            msg?.receiver_id &&
            ((msg.sender_id === currentUser.id && msg.receiver_id === user.id) ||
              (msg.sender_id === user.id && msg.receiver_id === currentUser.id))
          ) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [currentUser, user]);

  // 3️⃣ Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4️⃣ Send message
  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser?.id || !user?.id) return;

    try {
      await supabase.from("messages").insert([
        { sender_id: currentUser.id, receiver_id: user.id, content: newMessage },
      ]);
      setNewMessage(""); // clear input
      // new message will appear automatically via subscription
    } catch (err) {
      console.error("Error sending message:", err.message);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading chat…</div>;

  return (
    <div className="flex flex-col h-full p-4">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-xl max-w-xs break-words ${
              msg.sender_id === currentUser?.id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
