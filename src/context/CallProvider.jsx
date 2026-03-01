// import { createContext, useContext, useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// const CallContext = createContext();

// export const useCall = () => useContext(CallContext);

// export const CallProvider = ({ children }) => {
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) setCurrentUserId(user.id);
//     }
//     getCurrentUser();
//   }, []);

//   useEffect(() => {
//     if (!currentUserId) return;

//     const channel = supabase
//       .channel("incoming-calls-global")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const newMessage = payload.new;
//           if (newMessage.type === "call_request") {
//             setIncomingCall(newMessage);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   return (
//     <CallContext.Provider value={{ incomingCall, setIncomingCall }}>
//       {children}
//     </CallContext.Provider>
//   );
// };












// // src/context/CallProvider.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// const CallContext = createContext();

// export const useCall = () => useContext(CallContext);

// export const CallProvider = ({ children }) => {
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [outgoingCall, setOutgoingCall] = useState(null); // store outgoing call message
//   const [inCall, setInCall] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Get current user
//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) setCurrentUserId(user.id);
//     }
//     getCurrentUser();
//   }, []);

//   // Listen for incoming call requests
//   useEffect(() => {
//     if (!currentUserId) return;

//     const channel = supabase
//       .channel("calls")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (msg.type === "call_request") {
//             setIncomingCall(msg);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "messages",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (msg.type === "call_request" && msg.status === "accepted") {
//             setInCall(true);
//             setIncomingCall(null);
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   return (
//     <CallContext.Provider
//       value={{
//         incomingCall,
//         setIncomingCall,
//         outgoingCall,
//         setOutgoingCall,
//         inCall,
//         setInCall,
//         currentUserId,
//       }}
//     >
//       {children}
//     </CallContext.Provider>
//   );
// };












// // src/context/CallProvider.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// const CallContext = createContext();

// export const useCall = () => useContext(CallContext);

// export const CallProvider = ({ children }) => {
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [outgoingCall, setOutgoingCall] = useState(null);
//   const [inCall, setInCall] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   // Get current user
//   useEffect(() => {
//     async function getCurrentUser() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (user) setCurrentUserId(user.id);
//     }
//     getCurrentUser();
//   }, []);

//   // Realtime listener for calls
//   useEffect(() => {
//     if (!currentUserId) return;

//     const channel = supabase
//       .channel("calls-global")
//       // Incoming call requests
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "messages",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (msg.type === "call_request") {
//             setIncomingCall(msg);
//           }
//         }
//       )
//       // Call status updates
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "messages",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (msg.type === "call_request") {
//             if (msg.status === "accepted") {
//               setInCall(true);
//               setIncomingCall(null);
//             } else if (msg.status === "rejected") {
//               setIncomingCall(null);
//             }
//           }
//         }
//       )
//       // Also listen for outgoing call status updates
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "messages",
//           filter: `sender_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const msg = payload.new;
//           if (msg.type === "call_request") {
//             if (msg.status === "accepted") {
//               setInCall(true);
//             } else if (msg.status === "rejected" || msg.status === "cancelled") {
//               setOutgoingCall(null);
//             }
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   return (
//     <CallContext.Provider
//       value={{
//         incomingCall,
//         setIncomingCall,
//         outgoingCall,
//         setOutgoingCall,
//         inCall,
//         setInCall,
//         currentUserId,
//       }}
//     >
//       {children}
//     </CallContext.Provider>
//   );
// };









import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    let channel;
    let isMounted = true;

    async function subscribeToCalls() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) return;

      channel = supabase
        .channel(`calls-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new.type === "call_request") {
              setIncomingCall(payload.new);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new.type !== "call_request") return;

            if (payload.new.status === "answered") {
              setActiveCall(payload.new);
              setIncomingCall(null);
            }

            if (["declined", "ended", "missed"].includes(payload.new.status)) {
              setIncomingCall(null);
              setActiveCall(null);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.new.type !== "call_request") return;

            if (payload.new.status === "answered") {
              setActiveCall(payload.new);
            }

            if (["declined", "ended", "missed"].includes(payload.new.status)) {
              setActiveCall(null);
            }
          },
        )
        .subscribe();
    }

    subscribeToCalls();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <CallContext.Provider
      value={{ incomingCall, setIncomingCall, activeCall, setActiveCall }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
