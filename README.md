# BandhanHub

## Supabase heartbeat

This repo includes a small scheduled heartbeat to help keep a low-traffic Supabase Free project from going inactive.

Files:

- `.github/workflows/supabase-heartbeat.yml`
- `scripts/supabase-heartbeat.js`

What it does:

- Runs on GitHub Actions every Monday and Thursday at 03:17 UTC
- Connects to Supabase
- Performs a lightweight read against a configured table

Recommended GitHub repository secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_HEARTBEAT_TABLE`
- `SUPABASE_HEARTBEAT_COLUMN`

Fallback secret:

- `SUPABASE_ANON_KEY`

Recommended values:

- `SUPABASE_HEARTBEAT_TABLE=profiles`
- `SUPABASE_HEARTBEAT_COLUMN=id`

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is the most reliable option because it avoids heartbeat failures caused by RLS policies.
- If you use `SUPABASE_ANON_KEY`, the selected table must still be readable for the query to succeed.
- Supabase does not guarantee that a heartbeat will always prevent inactivity pauses, but this is a practical low-maintenance approach for low-traffic projects.

Run locally:

```bash
npm run heartbeat
```
