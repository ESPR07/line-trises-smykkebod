import { useEffect, useRef, useState } from "react";
import DashboardIcon from "../../../assets/svg_components/DashboardIcon";
import OrdersIcon from "../../../assets/svg_components/OrdersIcon";
import ProductsIcon from "../../../assets/svg_components/ProductsIcon";
import style from "./AdminSidebar.module.css";
import EventButton from "../../utils/EventButton/EventButton";
import SettingsIcon from "../../../assets/svg_components/SettingsIcon";

interface AdminSidebarProps {
  currentActive: "dashboard" | "products" | "orders" | "settings";
  setCurrentActive: React.Dispatch<
    React.SetStateAction<"dashboard" | "products" | "orders" | "settings">
  >;
  logout: any
}

function AdminSidebar({ currentActive, setCurrentActive, logout }: AdminSidebarProps) {
  const [highlightTop, setHighlightTop] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(0);

  const liRefs = {
    dashboard: useRef<HTMLLIElement>(null),
    products: useRef<HTMLLIElement>(null),
    orders: useRef<HTMLLIElement>(null),
    settings: useRef<HTMLLIElement>(null),
  };

  useEffect(() => {
    const currentLi = liRefs[currentActive].current;
    if (currentLi) {
      setHighlightTop(currentLi.offsetTop);
      setHighlightHeight(currentLi.offsetHeight);
    }
  }, [currentActive]);

  return (
    <>
      <section className={style.adminSidebarContainer}>
        <article className={style.adminSidebarContent}>
          <h1>Line Trise's Smykkebod</h1>
          <ul>
            {/* Highlight box */}
            <div
              className={style.activeHighlight}
              style={{ top: highlightTop, height: highlightHeight }}
            />
            <li
              className={
                currentActive === "dashboard" ? style.activeAdminLink : ""
              }
              ref={liRefs.dashboard}
              onClick={() => setCurrentActive("dashboard")}
            >
              <DashboardIcon />
              Dashboard
            </li>
            <li
              className={
                currentActive === "products" ? style.activeAdminLink : ""
              }
              ref={liRefs.products}
              onClick={() => setCurrentActive("products")}
            >
              <ProductsIcon />
              Produkter
            </li>
            <li
              className={
                currentActive === "orders" ? style.activeAdminLink : ""
              }
              ref={liRefs.orders}
              onClick={() => setCurrentActive("orders")}
            >
              <OrdersIcon />
              Ordre
            </li>
            <li
              className={
                currentActive === "settings" ? style.activeAdminLink : ""
              }
              ref={liRefs.settings}
              onClick={() => setCurrentActive("settings")}
            >
              <SettingsIcon/>
              Instillinger
            </li>
          </ul>
        </article>
        <article className={style.adminSidebarInteractions}>
          <EventButton
            text="Logg Ut"
            event={() => {
              logout();
            }}
            buttonWidth={40}
          />
        </article>
      </section>
    </>
  );
}

export default AdminSidebar;
