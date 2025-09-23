import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import ChatBox from "../../components/ChatBox";

export default function Messages() {
  const { id } = useParams(); // Chat partner's user ID
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState(""); // text input

  // Voice recording
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Fetch chat partner profile
  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
        return;
      }

      setUser({
        id: data.id,
        name: data.full_name,
        image:
          data.avatar_url ||
          `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
      });
      setLoading(false);
    }
    fetchUser();
  }, [id]);

  // Poll chat every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Send text message
  async function sendMessage(e) {
    e.preventDefault();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) return;
    if (message.trim() === "") return;

    const { error } = await supabase.from("messages").insert([
      {
        sender_id: currentUser.id,
        receiver_id: user.id,
        content: message,
      },
    ]);

    if (error) console.error(error);
    setMessage("");
    setRefreshTrigger((prev) => prev + 1);
  }

  // Start voice recording
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
      const { error: uploadError } = await supabase.storage
        .from("voice-messages")
        .upload(fileName, blob);

      if (uploadError) return console.error(uploadError);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("voice-messages")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Insert voice message into DB
      const { error: dbError } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: user.id,
          content: null,
          audio_url: publicUrl,
        },
      ]);

      if (dbError) console.error(dbError);
      setRefreshTrigger((prev) => prev + 1);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

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
      {/* Header */}
      <div className="flex items-center p-4 border-b bg-white shadow-sm flex-shrink-0">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full mr-3 object-cover"
        />
        <h2 className="text-lg font-semibold truncate">{user.name}</h2>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
        <ChatBox user={user} refreshKey={refreshTrigger} />
      </div>

      {/* Input + buttons */}
      <form
        onSubmit={sendMessage}
        className="flex-shrink-0 p-4 border-t bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Stop 🎙️
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Record 🎙️
          </button>
        )}
      </form>
    </div>
  );
}
