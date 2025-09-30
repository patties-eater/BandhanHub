import { supabase } from "./src/supabaseClient";
async function test() {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: "<your_user_id>",
        receiver_id: "<other_user_id>",
        content: "Test call",
        type: "call_request",
        status: "pending",
        created_at: new Date().toISOString(),
      },
    ]);
  console.log(data, error);
}

test();
