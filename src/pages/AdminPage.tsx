import { useState } from "react";
import style from "./AdminPage.module.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar/AdminSidebar";
import AdminDashboard from "../components/AdminComponents/AdminDashboard/AdminDashboard";
import { Database } from "../types/Database";
import { createClient } from "@supabase/supabase-js";
import { useAuthStatus } from "../API/useAuthStatus";
import AdminLogin from "../components/AdminComponents/AdminLogin/AdminLogin";
import AdminTopBar from "../components/AdminComponents/AdminTopBar/AdminTopBar";
import AdminProducts from "../components/AdminComponents/AdminProducts/AdminProducts";

const supabaseURL: string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey: string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

function AdminPage() {
  const [currentActive, setCurrentActive] = useState<
    "dashboard" | "products" | "orders" | "settings"
  >("dashboard");
  const {session} = useAuthStatus();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();

  };

  if(!session) {
    return(
      <AdminLogin/>
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
        <AdminTopBar/>
        {currentActive === "dashboard" && <AdminDashboard />}
        {currentActive === "products" && <AdminProducts/>}
        {currentActive === "orders" && <h2>Orders Content</h2>}
        {currentActive === "settings" && <h2>Settings Page</h2>}
      </section>
    </main>
  );
}

export default AdminPage;
