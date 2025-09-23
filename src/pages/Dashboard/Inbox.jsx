

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

export default function Inbox() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1️⃣ Fetch logged-in user and profile
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const loggedInUser = sessionData?.session?.user;
        if (!loggedInUser) {
          navigate("/"); // redirect if not logged in
          return;
        }

        setUser(loggedInUser);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", loggedInUser.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
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
          .select("sender_id, receiver_id, content, created_at")
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) throw messagesError;

        // Unique IDs of other users
        const otherUserIds = Array.from(
          new Set(
            messagesData.map(m => (m.sender_id === user.id ? m.receiver_id : m.sender_id))
          )
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

        setChatUsers(usersData || []);
      } catch (err) {
        console.error("Error fetching previous chat users:", err);
      }
    }

    fetchChatUsers();
  }, [user]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!user || !profile) return <div className="p-4 text-red-500">User not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messages Inbox</h2>
      {chatUsers.length === 0 ? (
        <p>No previous chats yet</p>
      ) : (
        <ul>
          {chatUsers.map(u => (
            <li key={u.id} className="mb-3">
              <Link
                to={`/dashboard/messages/${u.id}`}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <img
                  src={u.avatar_url || "/default-avatar.png"}
                  alt={u.full_name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-pink-600">{u.full_name}</h3>
                  <p className="text-sm text-gray-500">Last message preview...</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
