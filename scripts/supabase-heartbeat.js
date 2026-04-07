/* eslint-env node */
/* global process */
import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function runHeartbeat() {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";
  const table = process.env.SUPABASE_HEARTBEAT_TABLE || "profiles";
  const column = process.env.SUPABASE_HEARTBEAT_COLUMN || "id";

  if (!supabaseKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY for heartbeat auth."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const startedAt = new Date().toISOString();
  console.log(`[heartbeat] Starting at ${startedAt}`);
  console.log(`[heartbeat] Querying ${table}.${column}`);

  const { count, error } = await supabase
    .from(table)
    .select(column, { count: "exact", head: true })
    .limit(1);

  if (error) {
    throw new Error(
      `Heartbeat failed for ${table}.${column}: ${error.message} (${error.code || "no_code"})`
    );
  }

  console.log(
    `[heartbeat] Success at ${new Date().toISOString()} - row count observed: ${count ?? "unknown"}`
  );
}

runHeartbeat().catch((error) => {
  console.error("[heartbeat] Error:", error.message);
  process.exitCode = 1;
});
