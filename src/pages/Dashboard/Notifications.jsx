











// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabaseClient";

// export default function Notifications({ currentUserId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch notifications & setup realtime subscription
//   useEffect(() => {
//     if (!currentUserId) return;

//     async function fetchNotifications() {
//       const { data } = await supabase
//         .from("notifications")
//         .select("*")
//         .eq("receiver_id", currentUserId)
//         .order("created_at", { ascending: false });
//       setNotifications(data || []);
//     }

//     fetchNotifications();

//     // Realtime subscription
//     const channel = supabase
//       .channel("public:notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "notifications" },
//         (payload) => {
//           const n = payload.new;
//           const o = payload.old;

//           // New notification
//           if (payload.eventType === "INSERT" && n.receiver_id === currentUserId) {
//             setNotifications((prev) => [n, ...prev]);
//           }

//           // Deleted notification
//           else if (payload.eventType === "DELETE" && o.receiver_id === currentUserId) {
//             setNotifications((prev) => prev.filter((item) => item.id !== o.id));
//           }

//           // Updated notification (e.g., marked as read)
//           else if (payload.eventType === "UPDATE" && n.receiver_id === currentUserId) {
//             setNotifications((prev) =>
//               prev.map((item) => (item.id === n.id ? n : item))
//             );
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Mark all as read
//   async function markAllAsRead() {
//     await supabase
//       .from("notifications")
//       .update({ is_read: true })
//       .eq("receiver_id", currentUserId)
//       .eq("is_read", false);
//   }

//   // Clear all notifications
//   async function clearAllNotifications() {
//     const confirmClear = window.confirm("Are you sure you want to clear all notifications?");
//     if (!confirmClear) return;

//     const { error } = await supabase
//       .from("notifications")
//       .delete()
//       .eq("receiver_id", currentUserId);

//     if (!error) setNotifications([]);
//     else console.error("Failed to clear notifications:", error.message);
//   }

//   // Count of unread notifications
//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   return (
//     <div className="relative ml-4">
//       <button
//         onClick={() => {
//           setIsOpen(!isOpen);
//           if (!isOpen) markAllAsRead();
//         }}
//         className="relative text-white hover:text-yellow-300"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
//         >
//           {/* Clear all button */}
//           {notifications.length > 0 && (
//             <button
//               onClick={clearAllNotifications}
//               className="text-xs text-red-500 hover:underline mb-2"
//             >
//               Clear All
//             </button>
//           )}

//           {notifications.length === 0 && (
//             <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
//           )}

//           {notifications.map((n) => (
//             <div
//               key={n.id}
//               className={`p-2 rounded transition cursor-pointer mb-1 ${
//                 n.is_read
//                   ? "bg-white text-gray-700"
//                   : "bg-blue-50 border-l-4 border-blue-400"
//               } hover:bg-gray-100`}
//             >
//               <p className="text-sm">{n.content}</p>
//               <span className="text-xs text-gray-400 block">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


































// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabaseClient";

// export default function Notifications({ currentUserId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     if (!currentUserId) return;

//     // Fetch current notifications
//     const fetchNotifications = async () => {
//       const { data, error } = await supabase
//         .from("notifications")
//         .select("*")
//         .eq("receiver_id", currentUserId)
//         .order("created_at", { ascending: false });

//       if (!error) setNotifications(data || []);
//     };

//     fetchNotifications();

//     // Subscribe to real-time changes
//     const channel = supabase
//       .channel("public:notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "notifications" },
//         (payload) => {
//           const n = payload.new;
//           const o = payload.old;

//           // Only update if it's for current user
//           if (payload.eventType === "INSERT" && n.receiver_id === currentUserId) {
//             setNotifications((prev) => [n, ...prev]);
//           } else if (payload.eventType === "UPDATE" && n.receiver_id === currentUserId) {
//             setNotifications((prev) =>
//               prev.map((item) => (item.id === n.id ? n : item))
//             );
//           } else if (payload.eventType === "DELETE" && o.receiver_id === currentUserId) {
//             setNotifications((prev) => prev.filter((item) => item.id !== o.id));
//           }
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Outside click closes dropdown
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Mark all as read
//   const markAllAsRead = async () => {
//     await supabase
//       .from("notifications")
//       .update({ is_read: true })
//       .eq("receiver_id", currentUserId)
//       .eq("is_read", false);
//   };

//   // Clear all notifications
//   const clearAllNotifications = async () => {
//     if (!window.confirm("Clear all notifications?")) return;
//     await supabase.from("notifications").delete().eq("receiver_id", currentUserId);
//     setNotifications([]);
//   };

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   return (
//     <div className="relative ml-4">
//       <button
//         onClick={() => {
//           setIsOpen(!isOpen);
//           if (!isOpen) markAllAsRead();
//         }}
//         className="relative text-white hover:text-yellow-300"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
//         >
//           {notifications.length > 0 && (
//             <button
//               onClick={clearAllNotifications}
//               className="text-xs text-red-500 hover:underline mb-2"
//             >
//               Clear All
//             </button>
//           )}

//           {notifications.length === 0 && (
//             <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
//           )}

//           {notifications.map((n) => (
//             <div
//               key={n.id}
//               className={`p-2 rounded transition cursor-pointer mb-1 ${
//                 n.is_read ? "bg-white text-gray-700" : "bg-blue-50 border-l-4 border-blue-400"
//               } hover:bg-gray-100`}
//             >
//               <p className="text-sm">{n.content}</p>
//               <span className="text-xs text-gray-400 block">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

































// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabaseClient";

// export default function Notifications({ currentUserId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch notifications function
//   const fetchNotifications = async () => {
//     const { data, error } = await supabase
//       .from("notifications")
//       .select("*")
//       .eq("receiver_id", currentUserId)
//       .order("created_at", { ascending: false });
//     if (!error) setNotifications(data || []);
//   };

//   // Initial fetch + subscribe to all changes
//   useEffect(() => {
//     if (!currentUserId) return;

//     fetchNotifications(); // initial load

//     const channel = supabase
//       .channel("public:notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "notifications" },
//         async () => {
//           // Refetch all notifications on any insert/update/delete
//           await fetchNotifications();
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Mark all as read
//   const markAllAsRead = async () => {
//     await supabase
//       .from("notifications")
//       .update({ is_read: true })
//       .eq("receiver_id", currentUserId)
//       .eq("is_read", false);
//   };

//   // Clear all notifications
//   const clearAllNotifications = async () => {
//     if (!window.confirm("Clear all notifications?")) return;

//     await supabase.from("notifications").delete().eq("receiver_id", currentUserId);
//     fetchNotifications(); // refetch after clearing
//   };

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   return (
//     <div className="relative ml-4">
//       <button
//         onClick={() => {
//           setIsOpen(!isOpen);
//           if (!isOpen) markAllAsRead();
//         }}
//         className="relative text-white hover:text-yellow-300"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
//         >
//           {notifications.length > 0 && (
//             <button
//               onClick={clearAllNotifications}
//               className="text-xs text-red-500 hover:underline mb-2"
//             >
//               Clear All
//             </button>
//           )}

//           {notifications.length === 0 && (
//             <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
//           )}

//           {notifications.map((n) => (
//             <div
//               key={n.id}
//               className={`p-2 rounded transition cursor-pointer mb-1 ${
//                 n.is_read ? "bg-white text-gray-700" : "bg-blue-50 border-l-4 border-blue-400"
//               } hover:bg-gray-100`}
//             >
//               <p className="text-sm">{n.content}</p>
//               <span className="text-xs text-gray-400 block">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }















// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabaseClient";

// export default function Notifications({ currentUserId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch notifications function
//   const fetchNotifications = async () => {
//     const { data, error } = await supabase
//       .from("notifications")
//       .select("*")
//       .eq("receiver_id", currentUserId)
//       .order("created_at", { ascending: false });
//     if (!error) setNotifications(data || []);
//   };

//   // Initial fetch + subscribe to all changes
//   useEffect(() => {
//     if (!currentUserId) return;

//     fetchNotifications(); // initial load

//     const channel = supabase
//       .channel("public:notifications")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "notifications" },
//         async () => {
//           // Refetch all notifications on any insert/update/delete
//           await fetchNotifications();
//         }
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [currentUserId]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Mark all as read
//   const markAllAsRead = async () => {
//     await supabase
//       .from("notifications")
//       .update({ is_read: true })
//       .eq("receiver_id", currentUserId)
//       .eq("is_read", false);
//   };

//   // Clear all notifications
//   const clearAllNotifications = async () => {
//     if (!window.confirm("Clear all notifications?")) return;

//     await supabase.from("notifications").delete().eq("receiver_id", currentUserId);
//     fetchNotifications(); // refetch after clearing
//   };

//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   return (
//     <div className="relative ml-4">
//       <button
//         onClick={() => {
//           setIsOpen(!isOpen);
//           if (!isOpen) markAllAsRead();
//         }}
//         className="relative text-white hover:text-yellow-300"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
//         >
//           {notifications.length > 0 && (
//             <button
//               onClick={clearAllNotifications}
//               className="text-xs text-red-500 hover:underline mb-2"
//             >
//               Clear All
//             </button>
//           )}

//           {notifications.length === 0 && (
//             <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
//           )}

//           {notifications.map((n) => (
//             <div
//               key={n.id}
//               className={`p-2 rounded transition cursor-pointer mb-1 ${
//                 n.is_read ? "bg-white text-gray-700" : "bg-blue-50 border-l-4 border-blue-400"
//               } hover:bg-gray-100`}
//             >
//               <p className="text-sm">{n.content}</p>
//               <span className="text-xs text-gray-400 block">
//                 {new Date(n.created_at).toLocaleString()}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


















// // import { useState, useEffect, useRef } from "react";
// // import { supabase } from "../../supabaseClient";

// // export default function Notifications({ currentUserId }) {
// //   const [notifications, setNotifications] = useState([]);
// //   const [isOpen, setIsOpen] = useState(false);
// //   const dropdownRef = useRef(null);

// //   // Fetch notifications (unread only)
// //   const fetchNotifications = async () => {
// //     const { data, error } = await supabase
// //       .from("notifications")
// //       .select("*")
// //       .eq("receiver_id", currentUserId)
// //       .order("created_at", { ascending: false });
// //     if (!error) setNotifications(data || []);
// //   };

// //   // Initial fetch + realtime subscription
// //   useEffect(() => {
// //     if (!currentUserId) return;

// //     fetchNotifications();

// //     const channel = supabase
// //       .channel("public:notifications")
// //       .on(
// //         "postgres_changes",
// //         { event: "*", schema: "public", table: "notifications" },
// //         () => {
// //           fetchNotifications(); // refetch on any change
// //         }
// //       )
// //       .subscribe();

// //     return () => supabase.removeChannel(channel);
// //   }, [currentUserId]);

// //   // Close dropdown on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (e) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
// //         setIsOpen(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // Mark all as read (soft delete from UI)
// //   const markAllAsRead = async () => {
// //     await supabase
// //       .from("notifications")
// //       .update({ is_read: true })
// //       .eq("receiver_id", currentUserId)
// //       .eq("is_read", false);

// //     setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
// //   };

// //   // Clear all notifications (hard delete)
// //   const clearAllNotifications = async () => {
// //     if (!window.confirm("Clear all notifications?")) return;

// //     await supabase.from("notifications").delete().eq("receiver_id", currentUserId);
// //     setNotifications([]);
// //   };

// //   const unreadCount = notifications.filter((n) => !n.is_read).length;

// //   return (
// //     <div className="relative ml-4">
// //       <button
// //         onClick={() => {
// //           setIsOpen(!isOpen);
// //           if (!isOpen) markAllAsRead();
// //         }}
// //         className="relative text-white hover:text-yellow-300"
// //       >
// //         🔔
// //         {unreadCount > 0 && (
// //           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
// //             {unreadCount}
// //           </span>
// //         )}
// //       </button>

// //       {isOpen && (
// //         <div
// //           ref={dropdownRef}
// //           className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
// //         >
// //           {notifications.length > 0 && (
// //             <button
// //               onClick={clearAllNotifications}
// //               className="text-xs text-red-500 hover:underline mb-2"
// //             >
// //               Clear All
// //             </button>
// //           )}

// //           {notifications.length === 0 && (
// //             <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
// //           )}

// //           {notifications.map((n) => (
// //             <div
// //               key={n.id}
// //               className={`p-2 rounded transition cursor-pointer mb-1 ${
// //                 n.is_read ? "bg-white text-gray-400" : "bg-blue-50 border-l-4 border-blue-400"
// //               } hover:bg-gray-100`}
// //             >
// //               <p className="text-sm">{n.content}</p>
// //               <span className="text-xs text-gray-400 block">
// //                 {new Date(n.created_at).toLocaleString()}
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }




















import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabaseClient";

export default function Notifications({ currentUserId, openChat }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications with sender profile info
  const fetchNotifications = async () => {
    if (!currentUserId) return;
    const { data, error } = await supabase
      .from("notifications")
      .select(`
        *,
        sender: sender_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("receiver_id", currentUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications(data || []);
  };

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!currentUserId) return;

    fetchNotifications(); // load notifications

    const channel = supabase
      .channel("public:notifications")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        (payload) => {
          console.log("Realtime notification event:", payload);
          // Refetch everything for simplicity
          fetchNotifications();
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUserId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark all as read
  const markAllAsRead = async () => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("receiver_id", currentUserId)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    await supabase.from("notifications").delete().eq("receiver_id", currentUserId);
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative ml-4">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllAsRead();
        }}
        className="relative text-white hover:text-yellow-300"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded p-2 z-50"
        >
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="text-xs text-red-500 hover:underline mb-2"
            >
              Clear All
            </button>
          )}

          {notifications.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-3">No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 rounded transition cursor-pointer mb-1 flex items-center ${
                n.is_read ? "bg-white text-gray-400" : "bg-blue-50 border-l-4 border-blue-400"
              } hover:bg-gray-100`}
              onClick={() => {
                if (n.type === "message" && n.sender) openChat(n.sender.id);
              }}
            >
              {n.sender?.avatar_url && (
                <img
                  src={n.sender.avatar_url}
                  alt={n.sender.full_name}
                  className="w-6 h-6 rounded-full mr-2"
                />
              )}
              <div className="flex-1">
                <p className="text-sm">
                  {n.type === "message"
                    ? `Message from ${n.sender?.full_name || "someone"}`
                    : n.content}
                </p>
                <span className="text-xs text-gray-400 block">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
