
// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../supabaseClient";

// export function useWebRTC({ currentUserId, otherUserId }) {
//   const [inCall, setInCall] = useState(false);
//   const [incomingCall, setIncomingCall] = useState(null);

//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const currentCallRef = useRef(null);

//   // Create peer connection
//   const createPeerConnection = () => {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.onicecandidate = async (event) => {
//       if (event.candidate && currentCallRef.current) {
//         await supabase.from("call_candidates").insert([
//           {
//             call_id: currentCallRef.current.id,
//             sender_id: currentUserId,
//             candidate: event.candidate.toJSON(),
//           },
//         ]);
//       }
//     };

//     pc.ontrack = (event) => {
//       if (remoteStreamRef.current) {
//         remoteStreamRef.current.srcObject = event.streams[0];
//       }
//     };

//     peerConnectionRef.current = pc;
//     return pc;
//   };

//   // Start a call
//   const startCall = async (isVideo) => {
//     const pc = createPeerConnection();
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: isVideo,
//     });
//     localStreamRef.current.srcObject = stream;
//     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     const { data, error } = await supabase.from("call_requests").insert([
//       {
//         caller_id: currentUserId,
//         receiver_id: otherUserId,
//         type: isVideo ? "video" : "audio",
//         offer,
//       },
//     ]).select().single();

//     if (error) console.error(error);
//     currentCallRef.current = data;
//     setInCall(true);
//   };

//   // End call
//   const endCall = async () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//       peerConnectionRef.current = null;
//     }
//     if (localStreamRef.current?.srcObject) {
//       localStreamRef.current.srcObject.getTracks().forEach((t) => t.stop());
//       localStreamRef.current.srcObject = null;
//     }
//     remoteStreamRef.current.srcObject = null;
//     setInCall(false);

//     if (currentCallRef.current) {
//       await supabase.from("call_requests")
//         .update({ status: "ended" })
//         .eq("id", currentCallRef.current.id);
//     }
//   };

//   // Accept call
//   const acceptCall = async (call) => {
//     const pc = createPeerConnection();
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: call.type === "video",
//     });
//     localStreamRef.current.srcObject = stream;
//     stream.getTracks().forEach((track) => pc.addTrack(track, stream));

//     await pc.setRemoteDescription(new RTCSessionDescription(call.offer));

//     const answer = await pc.createAnswer();
//     await pc.setLocalDescription(answer);

//     await supabase.from("call_requests")
//       .update({ status: "accepted", answer })
//       .eq("id", call.id);

//     currentCallRef.current = call;
//     setInCall(true);
//     setIncomingCall(null);
//   };

//   // Reject call
//   const rejectCall = async (call) => {
//     await supabase.from("call_requests")
//       .update({ status: "rejected" })
//       .eq("id", call.id);
//     setIncomingCall(null);
//   };

//   // Listen for incoming calls
//   useEffect(() => {
//     if (!currentUserId) return;
//     const channel = supabase
//       .channel("incoming-calls")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "call_requests",
//           filter: `receiver_id=eq.${currentUserId}`,
//         },
//         (payload) => {
//           if (payload.new.status === "pending") {
//             setIncomingCall(payload.new);
//           }
//         }
//       )
//       .subscribe();
//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Listen for answers (caller side)
//   useEffect(() => {
//     if (!currentUserId) return;
//     const channel = supabase
//       .channel("call-answers")
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "call_requests",
//           filter: `caller_id=eq.${currentUserId}`,
//         },
//         async (payload) => {
//           const call = payload.new;
//           if (call.status === "accepted" && call.answer) {
//             await peerConnectionRef.current.setRemoteDescription(
//               new RTCSessionDescription(call.answer)
//             );
//             currentCallRef.current = call;
//             setInCall(true);
//           } else if (call.status === "rejected") {
//             alert("❌ Call rejected");
//             setInCall(false);
//           } else if (call.status === "ended") {
//             alert("📴 Call ended");
//             endCall();
//           }
//         }
//       )
//       .subscribe();
//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Listen for ICE candidates
//   useEffect(() => {
//     if (!currentCallRef.current) return;
//     const channel = supabase
//       .channel("call-candidates")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "call_candidates",
//           filter: `call_id=eq.${currentCallRef.current.id}`,
//         },
//         async (payload) => {
//           const candidate = new RTCIceCandidate(payload.new.candidate);
//           try {
//             await peerConnectionRef.current.addIceCandidate(candidate);
//           } catch (e) {
//             console.error("Error adding ICE", e);
//           }
//         }
//       )
//       .subscribe();
//     return () => supabase.removeChannel(channel);
//   }, [currentCallRef.current]);

//   return {
//     inCall,
//     incomingCall,
//     startCall,
//     acceptCall,
//     rejectCall,
//     endCall,
//     localStreamRef,
//     remoteStreamRef,
//   };
// }











import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

export function useWebRTC({ currentUserId }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const otherUserIdRef = useRef(null);

  useEffect(() => {
    // Realtime subscription
    const channel = supabase
      .channel("webrtc-signaling")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "calls",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const { type, payload: data, caller_id } = payload.new;

          if (type === "offer") {
            otherUserIdRef.current = caller_id;
            setIncomingCall({ from: caller_id, offer: data });
          }

          if (type === "answer") {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(data)
            );
          }

          if (type === "ice") {
            try {
              await peerConnectionRef.current.addIceCandidate(data);
            } catch (err) {
              console.error("Error adding ICE:", err);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  async function createPeerConnection() {
    peerConnectionRef.current = new RTCPeerConnection();

    peerConnectionRef.current.ontrack = (event) => {
      remoteStreamRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current.onicecandidate = async (event) => {
      if (event.candidate) {
        await supabase.from("calls").insert({
          caller_id: currentUserId,
          receiver_id: otherUserIdRef.current,
          type: "ice",
          payload: event.candidate.toJSON(),
        });
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current.srcObject = stream;
    stream.getTracks().forEach((track) =>
      peerConnectionRef.current.addTrack(track, stream)
    );
  }

  async function startCall(receiverId) {
    otherUserIdRef.current = receiverId;
    await createPeerConnection();

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    await supabase.from("calls").insert({
      caller_id: currentUserId,
      receiver_id: receiverId,
      type: "offer",
      payload: offer,
    });

    setInCall(true);
  }

  async function acceptCall(offer) {
    await createPeerConnection();

    await peerConnectionRef.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    await supabase.from("calls").insert({
      caller_id: currentUserId,
      receiver_id: otherUserIdRef.current,
      type: "answer",
      payload: answer,
    });

    setIncomingCall(null);
    setInCall(true);
  }

  function rejectCall() {
    setIncomingCall(null);
  }

  function endCall() {
    setInCall(false);
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  }

  return {
    incomingCall,
    acceptCall,
    rejectCall,
    inCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
    startCall,
  };
}
