import { createClient } from "@supabase/supabase-js";
import { Database } from "../../@types/Database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

export const supabaseServiceClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);