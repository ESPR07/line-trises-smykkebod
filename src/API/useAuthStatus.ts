import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../components/utils/supabaseClient";

export function useAuthStatus() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Failed to get session:", error.message);
      } else {
        setSession(session);
      }
    });

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { session };
}
