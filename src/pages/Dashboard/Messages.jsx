
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";
// import ChatBox from "../../components/ChatBox";
// import { useWebRTC } from "../../components/useWebRTC";
// import ChatHeader from "../../components/messages/ChatHeader";
// import ChatInput from "../../components/messages/ChatInput";
// import CallOverlay from "../../components/messages/CallOverlay";

// export default function Messages() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Fetch chat partner
//   useEffect(() => {
//     async function fetchUser() {
//       const { data, error } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", id)
//         .single();

//       if (error) console.error(error);
//       if (data) {
//         setUser({
//           id: data.id,
//           name: data.full_name,
//           image:
//             data.avatar_url ||
//             `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
//         });
//       }
//       setLoading(false);
//     }
//     fetchUser();
//   }, [id]);

//   // Get current user
//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user: currentUser },
//       } = await supabase.auth.getUser();
//       if (currentUser) setCurrentUserId(currentUser.id);
//     }
//     getCurrentUser();
//   }, []);

//   // Poll chat every 2s
//   useEffect(() => {
//     const interval = setInterval(
//       () => setRefreshTrigger((prev) => prev + 1),
//       2000
//     );
//     return () => clearInterval(interval);
//   }, []);

//   // WebRTC Hook
//   const { startCall, endCall, inCall, localStreamRef, remoteStreamRef } =
//     useWebRTC({
//       currentUserId,
//       otherUserId: id,
//     });

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen">Loading…</div>
//     );
//   if (!user)
//     return (
//       <div className="flex items-center justify-center h-screen text-red-500">
//         User not found
//       </div>
//     );

//   return (
//     <div className="flex flex-col h-screen">
//       <ChatHeader user={user} startCall={startCall} />

//       {/* Chat area */}
//       <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
//         <ChatBox user={user} refreshKey={refreshTrigger} />
//       </div>

//       {/* Input */}
//       <ChatInput
//         user={user}
//         currentUserId={currentUserId}
//         setRefreshTrigger={setRefreshTrigger}
//       />

//       {/* Call Overlay */}
//       <CallOverlay
//         inCall={inCall}
//         endCall={endCall}
//         localStreamRef={localStreamRef}
//         remoteStreamRef={remoteStreamRef}
//       />
//     </div>
//   );
// }








import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChatBox from "../../components/ChatBox";
import { useWebRTC } from "../../components/useWebRTC";
import ChatHeader from "../../components/messages/ChatHeader";
import ChatInput from "../../components/messages/ChatInput";
import IncomingCallPopup from "../../components/messages/IncomingCallPopup";
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
  const {
    inCall,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
  } = useWebRTC({
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
      {/* Chat header with call button */}
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

      {/* Incoming Call Popup */}
      {incomingCall && (
        <IncomingCallPopup
          call={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

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
