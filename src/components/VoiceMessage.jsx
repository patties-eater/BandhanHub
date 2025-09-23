import { useState, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function VoiceMessage({ receiverId }) {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Get current user ID
  const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  };

  const startRecording = async () => {
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

      if (uploadError) return console.error(uploadError);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      setAudioUrl(publicUrl);

      // Insert into messages table
      const { error: dbError } = await supabase.from("messages").insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          content: null,      // now allowed
          audio_url: publicUrl,
        },
      ]);

      if (dbError) console.error(dbError);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      {recording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>🎙️ Record</button>
      )}

      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
