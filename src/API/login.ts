import { supabaseClient } from "../components/utils/supabaseClient";

export async function login(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
