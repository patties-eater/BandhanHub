export default function ChatHeader({ user, startCall }) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm flex-shrink-0">
      <div className="flex items-center">
        <img
          src={user.image}
          alt={user.name}
          className="w-12 h-12 rounded-full mr-3 object-cover"
        />
        <h2 className="text-lg font-semibold truncate">{user.name}</h2>
      </div>

      {/* Call buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => startCall(false)}
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
        >
          📞
        </button>
        <button
          onClick={() => startCall(true)}
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full"
        >
          🎥
        </button>
      </div>
    </div>
  );
}
