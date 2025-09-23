// import Navbar from "../../components/Navbar";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const user = { name: "Anisha", image: "https://i.pravatar.cc/100?img=5" };

//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />
//       <div className="flex-1">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }



// import { useParams } from "react-router-dom";

// export default function Messages() {
//   const { id } = useParams();
//   return <div className="p-6">Chat with user {id}</div>;
// }




// src/pages/Messages.jsx





// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//     }

//     fetchUser();
//   }, [id]);

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );

//   return (
//     <div className="h-[90%] w-[100%] flex flex-col">
      
//       <div className="flex-1">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabaseClient";

// export default function ChatBox({ user }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [currentUser, setCurrentUser] = useState(null);
//   const messageEndRef = useRef(null);

//   // 1️⃣ Get logged-in user
//   useEffect(() => {
//     supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
//   }, []);

//   // 2️⃣ Fetch messages and subscribe to real-time updates
//   useEffect(() => {
//     if (!currentUser) return;

//     async function fetchMessages() {
//       try {
//         // Properly formatted OR filter string
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

//   // 3️⃣ Auto-scroll to latest message
//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 4️⃣ Send new message
//   async function handleSend() {
//     if (!newMessage.trim()) return;
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









// src/pages/Dashboard/Messages.jsx
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams(); // chat partner user ID
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch chat partner profile
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         setLoading(false);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }

//     fetchUser();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         User not found
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b bg-white shadow-sm">
//         <img
//           src={user.image}
//           alt={user.name}
//           className="w-12 h-12 rounded-full mr-3 object-cover"
//         />
//         <h2 className="text-lg font-semibold">{user.name}</h2>
//       </div>

//       {/* Chat Box */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }





// // src/pages/Dashboard/Messages.jsx
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams(); // chat partner user ID
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch chat partner
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         setLoading(false);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }

//     fetchUser();
//   }, [id]);

//   if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
//   if (!user) return <div className="flex items-center justify-center h-screen text-red-500">User not found</div>;

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b bg-white shadow-sm">
//         <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full mr-3 object-cover" />
//         <h2 className="text-lg font-semibold">{user.name}</h2>
//       </div>

//       {/* Chat Box */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }





// // src/pages/Dashboard/Messages.jsx
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams(); // Chat partner's user ID
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch chat partner profile
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         setLoading(false);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }

//     fetchUser();
//   }, [id]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         User not found
//       </div>
//     );

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b bg-white shadow-sm">
//         <img
//           src={user.image}
//           alt={user.name}
//           className="w-12 h-12 rounded-full mr-3 object-cover"
//         />
//         <h2 className="text-lg font-semibold">{user.name}</h2>
//       </div>

//       {/* Chat Box */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }





// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams(); // Chat partner's user ID
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0); // 👈 will trigger ChatBox re-render

//   // Fetch chat partner profile once
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         setLoading(false);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }

//     fetchUser();
//   }, [id]);

//   // Refresh chat every 2 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRefreshTrigger((prev) => prev + 1);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, []);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         User not found
//       </div>
//     );

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b bg-white shadow-sm">
//         <img
//           src={user.image}
//           alt={user.name}
//           className="w-12 h-12 rounded-full mr-3 object-cover"
//         />
//         <h2 className="text-lg font-semibold">{user.name}</h2>
//       </div>

//       {/* Chat Box */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         {/* 👇 pass refreshTrigger so ChatBox refetches */}
//         <ChatBox user={user} refreshKey={refreshTrigger} />
//       </div>
//     </div>
//   );
// }









// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const { id } = useParams(); // Chat partner's user ID
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const [message, setMessage] = useState(""); // 👈 message input

//   // Fetch chat partner profile
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) {
//         console.error("Error fetching user:", error);
//         setLoading(false);
//         return;
//       }

//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image:
//           data.avatar_url ||
//           `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }

//     fetchUser();
//   }, [id]);

//   // Poll chat every 2s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRefreshTrigger((prev) => prev + 1);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // Handle send
//   async function sendMessage(e) {
//     e.preventDefault();

//     const {
//       data: { user: currentUser },
//     } = await supabase.auth.getUser();

//     if (!currentUser) return;

//     if (message.trim() === "") return;

//     const { error } = await supabase.from("messages").insert([
//       {
//         sender_id: currentUser.id,
//         receiver_id: user.id,
//         content: message,
//       },
//     ]);

//     if (error) {
//       console.error("Error sending message:", error);
//       return;
//     }

//     setMessage(""); // clear input
//     setRefreshTrigger((prev) => prev + 1); // refresh chat immediately
//   }

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">
//         Loading…
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         User not found
//       </div>
//     );

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b bg-white shadow-sm">
//         <img
//           src={user.image}
//           alt={user.name}
//           className="w-12 h-12 rounded-full mr-3 object-cover"
//         />
//         <h2 className="text-lg font-semibold">{user.name}</h2>
//       </div>

//       {/* Chat Box */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         <ChatBox user={user} refreshKey={refreshTrigger} />
//       </div>

//       {/* Input Area */}
//       <form
//         onSubmit={sendMessage}
//         className="p-4 border-t bg-white flex items-center gap-3"
//       >
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }




import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChatBox from "../../components/ChatBox";

export default function Messages() {
  const { id } = useParams(); // Chat partner's user ID
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState(""); // text input

  // Voice recording
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Fetch chat partner profile
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      setUser({
        id: data.id,
        name: data.full_name,
        image:
          data.avatar_url ||
          `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
      });
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  // Poll chat every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Send text message
  async function sendMessage(e) {
    e.preventDefault();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) return;
    if (message.trim() === "") return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: user.id,
        content: message,
      },
    ]);

    if (error) console.error(error);
    setMessage("");
    setRefreshTrigger((prev) => prev + 1);
  }

  // Start voice recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const fileName = `messages/${currentUser.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from("voice-messages")
        .upload(fileName, blob);

      if (uploadError) return console.error(uploadError);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Insert voice message into DB
      const { error: dbError } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: user.id,
          content: null,
          audio_url: publicUrl,
        },
      ]);

      if (dbError) console.error(dbError);
      setRefreshTrigger((prev) => prev + 1);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        User not found
      </div>
    );

  return (
  <div className="flex flex-col h-screen">
  {/* Header */}
  <div className="flex items-center p-4 border-b bg-white shadow-sm flex-shrink-0">
    <img
      src={user.image}
      alt={user.name}
      className="w-12 h-12 rounded-full mr-3 object-cover"
    />
    <h2 className="text-lg font-semibold truncate">{user.name}</h2>
  </div>

  {/* Chat area */}
  <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
    <ChatBox user={user} refreshKey={refreshTrigger} />
  </div>

  {/* Input + buttons */}
  <form
    onSubmit={sendMessage}
    className="flex-shrink-0 p-4 border-t bg-white flex items-center gap-3"
  >
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Send
    </button>
    {recording ? (
      <button
        type="button"
        onClick={stopRecording}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Stop 🎙️
      </button>
    ) : (
      <button
        type="button"
        onClick={startRecording}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Record 🎙️
      </button>
    )}
  </form>
</div>


  );
}






