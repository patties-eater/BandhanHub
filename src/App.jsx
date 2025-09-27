
// import InstallPrompt from "./components/InstallPrompt";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

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
// import Profile from "./pages/Dashboard/Profile";     // 👈 new page for viewing others
// import Messages from "./pages/Dashboard/Messages";   // 👈 new page for chats

// function App() {
//   return (

//     <>

    
//     <BrowserRouter>
    
//       <Routes>
//         {/* Auth pages */}
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/auth/callback" element={<AuthCallback />} />
//         <Route path="/profile-setup" element={<ProfileWizard />} />

//         {/* Dashboard wrapper */}
//         <Route path="/dashboard" element={<Dashboard />}>
//           {/* Nested pages inside dashboard */}
//           <Route index element={<Home />} />
//           <Route path="matches" element={<Matches />} />
//           <Route path="profile" element={<UserProfile />} /> {/* logged-in user */}

//           {/* dynamic routes for other users */}
//           <Route path="profile/:id" element={<Profile />} />
//           <Route path="messages/:id" element={<Messages />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
// </>
//   );
// }

// export default App;



// import { registerSW } from "virtual:pwa-register";
// import InstallPrompt from "./components/InstallPrompt";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

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
// import Messages from "./pages/Dashboard/Messages";

// function App() {
// registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// });


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
//             <Route path="profile" element={<UserProfile />} />
//             <Route path="profile/:id" element={<Profile />} />
//             <Route path="messages/:id" element={<Messages />} />
//           </Route>

//           {/* Optional: standalone messages page */}
//           {/* <Route path="/messages/:id" element={<Messages />} /> */}
//         </Routes>
//       </BrowserRouter>

//       {/* 👈 Add the InstallPrompt component here so it always listens */}
//       <InstallPrompt />
//     </>
//   );
// }

// export default App;









// import { registerSW } from "virtual:pwa-register";
// import InstallPrompt from "./components/InstallPrompt";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Auth Pages
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import AuthCallback from "./pages/AuthCallback";
// import ProfileWizard from "./pages/ProfileWizard";

// // Dashboard & nested pages
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Dashboard/Home";
// import Matches from "./pages/Dashboard/Matches";
// import UserProfile from "./pages/Dashboard/UserProfile";
// import Profile from "./pages/Dashboard/Profile";
// import Inbox from "./pages/Dashboard/Inbox";      // Inbox component
// import Messages from "./pages/Dashboard/Messages"; // Chat component

// function App() {
//   registerSW({
//     onNeedRefresh() {},
//     onOfflineReady() {},
//   });

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
//             <Route path="profile" element={<UserProfile />} />
//             <Route path="profile/:id" element={<Profile />} />

//             {/* Messages */}
//             <Route path="inbox" element={<Inbox />} />          {/* List of users */}
//             <Route path="messages/:id" element={<Messages />} /> {/* Chat */}
//           </Route>
//         </Routes>
//       </BrowserRouter>

//       <InstallPrompt />
//     </>
//   );
// }

// export default App;








import { useWebRTC } from "./components/useWebRTC";
import { registerSW } from "virtual:pwa-register";
import InstallPrompt from "./components/InstallPrompt";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import ProfileWizard from "./pages/ProfileWizard";

// Dashboard & nested pages
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Dashboard/Home";
import Matches from "./pages/Dashboard/Matches";
import UserProfile from "./pages/Dashboard/UserProfile";
import Profile from "./pages/Dashboard/Profile";
import Inbox from "./pages/Dashboard/Inbox";
import Messages from "./pages/Dashboard/Messages";

// Call UI
import IncomingCallPopup from "./components/messages/IncomingCallPopup";
import CallOverlay from "./components/messages/CallOverlay";

function App() {
  registerSW({
    onNeedRefresh() {},
    onOfflineReady() {},
  });

  // ⚡ Replace with actual logged-in user ID from Supabase auth
  const currentUserId = "replace_with_auth_user_id";

  // ✅ useWebRTC hook (global)
  const {
    incomingCall,
    acceptCall,
    rejectCall,
    inCall,
    endCall,
    localStreamRef,
    remoteStreamRef,
  } = useWebRTC({ currentUserId, otherUserId: null });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Auth pages */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile-setup" element={<ProfileWizard />} />

          {/* Dashboard wrapper */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="matches" element={<Matches />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="messages/:id" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* ✅ Global Incoming Call Popup */}
      {incomingCall && (
        <IncomingCallPopup
          call={incomingCall}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {/* ✅ Global Call Overlay */}
      <CallOverlay
        inCall={inCall}
        endCall={endCall}
        localStreamRef={localStreamRef}
        remoteStreamRef={remoteStreamRef}
      />

      <InstallPrompt />
    </>
  );
}

export default App;
