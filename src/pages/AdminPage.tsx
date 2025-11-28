import { useState } from "react";
import style from "./AdminPage.module.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar/AdminSidebar";
import AdminDashboard from "../components/AdminComponents/AdminDashboard/AdminDashboard";
import { Database } from "../types/Database";
import { createClient } from "@supabase/supabase-js";
import { login } from "../API/login";
import { useAuthStatus } from "../API/useAuthStatus";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

function AdminPage() {
  const [currentActive, setCurrentActive] = useState<
    "dashboard" | "products" | "orders" | "settings"
  >("dashboard");
  const [loading, setLoading] = useState<boolean>(false);
  const {session} = useAuthStatus();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);

    const { data, error } = await login(email, password);

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();

  };

  if(!session) {
    return(
      <main>
        <h1>Login Screen</h1>
        <button
          onClick={() => {
            handleLogin("sinder009@gmail.com", "1ngv1ldErCute");
          }}
          disabled={loading}
        >
          Login Test
        </button>
      </main>
    )
  }

  return (
    <main className={style.adminPageContainer}>
      <AdminSidebar
        currentActive={currentActive}
        setCurrentActive={setCurrentActive}
        logout={handleLogout}
      />
      <section className={style.adminContentContainer}>
        {currentActive === "dashboard" && <AdminDashboard />}
        {currentActive === "products" && <h2>Products Content</h2>}
        {currentActive === "orders" && <h2>Orders Content</h2>}
        {currentActive === "settings" && <h2>Settings Page</h2>}
      </section>
    </main>
  );
}

export default AdminPage;
