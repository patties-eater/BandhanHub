


// import { useEffect } from "react";
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

//             {/* Messages */}
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

















import { useEffect } from "react";
import { registerSW } from "virtual:pwa-register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InstallPrompt from "./components/InstallPrompt";
import CallManager from "./components/CallManager";
import { WebRTCProvider } from "./components/WebRTCProvider";

// Auth + Dashboard pages...
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

function App() {
  useEffect(() => {
    registerSW({
      onNeedRefresh() {},
      onOfflineReady() {},
    });
  }, []);

  // ⚡ Replace with actual Supabase auth user
  const currentUserId = "replace_with_auth_user_id";

  return (
    <WebRTCProvider currentUserId={currentUserId}>
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
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="messages/:id" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Global call system */}
      <CallManager />

      <InstallPrompt />
    </WebRTCProvider>
  );
}

export default App;
