// src/components/CallManager.jsx
import { useWebRTCContext } from "./WebRTCProvider";
import IncomingCallPopup from "./messages/IncomingCallPopup";
import CallOverlay from "./messages/CallOverlay";

export default function CallManager() {
  const {
    incomingCall,
    acceptCall,
    rejectCall,
    inCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
  } = useWebRTCContext();

  return (
    <>
      {/* Incoming Call Popup */}
      {incomingCall && (
        <IncomingCallPopup
          call={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* Active Call Overlay */}
      <CallOverlay
        inCall={inCall}
        endCall={endCall}
        localStreamRef={localStreamRef}
        remoteStreamRef={remoteStreamRef}
      />
    </>
  );
}

