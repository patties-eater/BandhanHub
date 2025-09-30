// import { useRef, useEffect } from "react";
// import { supabase } from "../supabaseClient";
// import { v4 as uuidv4 } from "uuid";

// export function useWebRTC({ currentUserId, otherUserId }) {
//   const pcRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const callIdRef = useRef(null);

//   useEffect(() => {
//     pcRef.current = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pcRef.current.ontrack = (event) => {
//       remoteStreamRef.current.srcObject = event.streams[0];
//     };
//   }, []);

//   async function startCall(video = false) {
//     callIdRef.current = uuidv4();

//     localStreamRef.current = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video,
//     });

//     localStreamRef.current.getTracks().forEach((track) => {
//       pcRef.current.addTrack(track, localStreamRef.current);
//     });

//     const offer = await pcRef.current.createOffer();
//     await pcRef.current.setLocalDescription(offer);

//     // Send offer to other user via Supabase Realtime
//     await supabase
//       .from(`calls:${otherUserId}`)
//       .insert([{ call_id: callIdRef.current, sender: currentUserId, sdp: offer }]);
//   }

//   async function answerCall(offer, video = false) {
//     callIdRef.current = offer.call_id;

//     localStreamRef.current = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video,
//     });

//     localStreamRef.current.getTracks().forEach((track) => {
//       pcRef.current.addTrack(track, localStreamRef.current);
//     });

//     await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer.sdp));
//     const answer = await pcRef.current.createAnswer();
//     await pcRef.current.setLocalDescription(answer);

//     // Send answer back to caller
//     await supabase
//       .from(`calls:${offer.sender}`)
//       .insert([{ call_id: callIdRef.current, sender: currentUserId, sdp: answer }]);
//   }

//   return { startCall, answerCall, localStreamRef, remoteStreamRef, pcRef };
// }




















// import { useRef, useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";

// export function useWebRTC({ currentUserId, otherUserId }) {
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const peerRef = useRef(null);
//   const [inCall, setInCall] = useState(false);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [callId, setCallId] = useState(null);

//   // Start a new call
//   const startCall = async (withVideo = true) => {
//     if (!currentUserId || !otherUserId) return;

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: withVideo,
//       audio: true,
//     });
//     localStreamRef.current = stream;

//     const peer = new RTCPeerConnection();
//     peerRef.current = peer;

//     // Add tracks
//     stream.getTracks().forEach((track) => peer.addTrack(track, stream));

//     // Remote stream
//     const remoteStream = new MediaStream();
//     remoteStreamRef.current = remoteStream;
//     peer.ontrack = (event) => {
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//     };

//     // Create SDP offer
//     const offer = await peer.createOffer();
//     await peer.setLocalDescription(offer);

//     const newCallId = `${currentUserId}-${otherUserId}-${Date.now()}`;
//     setCallId(newCallId);

//     // Send SDP via Supabase
//     await supabase.from("calls").insert([
//       {
//         call_id: newCallId,
//         sender: currentUserId,
//         receiver: otherUserId,
//         sdp: offer,
//       },
//     ]);

//     setInCall(true);
//   };

//   // Answer incoming call
//   const answerCall = async (offerPayload) => {
//     setIncomingCall(offerPayload);

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     localStreamRef.current = stream;

//     const peer = new RTCPeerConnection();
//     peerRef.current = peer;

//     stream.getTracks().forEach((track) => peer.addTrack(track, stream));

//     const remoteStream = new MediaStream();
//     remoteStreamRef.current = remoteStream;
//     peer.ontrack = (event) => {
//       event.streams[0].getTracks().forEach((track) => {
//         remoteStream.addTrack(track);
//       });
//     };

//     await peer.setRemoteDescription(offerPayload.sdp);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);

//     // Send answer SDP
//     await supabase.from("calls").insert([
//       {
//         call_id: offerPayload.call_id,
//         sender: currentUserId,
//         receiver: offerPayload.sender,
//         sdp: answer,
//       },
//     ]);

//     setCallId(offerPayload.call_id);
//     setInCall(true);
//     setIncomingCall(null);
//   };

//   // End call
//   const endCall = () => {
//     if (peerRef.current) peerRef.current.close();
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (remoteStreamRef.current) {
//       remoteStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     setInCall(false);
//     setIncomingCall(null);
//     setCallId(null);
//     localStreamRef.current = null;
//     remoteStreamRef.current = null;
//     peerRef.current = null;
//   };

//   // Listen for incoming offers/answers
//   useEffect(() => {
//     if (!currentUserId) return;

//     const subscription = supabase
//       .from(`calls:receiver=eq.${currentUserId}`)
//       .on("INSERT", (payload) => {
//         const call = payload.new;
//         if (call.sender !== currentUserId) {
//           if (!inCall) answerCall(call); // auto-answer for demo
//         }
//       })
//       .subscribe();

//     return () => {
//       supabase.removeSubscription(subscription);
//     };
//   }, [currentUserId, inCall]);

//   return {
//     startCall,
//     answerCall,
//     endCall,
//     localStreamRef,
//     remoteStreamRef,
//     inCall,
//     incomingCall,
//     callId,
//   };
// }








// // src/components/useWebRTC.js
// import { useEffect, useRef, useState } from "react";
// import { supabase } from "../supabaseClient";

// export function useWebRTC({ currentUserId, otherUserId }) {
//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const peerRef = useRef(null);
//   const [inCall, setInCall] = useState(false);

//   // Start a call
//   const startCall = async (video = false) => {
//     try {
//       setInCall(true);
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video,
//       });
//       localStreamRef.current = localStream;

//       const peer = new RTCPeerConnection();
//       peerRef.current = peer;

//       // Add local tracks
//       localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

//       // Handle remote tracks
//       const remoteStream = new MediaStream();
//       peer.ontrack = (event) => {
//         event.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
//         remoteStreamRef.current = remoteStream;
//       };

//       // Create offer
//       const offer = await peer.createOffer();
//       await peer.setLocalDescription(offer);

//       // Send offer via Supabase
//       await supabase.from("calls").insert([
//         {
//           sender: currentUserId,
//           receiver: otherUserId,
//           sdp: JSON.stringify(offer),
//         },
//       ]);
//     } catch (err) {
//       console.error("Start call error:", err);
//     }
//   };

//   // Answer incoming call
//   const answerCall = async (callData) => {
//     try {
//       setInCall(true);
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: callData.sdp.includes("m=video"),
//       });
//       localStreamRef.current = localStream;

//       const peer = new RTCPeerConnection();
//       peerRef.current = peer;

//       // Add local tracks
//       localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));

//       // Handle remote tracks
//       const remoteStream = new MediaStream();
//       peer.ontrack = (event) => {
//         event.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
//         remoteStreamRef.current = remoteStream;
//       };

//       // Set remote description from offer
//       const offer = JSON.parse(callData.sdp);
//       await peer.setRemoteDescription(offer);

//       // Create answer
//       const answer = await peer.createAnswer();
//       await peer.setLocalDescription(answer);

//       // Send answer back via Supabase
//       await supabase.from("calls").insert([
//         {
//           sender: currentUserId,
//           receiver: callData.sender,
//           sdp: JSON.stringify(answer),
//         },
//       ]);
//     } catch (err) {
//       console.error("Answer call error:", err);
//     }
//   };

//   const endCall = () => {
//     peerRef.current?.close();
//     localStreamRef.current?.getTracks().forEach((t) => t.stop());
//     remoteStreamRef.current = null;
//     localStreamRef.current = null;
//     setInCall(false);
//   };

//   // Listen for incoming calls
//   useEffect(() => {
//     if (!currentUserId) return;

//     const channel = supabase
//       .channel(`calls-${currentUserId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "calls",
//           filter: `receiver=eq.${currentUserId}`,
//         },
//         (payload) => {
//           const call = payload.new;
//           if (call.sender !== currentUserId) {
//             answerCall(call); // auto-answer for demo
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   return {
//     startCall,
//     answerCall,
//     endCall,
//     inCall,
//     localStreamRef,
//     remoteStreamRef,
//   };
// }








 

import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export function useWebRTC({ currentUserId, otherUserId }) {
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const currentCallRef = useRef(null);

  // Create peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = async (event) => {
      if (event.candidate && currentCallRef.current) {
        await supabase.from("call_candidates").insert([
          {
            call_id: currentCallRef.current.id,
            sender_id: currentUserId,
            candidate: event.candidate.toJSON(),
          },
        ]);
      }
    };

    pc.ontrack = (event) => {
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  // Start a call
  const startCall = async (isVideo) => {
    const pc = createPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: isVideo,
    });
    localStreamRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const { data, error } = await supabase.from("call_requests").insert([
      {
        caller_id: currentUserId,
        receiver_id: otherUserId,
        type: isVideo ? "video" : "audio",
        offer,
      },
    ]).select().single();

    if (error) console.error(error);
    currentCallRef.current = data;
    setInCall(true);
  };

  // End call
  const endCall = async () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current?.srcObject) {
      localStreamRef.current.srcObject.getTracks().forEach((t) => t.stop());
      localStreamRef.current.srcObject = null;
    }
    remoteStreamRef.current.srcObject = null;
    setInCall(false);

    if (currentCallRef.current) {
      await supabase.from("call_requests")
        .update({ status: "ended" })
        .eq("id", currentCallRef.current.id);
    }
  };

  // Accept call
  const acceptCall = async (call) => {
    const pc = createPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: call.type === "video",
    });
    localStreamRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(call.offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await supabase.from("call_requests")
      .update({ status: "accepted", answer })
      .eq("id", call.id);

    currentCallRef.current = call;
    setInCall(true);
    setIncomingCall(null);
  };

  // Reject call
  const rejectCall = async (call) => {
    await supabase.from("call_requests")
      .update({ status: "rejected" })
      .eq("id", call.id);
    setIncomingCall(null);
  };

  // Listen for incoming calls
  useEffect(() => {
    if (!currentUserId) return;
    const channel = supabase
      .channel("incoming-calls")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "call_requests",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          if (payload.new.status === "pending") {
            setIncomingCall(payload.new);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUserId]);

  // Listen for answers (caller side)
  useEffect(() => {
    if (!currentUserId) return;
    const channel = supabase
      .channel("call-answers")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "call_requests",
          filter: `caller_id=eq.${currentUserId}`,
        },
        async (payload) => {
          const call = payload.new;
          if (call.status === "accepted" && call.answer) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(call.answer)
            );
            currentCallRef.current = call;
            setInCall(true);
          } else if (call.status === "rejected") {
            alert("❌ Call rejected");
            setInCall(false);
          } else if (call.status === "ended") {
            alert("📴 Call ended");
            endCall();
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUserId]);

  // Listen for ICE candidates
  useEffect(() => {
    if (!currentCallRef.current) return;
    const channel = supabase
      .channel("call-candidates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "call_candidates",
          filter: `call_id=eq.${currentCallRef.current.id}`,
        },
        async (payload) => {
          const candidate = new RTCIceCandidate(payload.new.candidate);
          try {
            await peerConnectionRef.current.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding ICE", e);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentCallRef.current]);

  return {
    inCall,
    incomingCall,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
  };
}
