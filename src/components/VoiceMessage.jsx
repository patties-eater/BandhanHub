import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function VoiceMessage({ receiverId }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Get current user ID
  const getCurrentUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const senderId = await getCurrentUserId();
        if (!senderId) return;

        const fileName = `messages/${senderId}/${Date.now()}.webm`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("voice-messages")
          .upload(fileName, blob);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("voice-messages")
          .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;

        // Insert into messages table
        const { error: dbError } = await supabase.from("messages").insert([
          {
            sender_id: senderId,
            receiver_id: receiverId,
            content: null,
            audio_url: publicUrl,
          },
        ]);

        if (dbError) {
          console.error(dbError);
        } else {
          await supabase.from("notifications").insert({
            sender_id: senderId,
            receiver_id: receiverId,
            type: "message",
            content: "🎤 Voice Message",
            is_read: false,
          });
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Stop all tracks to release microphone
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        recording
          ? "bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500 animate-pulse"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-400"
      }`}
      title={recording ? "Stop Recording" : "Record Voice Message"}
    >
      {recording ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
      )}
    </button>
  );
}
