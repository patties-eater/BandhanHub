// src/context/WebRTCProvider.jsx
import { createContext, useContext } from "react";
import { useWebRTC } from "../hooks/useWebRTC";

const WebRTCContext = createContext();

export function WebRTCProvider({ currentUserId, children }) {
  const {
    incomingCall,
    acceptCall,
    rejectCall,
    inCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
  } = useWebRTC({ currentUserId });

  return (
    <WebRTCContext.Provider
      value={{
        incomingCall,
        acceptCall,
        rejectCall,
        inCall,
        endCall,
        localStreamRef,
        remoteStreamRef,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
}

export function useWebRTCContext() {
  return useContext(WebRTCContext);
}
