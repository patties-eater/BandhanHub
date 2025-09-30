// import { useState, useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { supabase } from "../../supabaseClient";

// import ChatBox from "../../components/ChatBox";
// import ChatHeader from "../../components/messages/ChatHeader";
// import ChatInput from "../../components/messages/ChatInput";
// import IncomingCallPopup from "../../components/messages/IncomingCallPopup";
// import OutgoingCallOverlay from "../../components/messages/OutgoingCallOverlay";
// import CallOverlay from "../../components/messages/CallOverlay";

// export default function Messages() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Call states
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [outgoingCall, setOutgoingCall] = useState(false);
//   const [inCall, setInCall] = useState(false);

//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);

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

//   // --- Call functions ---
//   const startCall = () => {
//     console.log("Calling:", user?.name);
//     setOutgoingCall(true);
//   };

//   const cancelOutgoingCall = () => {
//     console.log("Cancelled call");
//     setOutgoingCall(false);
//   };

//   const acceptCall = (call) => {
//     console.log("Accepted call:", call);
//     setIncomingCall(null);
//     setInCall(true);
//   };

//   const rejectCall = (call) => {
//     console.log("Rejected call:", call);
//     setIncomingCall(null);
//   };

//   const endCall = () => {
//     console.log("Ending call");
//     setInCall(false);
//     setOutgoingCall(false);
//   };

//   // --- Render ---
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

//       <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
//         <ChatBox user={user} refreshKey={refreshTrigger} />
//       </div>

//       <ChatInput
//         user={user}
//         currentUserId={currentUserId}
//         setRefreshTrigger={setRefreshTrigger}
//       />

//       {/* Incoming Call */}
//       {incomingCall && (
//         <IncomingCallPopup
//           call={incomingCall}
//           onAccept={acceptCall}
//           onReject={rejectCall}
//         />
//       )}

//       {/* Outgoing Call */}
//       {outgoingCall && !inCall && (
//         <OutgoingCallOverlay user={user} onCancel={cancelOutgoingCall} />
//       )}

//       {/* Active Call */}
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
import ChatHeader from "../../components/messages/ChatHeader";
import ChatInput from "../../components/messages/ChatInput";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    getCurrentUser();
  }, []);

  // Poll chat every 2s
  useEffect(() => {
    const interval = setInterval(() => setRefreshTrigger(prev => prev + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // --- Start call ---
  const startCall = async () => {
    if (!user) return;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    // Insert call request message in Supabase
    const { error } = await supabase.from("messages").insert([{
      sender_id: currentUser.id,
      receiver_id: user.id,
      content: `📞 ${currentUser.email || "Someone"} is trying to call you…`,
      type: "call_request",
      status: "pending",
      created_at: new Date().toISOString(),
    }]);
    if (error) console.error("Call insert failed:", error);
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen">Loading…</div>;
  if (!user)
    return <div className="flex items-center justify-center h-screen text-red-500">User not found</div>;

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader user={user} startCall={startCall} />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
        <ChatBox user={user} refreshKey={refreshTrigger} />
      </div>

      <ChatInput user={user} currentUserId={currentUserId} setRefreshTrigger={setRefreshTrigger} />
    </div>
  );
}
