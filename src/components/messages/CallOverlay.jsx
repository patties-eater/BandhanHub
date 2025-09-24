export default function CallOverlay({
  inCall,
  endCall,
  localStreamRef,
  remoteStreamRef,
}) {
  if (!inCall || !remoteStreamRef.current) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 bg-black flex justify-center items-center">
      <video
        ref={(el) => el && (el.srcObject = localStreamRef.current)}
        autoPlay
        muted
        className="w-32 h-32 rounded-lg absolute top-4 right-4"
      />
      <video
        ref={(el) => el && (el.srcObject = remoteStreamRef.current)}
        autoPlay
        className="w-full h-full"
      />
      <button
        onClick={endCall}
        className="absolute top-4 left-4 p-3 bg-red-600 text-white rounded-full"
      >
        ❌ End
      </button>
    </div>
  );
}
