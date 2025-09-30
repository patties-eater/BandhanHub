
// import { useEffect } from "react";
// import { registerSW } from "virtual:pwa-register";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import InstallPrompt from "./components/InstallPrompt";



// // Auth + Dashboard pages...
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import AuthCallback from "./pages/AuthCallback";
// import ProfileWizard from "./pages/ProfileWizard";
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Dashboard/Home";
// import Matches from "./pages/Dashboard/Matches";
// import UserProfile from "./pages/Dashboard/UserProfile";
// import Profile from "./pages/Dashboard/Profile";
// import Inbox from "./pages/Dashboard/Inbox";
// import Messages from "./pages/Dashboard/Messages";
// import Settings from "./pages/Dashboard/Settings";

// function App() {
//   useEffect(() => {
//     registerSW({
//       onNeedRefresh() {},
//       onOfflineReady() {},
//     });
//   }, []);

//   // ⚡ Replace with actual Supabase auth user
//   const currentUserId = "replace_with_auth_user_id";

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           {/* Auth pages */}
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/auth/callback" element={<AuthCallback />} />
//           <Route path="/profile-setup" element={<ProfileWizard />} />

//           {/* Dashboard wrapper */}
//           <Route path="/dashboard" element={<Dashboard />}>
//             <Route index element={<Home />} />
//             <Route path="matches" element={<Matches />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="profile" element={<UserProfile />} />
//             <Route path="profile/:id" element={<Profile />} />
//             <Route path="inbox" element={<Inbox />} />
//             <Route path="messages/:id" element={<Messages />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>

    

//       <InstallPrompt />
//     </>
//   );
// }

// export default App;












import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";

import { CallProvider, useCall } from "./context/CallProvider";
import IncomingCallPopup from "./components/messages/IncomingCallPopup";
import OutgoingCallOverlay from "./components/messages/OutgoingCallOverlay";
import CallOverlay from "./components/messages/CallOverlay";
import InstallPrompt from "./components/InstallPrompt";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import ProfileWizard from "./pages/ProfileWizard";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Dashboard/Home";
import Matches from "./pages/Dashboard/Matches";
import UserProfile from "./pages/Dashboard/UserProfile";
import Profile from "./pages/Dashboard/Profile";
import Inbox from "./pages/Dashboard/Inbox";
import Messages from "./pages/Dashboard/Messages";
import Settings from "./pages/Dashboard/Settings";

function GlobalCallSystem() {
  const { incomingCall, activeCall, setIncomingCall } = useCall();
  const [outgoingCall, setOutgoingCall] = useState(false);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const cancelOutgoingCall = () => setOutgoingCall(false);
  const endCall = () => setOutgoingCall(false);

  return (
    <>
      {incomingCall && (
        <IncomingCallPopup
          call={incomingCall}
          onReject={() => setIncomingCall(null)}
        />
      )}

      {outgoingCall && !activeCall && (
        <OutgoingCallOverlay
          user={incomingCall?.sender}
          onCancel={cancelOutgoingCall}
        />
      )}

      {activeCall && (
        <CallOverlay
          inCall={true}
          endCall={endCall}
          localStreamRef={localStreamRef}
          remoteStreamRef={remoteStreamRef}
        />
      )}
    </>
  );
}

function App() {
  useEffect(() => {
    registerSW({
      onNeedRefresh() {},
      onOfflineReady() {},
    });
  }, []);

  return (
    <CallProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile-setup" element={<ProfileWizard />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="matches" element={<Matches />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="messages/:id" element={<Messages />} />
          </Route>
        </Routes>

        {/* Global call system */}
        <GlobalCallSystem />

        <InstallPrompt />
      </BrowserRouter>
    </CallProvider>
  );
}

export default App;
