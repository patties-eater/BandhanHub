



// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";
// import { useWebRTC } from "../../components/CallManager";

// export default function Messages() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [message, setMessage] = useState("");
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Voice recording
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const chunksRef = useRef([]);

//   // Fetch chat partner
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
//       if (error) console.error(error);
//       setUser({
//         id: data.id,
//         name: data.full_name,
//         image: data.avatar_url || `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//       });
//       setLoading(false);
//     }
//     fetchUser();
//   }, [id]);

//   // Get current user
//   useEffect(() => {
//     async function getCurrentUser() {
//       const { data: { user: currentUser } } = await supabase.auth.getUser();
//       if (currentUser) setCurrentUserId(currentUser.id);
//     }
//     getCurrentUser();
//   }, []);

//   // Poll chat every 2s
//   useEffect(() => {
//     const interval = setInterval(() => setRefreshTrigger(prev => prev + 1), 2000);
//     return () => clearInterval(interval);
//   }, []);

//   // WebRTC Hook
//   const { startCall, endCall, inCall, localStreamRef, remoteStreamRef } = useWebRTC({
//     currentUserId,
//     otherUserId: id,
//   });

//   // Text message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!currentUserId || !message.trim()) return;

//     const { error } = await supabase.from("messages").insert([
//       { sender_id: currentUserId, receiver_id: user.id, content: message },
//     ]);
//     if (error) console.error(error);
//     setMessage("");
//     setRefreshTrigger(prev => prev + 1);
//   };

//   // Voice recording
//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     chunksRef.current = [];

//     mediaRecorderRef.current.ondataavailable = (e) => {
//       if (e.data.size > 0) chunksRef.current.push(e.data);
//     };

//     mediaRecorderRef.current.onstop = async () => {
//       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//       const { data: { user: currentUser } } = await supabase.auth.getUser();
//       if (!currentUser) return;

//       const fileName = `messages/${currentUser.id}/${Date.now()}.webm`;
//       await supabase.storage.from("voice-messages").upload(fileName, blob);
//       const { data: urlData } = supabase.storage.from("voice-messages").getPublicUrl(fileName);
//       await supabase.from("messages").insert([
//         { sender_id: currentUser.id, receiver_id: user.id, audio_url: urlData.publicUrl },
//       ]);
//       setRefreshTrigger(prev => prev + 1);
//     };

//     mediaRecorderRef.current.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current.stop();
//     setRecording(false);
//   };

//   if (loading) return <div className="flex items-center justify-center h-screen">Loading…</div>;
//   if (!user) return <div className="flex items-center justify-center h-screen text-red-500">User not found</div>;

//   return (
//     <div className="flex flex-col h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm flex-shrink-0">
//         <div className="flex items-center">
//           <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full mr-3 object-cover" />
//           <h2 className="text-lg font-semibold truncate">{user.name}</h2>
//         </div>

//         {/* Call buttons */}
//         <div className="flex gap-3">
//           <button onClick={() => startCall(false)} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full">📞</button>
//           <button onClick={() => startCall(true)} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full">🎥</button>
//         </div>
//       </div>

//       {/* Chat area */}
//       <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
//         <ChatBox user={user} refreshKey={refreshTrigger} />
//       </div>

//       {/* Input + buttons */}
//       <div className="sticky bottom-0 w-full bg-white border-t p-2 flex items-center gap-2">
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
//           onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
//         />

//         {message.trim() ? (
//           <button onClick={sendMessage} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex-shrink-0">➤</button>
//         ) : (
//           <>
//             {recording ? (
//               <button onClick={stopRecording} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 flex-shrink-0">⏹️</button>
//             ) : (
//               <button onClick={startRecording} className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 flex-shrink-0">🎙️</button>
//             )}
//           </>
//         )}
//       </div>

//       {/* WebRTC overlay */}
//       {inCall && remoteStreamRef.current && (
//         <div className="absolute top-0 left-0 w-full h-full z-50 bg-black flex justify-center items-center">
//           <video ref={(el) => el && (el.srcObject = localStreamRef.current)} autoPlay muted className="w-32 h-32 rounded-lg absolute top-4 right-4" />
//           <video ref={(el) => el && (el.srcObject = remoteStreamRef.current)} autoPlay className="w-full h-full" />
//           <button onClick={endCall} className="absolute top-4 left-4 p-3 bg-red-600 text-white rounded-full">❌ End</button>
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChatBox from "../../components/ChatBox";
import { useWebRTC } from "../../components/CallManager";
import ChatHeader from "../../components/messages/ChatHeader";
import ChatInput from "../../components/messages/ChatInput";
import CallOverlay from "../../components/messages/CallOverlay";

export default function Messages() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch chat partner
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      if (data) {
        setUser({
          id: data.id,
          name: data.full_name,
          image:
            data.avatar_url ||
            `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  // Get current user
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (currentUser) setCurrentUserId(currentUser.id);
    }
    getCurrentUser();
  }, []);

  // Poll chat every 2s
  useEffect(() => {
    const interval = setInterval(
      () => setRefreshTrigger((prev) => prev + 1),
      2000
    );
    return () => clearInterval(interval);
  }, []);

  // WebRTC Hook
  const { startCall, endCall, inCall, localStreamRef, remoteStreamRef } =
    useWebRTC({
      currentUserId,
      otherUserId: id,
    });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        User not found
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader user={user} startCall={startCall} />

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
        <ChatBox user={user} refreshKey={refreshTrigger} />
      </div>

      {/* Input */}
      <ChatInput
        user={user}
        currentUserId={currentUserId}
        setRefreshTrigger={setRefreshTrigger}
      />

      {/* Call Overlay */}
      <CallOverlay
        inCall={inCall}
        endCall={endCall}
        localStreamRef={localStreamRef}
        remoteStreamRef={remoteStreamRef}
      />
    </div>
  );
}
