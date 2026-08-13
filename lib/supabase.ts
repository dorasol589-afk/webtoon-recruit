import { createClient, SupabaseClient } from "@supabase/supabase-js";

let anonClient: SupabaseClient | null = null;

/** anon key를 쓰는 클라이언트 (읽기 + job_posting_applications 쓰기만 허용됨) */
export function getSupabaseAnon(): SupabaseClient {
  if (anonClient) return anonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 필요합니다.");
  }
  anonClient = createClient(url, key, { auth: { persistSession: false } });
  return anonClient;
}
