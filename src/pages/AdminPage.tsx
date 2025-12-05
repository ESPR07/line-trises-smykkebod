import { useState } from "react";
import style from "./AdminPage.module.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar/AdminSidebar";
import AdminDashboard from "../components/AdminComponents/AdminDashboard/AdminDashboard";
import AdminLogin from "../components/AdminComponents/AdminLogin/AdminLogin";
import AdminTopBar from "../components/AdminComponents/AdminTopBar/AdminTopBar";
import AdminProducts from "../components/AdminComponents/AdminProducts/AdminProducts";
import { useAuthStatus } from "../API/useAuthStatus";
import { supabaseClient } from "../components/utils/supabaseClient";
import AdminOrders from "../components/AdminComponents/AdminOrders/AdminOrders";

function AdminPage() {
  const [currentActive, setCurrentActive] = useState<
    "dashboard" | "products" | "orders" | "settings"
  >("dashboard");

  const { session } = useAuthStatus();

  const handleLogout = async (): Promise<void> => {
    try {
      await supabaseClient.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!session) return <AdminLogin />;

  return (
    <>
      <title>Adminpanel - Line Trises Smykkebod</title>
      <meta name="description" content="Intern administrasjon av produkter og ordre."/>
      <meta name="robots" content="noindex, nofollow" />
      <main className={style.adminPageContainer}>
        <AdminSidebar
          currentActive={currentActive}
          setCurrentActive={setCurrentActive}
          logout={handleLogout}
        />
        <section className={style.adminContentContainer}>
          <AdminTopBar />
          {currentActive === "dashboard" && <AdminDashboard />}
          {currentActive === "products" && <AdminProducts />}
          {currentActive === "orders" && <AdminOrders/>}
          {currentActive === "settings" && <h2>Settings Page</h2>}
        </section>
      </main>
    </>
  );
}

export default AdminPage;
