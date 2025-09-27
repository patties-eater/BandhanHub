// export default function CallOverlay({
//   inCall,
//   endCall,
//   localStreamRef,
//   remoteStreamRef,
// }) {
//   if (!inCall || !remoteStreamRef.current) return null;

//   return (
//     <div className="absolute top-0 left-0 w-full h-full z-50 bg-black flex justify-center items-center">
//       <video
//         ref={(el) => el && (el.srcObject = localStreamRef.current)}
//         autoPlay
//         muted
//         className="w-32 h-32 rounded-lg absolute top-4 right-4"
//       />
//       <video
//         ref={(el) => el && (el.srcObject = remoteStreamRef.current)}
//         autoPlay
//         className="w-full h-full"
//       />
//       <button
//         onClick={endCall}
//         className="absolute top-4 left-4 p-3 bg-red-600 text-white rounded-full"
//       >
//         ❌ End
//       </button>
//     </div>
//   );
// }



// import { useEffect } from "react";

// export default function CallOverlay({ inCall, endCall, localStreamRef, remoteStreamRef }) {
//   useEffect(() => {
//     if (localStreamRef.current && document.getElementById("localVideo")) {
//       document.getElementById("localVideo").srcObject = localStreamRef.current;
//     }
//     if (remoteStreamRef.current && document.getElementById("remoteVideo")) {
//       document.getElementById("remoteVideo").srcObject = remoteStreamRef.current;
//     }
//   }, [inCall, localStreamRef.current, remoteStreamRef.current]);

//   if (!inCall) return null;

//   return (
//     <div className="absolute top-0 left-0 w-full h-full z-50 bg-black flex justify-center items-center">
//       <video id="localVideo" autoPlay muted className="w-32 h-32 rounded-lg absolute top-4 right-4" />
//       <video id="remoteVideo" autoPlay className="w-full h-full" />
//       <button
//         onClick={endCall}
//         className="absolute top-4 left-4 p-3 bg-red-600 text-white rounded-full"
//       >
//         ❌ End
//       </button>
//     </div>
//   );
// }








import { useEffect, useRef } from "react";

export default function CallOverlay({ inCall, endCall, localStreamRef, remoteStreamRef }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localStreamRef.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (remoteStreamRef.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [inCall, localStreamRef.current, remoteStreamRef.current]);

  if (!inCall) return null;

  useEffect(() => {
  if (localStreamRef.current && localStreamRef.current.srcObject !== localStream) {
    localStreamRef.current.srcObject = localStream;
  }
}, [localStream, localStreamRef]);

useEffect(() => {
  if (remoteStreamRef.current && remoteStreamRef.current.srcObject !== remoteStream) {
    remoteStreamRef.current.srcObject = remoteStream;
  }
}, [remoteStream, remoteStreamRef]);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 bg-black flex justify-center items-center">
      <video ref={localVideoRef} autoPlay muted className="w-32 h-32 rounded-lg absolute top-4 right-4" />
      <video ref={remoteVideoRef} autoPlay className="w-full h-full" />
      <button
        onClick={endCall}
        className="absolute top-4 left-4 p-3 bg-red-600 text-white rounded-full"
      >
        ❌ End
      </button>
    </div>
  );
}
