import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True when the .env values are present. The app shows a setup banner if not.
export const isConfigured = Boolean(url && key);

// createClient throws on empty values, so fall back to placeholders.
export const supabase = createClient(
  url ?? "http://localhost:54321",
  key ?? "missing-anon-key"
);
