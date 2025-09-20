// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import AuthCallback from "./pages/AuthCallback";
// import ProfileWizard from "./pages/ProfileWizard";
// import Dashboard from "./pages/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Auth Pages */}
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/auth/callback" element={<AuthCallback />} />
//         <Route path="/profile-setup" element={<ProfileWizard />} />

//         {/* Dashboard with nested routes */}
//         <Route path="/dashboard/*" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



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

// function App() {
//   return (
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
//           <Route path="profile" element={<UserProfile />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import Profile from "./pages/Dashboard/Profile";     // 👈 new page for viewing others
import Messages from "./pages/Dashboard/Messages";   // 👈 new page for chats

function App() {
  return (
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
          {/* Nested pages inside dashboard */}
          <Route index element={<Home />} />
          <Route path="matches" element={<Matches />} />
          <Route path="profile" element={<UserProfile />} /> {/* logged-in user */}

          {/* dynamic routes for other users */}
          <Route path="profile/:id" element={<Profile />} />
          <Route path="messages/:id" element={<Messages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

