// import Navbar from "../../components/Navbar";
// import ChatBox from "../../components/ChatBox";

// export default function Messages() {
//   const user = { name: "Anisha", image: "https://i.pravatar.cc/100?img=5" };

//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />
//       <div className="flex-1">
//         <ChatBox user={user} />
//       </div>
//     </div>
//   );
// }



// import { useParams } from "react-router-dom";

// export default function Messages() {
//   const { id } = useParams();
//   return <div className="p-6">Chat with user {id}</div>;
// }




// src/pages/Messages.jsx





import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Navbar from "../../components/Navbar";
import ChatBox from "../../components/ChatBox";

export default function Messages() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      setUser({
        id: data.id,
        name: data.full_name,
        image:
          data.avatar_url ||
          `https://api.dicebear.com/8.x/avataaars/svg?seed=${data.full_name}`,
      });
    }

    fetchUser();
  }, [id]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    );

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ChatBox user={user} />
      </div>
    </div>
  );
}
