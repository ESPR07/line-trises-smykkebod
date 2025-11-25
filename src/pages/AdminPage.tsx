import { useState, useRef, useEffect } from "react";
import DashboardIcon from "../assets/svg_components/DashboardIcon";
import OrdersIcon from "../assets/svg_components/OrdersIcon";
import ProductsIcon from "../assets/svg_components/ProductsIcon";
import style from "./AdminPage.module.css";

function AdminPage() {
  const [currentActive, setCurrentActive] = useState<"dashboard" | "products" | "orders">("dashboard");
  const [highlightTop, setHighlightTop] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(0);

  const liRefs = {
    dashboard: useRef<HTMLLIElement>(null),
    products: useRef<HTMLLIElement>(null),
    orders: useRef<HTMLLIElement>(null),
  };

 useEffect(() => {
  const currentLi = liRefs[currentActive].current;
  if (currentLi) {
    setHighlightTop(currentLi.offsetTop);
    setHighlightHeight(currentLi.offsetHeight);
  }
}, [currentActive]);


  return (
    <main className={style.adminPageContainer}>
      <section className={style.adminSidebarContainer}>
        <h1>Line Trise's Smykkebod</h1>
        <ul>
          {/* Highlight box */}
          <div
            className={style.activeHighlight}
            style={{ top: highlightTop, height: highlightHeight }}
          />
          {/* Existing li elements untouched */}
          <li className={currentActive === "dashboard" ? style.activeAdminLink : ""} ref={liRefs.dashboard} onClick={() => setCurrentActive("dashboard")}>
            <DashboardIcon/>
            Dashboard
          </li>
          <li className={currentActive === "products" ? style.activeAdminLink : ""} ref={liRefs.products} onClick={() => setCurrentActive("products")}>
            <ProductsIcon/>
            Produkter
          </li>
          <li className={currentActive === "orders" ? style.activeAdminLink : ""} ref={liRefs.orders} onClick={() => setCurrentActive("orders")}>
            <OrdersIcon/>
            Ordrer
          </li>
        </ul>
      </section>
      <section className={style.adminContentContainer}>
        {currentActive === "dashboard" && <h2>Dashboard Content</h2>}
        {currentActive === "products" && <h2>Products Content</h2>}
        {currentActive === "orders" && <h2>Orders Content</h2>}
      </section>
    </main>
  );
}

export default AdminPage;
