export default function IncomingCallPopup({ call, onAccept, onReject }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-80">
        <h2 className="text-lg font-semibold mb-2">Incoming Call 📞</h2>
        <p className="text-gray-600 mb-4">
          {call?.fromName || "Unknown User"} is calling…
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onAccept?.(call)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow"
          >
            Accept
          </button>
          <button
            onClick={() => onReject?.(call)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
