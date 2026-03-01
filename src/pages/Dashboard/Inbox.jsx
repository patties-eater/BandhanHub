// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import { Link, useNavigate } from "react-router-dom";

// export default function Inbox() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [chatUsers, setChatUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchUser() {
//       setLoading(true);
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession();
//         if (error) throw error;
//         if (!session?.user) return navigate("/");

//         setUser(session.user);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchUser();
//   }, [navigate]);

//   useEffect(() => {
//     if (!user) return;

//     async function fetchChatUsers() {
//       try {
//         const { data: messages } = await supabase
//           .from("messages")
//           .select("sender_id, receiver_id, message, created_at")
//           .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//           .order("created_at", { ascending: false });

//         const otherUserIds = Array.from(
//           new Set(messages.map(m => (m.sender_id === user.id ? m.receiver_id : m.sender_id)))
//         );

//         if (!otherUserIds.length) return setChatUsers([]);

//         const { data: profiles } = await supabase
//           .from("profiles")
//           .select("id, full_name, avatar_url")
//           .in("id", otherUserIds);

//         setChatUsers(profiles || []);
//       } catch (err) {
//         console.error("Error fetching chat users:", err);
//       }
//     }

//     fetchChatUsers();
//   }, [user]);

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (!user) return <div className="p-4">No user found</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Inbox</h2>
//       {chatUsers.length === 0 ? (
//         <p>No previous chats yet</p>
//       ) : (
//         <ul>
//           {chatUsers.map(u => (
//             <li key={u.id} className="flex items-center mb-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
//               <img
//                 src={u.avatar_url || "/default-avatar.png"}
//                 alt={u.full_name}
//                 className="w-10 h-10 rounded-full mr-3 object-cover"
//               />
//               <div className="flex-1">
//                 <Link
//                   to={`/dashboard/messages/${u.id}`}
//                   className="font-semibold text-pink-600 hover:underline"
//                 >
//                   {u.full_name}
//                 </Link>
//                 <p className="text-sm text-gray-500">Last message preview...</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // src/components/Inbox.jsx
// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import { Link, useNavigate } from "react-router-dom";

// export default function Inbox() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [chatUsers, setChatUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch logged-in user
//   useEffect(() => {
//     async function fetchUser() {
//       const { data: sessionData } = await supabase.auth.getSession();
//       const loggedInUser = sessionData?.session?.user;
//       if (!loggedInUser) return navigate("/");
//       setUser(loggedInUser);
//     }
//     fetchUser();
//   }, [navigate]);

//   // Fetch users you’ve previously chatted with
//   useEffect(() => {
//     if (!user) return;

//     async function fetchChatUsers() {
//       const { data: messages } = await supabase
//         .from("messages")
//         .select("sender_id, receiver_id, content, created_at")
//         .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//         .order("created_at", { ascending: false });

//       if (!messages?.length) {
//         setChatUsers([]);
//         setLoading(false);
//         return;
//       }

//       const otherUserIds = Array.from(
//         new Set(
//           messages.map(m => (m.sender_id === user.id ? m.receiver_id : m.sender_id))
//         )
//       );

//       const { data: users } = await supabase
//         .from("profiles")
//         .select("id, full_name, avatar_url")
//         .in("id", otherUserIds);

//       const chatList = users.map(u => {
//         const lastMsg = messages.find(
//           m => m.sender_id === u.id || m.receiver_id === u.id
//         );
//         return { ...u, lastMessage: lastMsg?.content };
//       });

//       setChatUsers(chatList);
//       setLoading(false);
//     }

//     fetchChatUsers();
//   }, [user]);

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (!user) return <div className="p-4">User not found</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Inbox</h2>
//       {chatUsers.length === 0 ? (
//         <p>No previous chats yet</p>
//       ) : (
//         <ul>
//           {chatUsers.map(u => (
//             <li key={u.id} className="flex items-center mb-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
//               <img src={u.avatar_url || "/default-avatar.png"} alt={u.full_name} className="w-10 h-10 rounded-full mr-3 object-cover" />
//               <div className="flex-1">
//                 <Link to={`/dashboard/messages/${u.id}`} className="font-semibold text-pink-600 hover:underline">
//                   {u.full_name}
//                 </Link>
//                 <p className="text-sm text-gray-500">{u.lastMessage || "No message yet"}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // src/pages/Dashboard/Inbox.jsx
// import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
// import { Link, useNavigate } from "react-router-dom";

// export default function Inbox() {
//   const [chatUsers, setChatUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch current logged-in user
//   useEffect(() => {
//     async function fetchUser() {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (error || !user) return navigate("/"); // redirect if not logged in
//       setCurrentUser(user);
//     }
//     fetchUser();
//   }, [navigate]);

//   // Fetch users you’ve previously chatted with
//   useEffect(() => {
//     if (!currentUser) return;

//     async function fetchChatUsers() {
//       try {
//         const { data: messagesData, error } = await supabase
//           .from("messages")
//           .select("sender_id, receiver_id, created_at")
//           .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
//           .order("created_at", { ascending: false });

//         if (error) throw error;

//         const otherUserIds = Array.from(
//           new Set(
//             messagesData.map(m => (m.sender_id === currentUser.id ? m.receiver_id : m.sender_id))
//           )
//         );

//         if (otherUserIds.length === 0) {
//           setChatUsers([]);
//           setLoading(false);
//           return;
//         }

//         // Fetch profiles of other users
//         const { data: profiles, error: profileError } = await supabase
//           .from("profiles")
//           .select("id, full_name, avatar_url")
//           .in("id", otherUserIds);

//         if (profileError) throw profileError;

//         setChatUsers(profiles || []);
//       } catch (err) {
//         console.error("Error fetching chat users:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchChatUsers();
//   }, [currentUser]);

//   if (loading) return <div className="p-4">Loading...</div>;

//   if (chatUsers.length === 0)
//     return <div className="p-4">No previous chats yet</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Inbox</h2>
//       <ul>
//         {chatUsers.map(user => (
//           <li
//             key={user.id}
//             className="flex items-center mb-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
//           >
//             <img
//               src={user.avatar_url || "/default-avatar.png"}
//               alt={user.full_name}
//               className="w-10 h-10 rounded-full mr-3 object-cover"
//             />
//             <div className="flex-1">
//               <Link
//                 to={`/dashboard/messages/${user.id}`}
//                 className="font-semibold text-pink-600 hover:underline"
//               >
//                 {user.full_name}
//               </Link>
//               <p className="text-sm text-gray-500">Click to open chat</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// src/pages/Dashboard/Inbox.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

export default function Inbox() {
  const [user, setUser] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const navigate = useNavigate();

  // 1️⃣ Fetch logged-in user and profile
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const loggedInUser = sessionData?.session?.user;
        if (!loggedInUser) {
          navigate("/"); // redirect if not logged in
          return;
        }

        setUser(loggedInUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  // 2️⃣ Fetch users you’ve previously chatted with
  useEffect(() => {
    if (!user) return;

    async function fetchChatUsers() {
      try {
        // Get all messages where current user is sender or receiver
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(
            "sender_id, receiver_id, content, created_at, audio_url, type",
          )
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) throw messagesError;

        // Unique IDs of other users
        const otherUserIds = Array.from(
          new Set(
            messagesData.map((m) =>
              m.sender_id === user.id ? m.receiver_id : m.sender_id,
            ),
          ),
        );

        if (otherUserIds.length === 0) {
          setChatUsers([]);
          return;
        }

        // Fetch profiles of those users
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url")
          .in("id", otherUserIds);

        if (usersError) throw usersError;

        // Map users with their last message details
        const usersWithDetails = usersData.map((u) => {
          const lastMsg = messagesData.find(
            (m) =>
              (m.sender_id === u.id && m.receiver_id === user.id) ||
              (m.sender_id === user.id && m.receiver_id === u.id),
          );

          let preview = "Start chatting";
          if (lastMsg) {
            if (lastMsg.type === "call_request") preview = "📞 Call Request";
            else if (lastMsg.audio_url) preview = "🎤 Voice Message";
            else preview = lastMsg.content;
          }

          return {
            ...u,
            lastMessage: preview,
            lastMessageTime: lastMsg?.created_at,
          };
        });

        // Sort by most recent message
        setChatUsers(
          usersWithDetails.sort(
            (a, b) =>
              new Date(b.lastMessageTime || 0) -
              new Date(a.lastMessageTime || 0),
          ),
        );
      } catch (err) {
        console.error("Error fetching previous chat users:", err);
      }
    }

    fetchChatUsers();
  }, [user]);

  // 3️⃣ Subscribe to presence (Online Status)
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        const ids = new Set(Object.keys(newState));
        setOnlineUsers(ids);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const filteredUsers = chatUsers.filter((u) =>
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <Spinner className="w-10 h-10 text-pink-600" />
      </div>
    );
  if (!user) return <div className="p-4 text-red-500">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Messages</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition shadow-sm"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No conversations found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((u) => (
            <Link
              key={u.id}
              to={`/dashboard/messages/${u.id}`}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={u.avatar_url || "/default-avatar.png"}
                    alt={u.full_name}
                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                  />
                  {onlineUsers.has(u.id) && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                      {u.full_name}
                    </h3>
                    {u.lastMessageTime && (
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatTime(u.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {u.lastMessage}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay && now.getDate() === date.getDate()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diff < oneDay * 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
