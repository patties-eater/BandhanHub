import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import ChatBox from "../../components/ChatBox";
import CallView from "../../components/CallView";

export default function Messages() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnectionRef = useRef(null);
  const callMessageIdRef = useRef(null);

  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const parseCallPayload = (message) => {
    if (message?.metadata && typeof message.metadata === "object") {
      return message.metadata;
    }
    if (!message?.content || typeof message.content !== "string") {
      return {};
    }
    try {
      const parsed = JSON.parse(message.content);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

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
        setUser(data);
      }
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  // Get current user
  useEffect(() => {
    async function getCurrentUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    }
    getCurrentUser();
  }, []);

  // --- WebRTC Call Logic ---

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(servers);

    pc.onicecandidate = async (event) => {
      if (event.candidate && callMessageIdRef.current) {
        await supabase.from("call_ice_candidates").insert({
          message_id: callMessageIdRef.current,
          sender_id: currentUserId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      const newStream = new MediaStream();
      event.streams[0].getTracks().forEach((track) => {
        newStream.addTrack(track);
      });
      setRemoteStream(newStream);
    };

    return pc;
  };

  const startCall = async () => {
    if (!user || !currentUserId) return;

    try {
      peerConnectionRef.current = createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      const { data: msgData, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: currentUserId,
            receiver_id: user.id,
            type: "call_request",
            status: "pending",
            content: JSON.stringify({ offer }),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Call insert failed:", error);
        alert("Failed to start call: " + error.message);
        return;
      }

      callMessageIdRef.current = msgData.id;
      setInCall(true);
    } catch (err) {
      console.error("Start call error:", err);
      alert(
        "Could not start call. Please allow camera/microphone permissions.",
      );
    }
  };

  const answerCall = async (message) => {
    const callPayload = parseCallPayload(message);
    if (!callPayload.offer) return;

    try {
      callMessageIdRef.current = message.id;
      peerConnectionRef.current = createPeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(callPayload.offer),
      );

      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      const { error } = await supabase
        .from("messages")
        .update({
          status: "answered",
          content: JSON.stringify({ ...callPayload, answer }),
        })
        .eq("id", message.id);

      if (error) throw error;

      setInCall(true);
    } catch (err) {
      console.error("Answer call error:", err);
      alert(
        "Could not answer call. Please allow camera/microphone permissions.",
      );
    }
  };

  const declineCall = async (message) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status: "declined" })
        .eq("id", message.id);

      if (error) throw error;
    } catch (err) {
      console.error("Decline call error:", err);
      alert("Failed to decline call.");
    }
  };

  const hangUp = async () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setInCall(false);
    setLocalStream(null);
    setRemoteStream(null);

    if (callMessageIdRef.current) {
      await supabase
        .from("messages")
        .update({ status: "ended" })
        .eq("id", callMessageIdRef.current)
        .in("status", ["pending", "answered"]);
      callMessageIdRef.current = null;
    }
  };

  // --- Signaling via Supabase Realtime ---
  useEffect(() => {
    if (!currentUserId || !user?.id) return;

    const messageChannel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        async (payload) => {
          const updatedMessage = payload.new;
          const callPayload = parseCallPayload(updatedMessage);
          if (
            callMessageIdRef.current &&
            updatedMessage.id === callMessageIdRef.current &&
            updatedMessage.sender_id === currentUserId &&
            updatedMessage.receiver_id === user.id &&
            callPayload.answer &&
            peerConnectionRef.current?.signalingState === "have-local-offer"
          ) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(callPayload.answer),
            );
          }
        },
      )
      .subscribe();

    const iceChannel = supabase
      .channel("ice-candidates-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_ice_candidates" },
        (payload) => {
          const { sender_id, candidate } = payload.new;
          if (sender_id !== currentUserId && peerConnectionRef.current) {
            peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(iceChannel);
    };
  }, [currentUserId, user]);

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
    <div className="flex flex-col h-screen bg-gray-50 relative">
      {inCall && (
        <CallView
          localStream={localStream}
          remoteStream={remoteStream}
          onHangup={hangUp}
        />
      )}
      <ChatBox
        user={user}
        currentUserId={currentUserId}
        onStartCall={startCall}
        onAnswerCall={answerCall}
        onDeclineCall={declineCall}
      />
    </div>
  );
}
