import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../components/utils/supabaseClient";

export function useAuthStatus() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Failed to get session:", error.message);
      } else {
        setSession(data.session);
      }
      setLoading(false);
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

  return { session, loading };
}
