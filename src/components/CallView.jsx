import { useEffect, useRef } from "react";

export default function CallView({ localStream, remoteStream, onHangup }) {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Remote Video (background) */}
        <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!remoteStream && <p className="text-white text-lg">Connecting...</p>}
        </div>

        {/* Local Video (picture-in-picture) */}
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg md:w-64 md:h-48">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 flex gap-4">
        <button
          onClick={onHangup}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
          title="Hang Up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 5.25V4.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
