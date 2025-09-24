import { useState, useRef } from "react";
import { supabase } from "../../supabaseClient";

export default function ChatInput({ user, currentUserId, setRefreshTrigger }) {
  const [message, setMessage] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Send text message
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!currentUserId || !message.trim()) return;

    const { error } = await supabase.from("messages").insert([
      { sender_id: currentUserId, receiver_id: user.id, content: message },
    ]);
    if (error) console.error(error);

    setMessage("");
    setRefreshTrigger((prev) => prev + 1);
  };

  // Start recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) return;

      const fileName = `messages/${currentUser.id}/${Date.now()}.webm`;
      await supabase.storage.from("voice-messages").upload(fileName, blob);
      const { data: urlData } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

      await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: user.id,
          audio_url: urlData.publicUrl,
        },
      ]);
      setRefreshTrigger((prev) => prev + 1);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="sticky bottom-0 w-full bg-white border-t p-2 flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 text-sm rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
      />

      {message.trim() ? (
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex-shrink-0"
        >
          ➤
        </button>
      ) : recording ? (
        <button
          onClick={stopRecording}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 flex-shrink-0"
        >
          ⏹️
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 flex-shrink-0"
        >
          🎙️
        </button>
      )}
    </div>
  );
}
