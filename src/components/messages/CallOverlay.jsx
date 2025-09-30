import { useEffect } from "react";

export default function CallOverlay({
  inCall,
  endCall,
  localStreamRef,
  remoteStreamRef,
}) {
  // Setup local video when call starts
  useEffect(() => {
    if (inCall && localStreamRef.current) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStreamRef.current.srcObject = stream;
        } catch (err) {
          console.error("Error accessing camera/mic:", err);
        }
      })();
    }
  }, [inCall]);

  if (!inCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      <div className="flex-1 flex justify-center items-center relative">
        {/* Remote video */}
        <video
          ref={remoteStreamRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local video preview */}
        <video
          ref={localStreamRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-4 right-4 w-40 h-28 rounded-xl shadow-lg border-2 border-white object-cover"
        />
      </div>

      {/* Controls */}
      <div className="p-4 flex justify-center bg-black">
        <button
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg"
        >
          End Call
        </button>
      </div>
    </div>
  );
}
