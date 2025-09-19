// import { Routes, Route } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// import Home from "./Home";
// import Matches from "./Matches";
// import UserProfile from "./UserProfile";

// export default function Dashboard() {
//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />
//       <div className="flex-1 bg-gray-50 overflow-y-auto">
//         <Routes>
//           <Route index element={<Home />} />
//           <Route path="matches" element={<Matches />} />
//           <Route path="profile" element={<UserProfile />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }


import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}

