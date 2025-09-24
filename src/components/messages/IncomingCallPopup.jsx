export default function IncomingCallPopup({ call, onAccept, onReject }) {
  if (!call) return null;
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/60 flex flex-col justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="mb-4 font-semibold">
          {call.type === "video" ? "📹 Video" : "📞 Audio"} Call Incoming…
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onAccept(call)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(call)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
