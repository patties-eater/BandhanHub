export default function OutgoingCallOverlay({ user, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-80">
        <h2 className="text-lg font-semibold mb-2">Calling…</h2>
        <p className="text-gray-600 mb-4">{user?.name || "User"}</p>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
