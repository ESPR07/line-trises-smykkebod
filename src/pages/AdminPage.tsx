import { useState } from "react";
import style from "./AdminPage.module.css";
import AdminSidebar from "../components/AdminComponents/AdminSidebar/AdminSidebar";
import AdminDashboard from "../components/AdminComponents/AdminDashboard/AdminDashboard";

function AdminPage() {
  const [currentActive, setCurrentActive] = useState<"dashboard" | "products" | "orders" | "settings">("dashboard");


  return (
    <main className={style.adminPageContainer}>
      <AdminSidebar currentActive={currentActive} setCurrentActive={setCurrentActive} />
      <section className={style.adminContentContainer}>
        {currentActive === "dashboard" && <AdminDashboard/>}
        {currentActive === "products" && <h2>Products Content</h2>}
        {currentActive === "orders" && <h2>Orders Content</h2>}
        {currentActive === "settings" && <h2>Settings Page</h2>}
      </section>
    </main>
  );
}

export default AdminPage;
