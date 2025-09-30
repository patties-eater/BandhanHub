// import { useEffect, useState } from "react";
// import { supabase } from "../supabaseClient";

// export default function Notifications({ currentUserId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);

//   useEffect(() => {
//     if (!currentUserId) return;

//     async function fetchNotifications() {
//       // Delete old notifications
//       await supabase.from("notifications").delete().lt("created_at", new Date(Date.now() - 4 * 24*60*60*1000).toISOString());

//       const { data } = await supabase
//         .from("notifications")
//         .select("*")
//         .eq("receiver_id", currentUserId)
//         .order("created_at", { ascending: false });

//       setNotifications(data || []);
//     }

//     fetchNotifications();

//     const subscription = supabase
//       .channel("public:notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "notifications" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setNotifications((prev) => [payload.new, ...prev]);
//           } else if (payload.eventType === "DELETE") {
//             setNotifications((prev) =>
//               prev.filter((n) => n.id !== payload.old.id)
//             );
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(subscription);
//   }, [currentUserId]);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative text-white hover:text-yellow-300"
//       >
//         🔔
//         {notifications.length > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50">
//           {notifications.length === 0 && (
//             <p className="text-sm text-gray-500">No notifications</p>
//           )}
//           {notifications.map((n) => (
//             <div key={n.id} className="p-2 hover:bg-gray-100 rounded">
//               <p className="text-sm">
//                 {n.type === "message" && <strong>{n.content}</strong>}
//                 {n.type === "match" && `New match request: ${n.content}`}
//                 {n.type === "daily" && n.content}
//               </p>
//               <span className="text-xs text-gray-400">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }







import { useState, useEffect, useRef } from "react";

import { supabase } from "../../supabaseClient";

// Notifications component
export default function Notifications({ currentUserId }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications and set up realtime
  useEffect(() => {
    if (!currentUserId) return;

    async function fetchNotifications() {
      // Delete old notifications (older than 4 days)
      await supabase
        .from("notifications")
        .delete()
        .lt("created_at", new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString());

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("receiver_id", currentUserId)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
    }

    fetchNotifications();

    // Realtime subscription
    const subscription = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [currentUserId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white hover:text-yellow-300"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
        >
          {notifications.length === 0 && (
            <p className="text-sm text-gray-500">No notifications</p>
          )}
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <p className="text-sm">
                {n.type === "message" && <strong>{n.content}</strong>}
                {n.type === "match" && `New match request: ${n.content}`}
                {n.type === "daily" && n.content}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(n.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}









