import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/Database";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export async function login(email: string, password: string) {
  return await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
}
