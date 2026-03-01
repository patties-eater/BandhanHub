import { useState, useEffect, useRef, useCallback } from "react";
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
  const [isDialing, setIsDialing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [activeCallId, setActiveCallId] = useState(null);

  const peerConnectionRef = useRef(null);
  const callMessageIdRef = useRef(null);
  const callSessionRef = useRef(0);
  const localStreamRef = useRef(null);
  const remoteMediaStreamRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);
  const pendingRemoteIceCandidatesRef = useRef([]);
  const appliedRemoteCandidateIdsRef = useRef(new Set());

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

  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

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

  const createPeerConnection = (sessionId) => {
    const pc = new RTCPeerConnection(servers);
    remoteMediaStreamRef.current = new MediaStream();
    setRemoteStream(remoteMediaStreamRef.current);
    pendingRemoteIceCandidatesRef.current = [];
    appliedRemoteCandidateIdsRef.current = new Set();

    pc.onicecandidate = async (event) => {
      if (sessionId !== callSessionRef.current) return;
      if (!event.candidate) return;

      const candidatePayload = {
        message_id: callMessageIdRef.current,
        sender_id: currentUserId,
        candidate: event.candidate.toJSON(),
      };

      if (!callMessageIdRef.current) {
        pendingIceCandidatesRef.current.push(candidatePayload);
        return;
      }

      await supabase.from("call_ice_candidates").insert(candidatePayload);
    };

    pc.ontrack = (event) => {
      if (sessionId !== callSessionRef.current) return;
      if (!remoteMediaStreamRef.current) {
        remoteMediaStreamRef.current = new MediaStream();
      }

      const hasTrack = remoteMediaStreamRef.current
        .getTracks()
        .some((track) => track.id === event.track.id);

      if (!hasTrack) {
        remoteMediaStreamRef.current.addTrack(event.track);
      }

      setRemoteStream(new MediaStream(remoteMediaStreamRef.current.getTracks()));
    };

    return pc;
  };

  const flushPendingIceCandidates = async () => {
    if (!callMessageIdRef.current || pendingIceCandidatesRef.current.length === 0) {
      return;
    }

    const rows = pendingIceCandidatesRef.current.map((item) => ({
      ...item,
      message_id: callMessageIdRef.current,
    }));

    pendingIceCandidatesRef.current = [];
    await supabase.from("call_ice_candidates").insert(rows);
  };

  const flushQueuedRemoteIceCandidates = async () => {
    const pc = peerConnectionRef.current;
    if (!pc?.remoteDescription) return;
    if (pc.signalingState === "closed" || pc.connectionState === "closed") return;
    if (pendingRemoteIceCandidatesRef.current.length === 0) return;

    const queued = [...pendingRemoteIceCandidatesRef.current];
    pendingRemoteIceCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        if (err?.name !== "InvalidStateError" && err?.name !== "OperationError") {
          console.error("Failed to flush queued ICE candidate:", err);
        }
      }
    }
  };

  const applyOrQueueRemoteIceCandidate = async (candidate) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;
    if (pc.signalingState === "closed" || pc.connectionState === "closed") return;

    if (!pc.remoteDescription) {
      pendingRemoteIceCandidatesRef.current.push(candidate);
      return;
    }

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      if (err?.name !== "InvalidStateError" && err?.name !== "OperationError") {
        console.error("Failed to add ICE candidate:", err);
      }
    }
  };

  const cleanupCallState = useCallback(({ resetCallId = true } = {}) => {
    callSessionRef.current += 1;

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (remoteMediaStreamRef.current) {
      remoteMediaStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteMediaStreamRef.current = null;
    }

    pendingIceCandidatesRef.current = [];
    pendingRemoteIceCandidatesRef.current = [];
    appliedRemoteCandidateIdsRef.current = new Set();
    setInCall(false);
    setIsDialing(false);
    setLocalStream(null);
    setRemoteStream(null);

    if (resetCallId) {
      callMessageIdRef.current = null;
      setActiveCallId(null);
    }
  }, []);

  const startCall = async () => {
    if (!user || !currentUserId) return;

    try {
      cleanupCallState();
      const sessionId = callSessionRef.current;
      peerConnectionRef.current = createPeerConnection(sessionId);

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
        cleanupCallState();
        return;
      }

      callMessageIdRef.current = msgData.id;
      setActiveCallId(msgData.id);
      await flushPendingIceCandidates();
      setIsDialing(true);
    } catch (err) {
      console.error("Start call error:", err);
      cleanupCallState();
      alert(
        "Could not start call. Please allow camera/microphone permissions.",
      );
    }
  };

  const answerCall = async (message) => {
    const callPayload = parseCallPayload(message);
    if (!callPayload.offer) return;

    try {
      cleanupCallState();
      callMessageIdRef.current = message.id;
      setActiveCallId(message.id);
      const sessionId = callSessionRef.current;
      peerConnectionRef.current = createPeerConnection(sessionId);

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
      await flushQueuedRemoteIceCandidates();

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

      await flushPendingIceCandidates();
      setIsDialing(false);
      setInCall(true);
    } catch (err) {
      console.error("Answer call error:", err);
      cleanupCallState();
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
    const activeCallId = callMessageIdRef.current;
    cleanupCallState();

    if (activeCallId) {
      await supabase
        .from("messages")
        .update({ status: "ended" })
        .eq("id", activeCallId)
        .in("status", ["pending", "answered"]);
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
          if (updatedMessage.type !== "call_request") return;

          const isOutgoingCallInThisChat =
            updatedMessage.sender_id === currentUserId &&
            updatedMessage.receiver_id === user.id;

          // If the answered update arrives before we set local callMessageIdRef,
          // bind this session to that call id so second-direction calls still connect.
          if (
            !callMessageIdRef.current &&
            isOutgoingCallInThisChat &&
            updatedMessage.status === "answered" &&
            callPayload.answer
          ) {
            callMessageIdRef.current = updatedMessage.id;
            setActiveCallId(updatedMessage.id);
          }

          if (
            callMessageIdRef.current &&
            updatedMessage.id === callMessageIdRef.current &&
            isOutgoingCallInThisChat &&
            callPayload.answer &&
            peerConnectionRef.current &&
            !peerConnectionRef.current.currentRemoteDescription &&
            peerConnectionRef.current.signalingState !== "closed"
          ) {
            await peerConnectionRef.current.setRemoteDescription(
              new RTCSessionDescription(callPayload.answer),
            );
            await flushQueuedRemoteIceCandidates();
            setIsDialing(false);
            setInCall(true);
          }

          if (
            callMessageIdRef.current &&
            updatedMessage.id === callMessageIdRef.current &&
            ["ended", "declined", "missed"].includes(updatedMessage.status)
          ) {
            cleanupCallState();
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
          const { id: candidateId, sender_id, candidate, message_id } = payload.new;
          if (
            sender_id !== currentUserId &&
            callMessageIdRef.current &&
            message_id === callMessageIdRef.current &&
            peerConnectionRef.current
          ) {
            if (appliedRemoteCandidateIdsRef.current.has(candidateId)) return;
            appliedRemoteCandidateIdsRef.current.add(candidateId);
            applyOrQueueRemoteIceCandidate(candidate);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(iceChannel);
      cleanupCallState();
    };
  }, [currentUserId, user, cleanupCallState]);

  // Fallback: poll ICE candidates in case realtime delivery is delayed/missed.
  useEffect(() => {
    if (!activeCallId || !currentUserId) return;

    const poll = async () => {
      const { data, error } = await supabase
        .from("call_ice_candidates")
        .select("id,sender_id,candidate,message_id")
        .eq("message_id", activeCallId)
        .neq("sender_id", currentUserId)
        .order("id", { ascending: true });

      if (error || !data?.length) return;

      for (const row of data) {
        if (appliedRemoteCandidateIdsRef.current.has(row.id)) continue;
        appliedRemoteCandidateIdsRef.current.add(row.id);
        applyOrQueueRemoteIceCandidate(row.candidate);
      }
    };

    poll();
    const intervalId = setInterval(poll, 1000);
    return () => clearInterval(intervalId);
  }, [activeCallId, currentUserId]);

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
      {isDialing && !inCall && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl text-center">
            <img
              src={
                user?.avatar_url ||
                `https://api.dicebear.com/8.x/avataaars/svg?seed=${user?.full_name || "User"}`
              }
              alt={user?.full_name || "User"}
              className="w-20 h-20 mx-auto rounded-full object-cover bg-gray-100"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {user?.full_name || "User"}
            </h3>
            <p className="mt-2 text-sm text-gray-500">Waiting for receiver to accept...</p>
            <button
              onClick={hangUp}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full shadow"
            >
              Cancel Call
            </button>
          </div>
        </div>
      )}
      {inCall && (
        <CallView
          key={activeCallId || "call-view"}
          localStream={localStream}
          remoteStream={remoteStream}
          peerUser={user}
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
