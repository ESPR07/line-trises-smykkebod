import { useEffect, useRef, useState } from "react";
import DashboardIcon from "../../../assets/svg_components/DashboardIcon";
import OrdersIcon from "../../../assets/svg_components/OrdersIcon";
import ProductsIcon from "../../../assets/svg_components/ProductsIcon";
import style from "./AdminSidebar.module.css";
import EventButton from "../../utils/EventButton/EventButton";
import SettingsIcon from "../../../assets/svg_components/SettingsIcon";
import LogoutIcon from "../../../assets/svg_components/LogoutIcon";

interface AdminSidebarProps {
  currentActive: "dashboard" | "products" | "orders" | "settings";
  setCurrentActive: React.Dispatch<
    React.SetStateAction<"dashboard" | "products" | "orders" | "settings">
  >;
  logout: () => Promise<void>;
}

function AdminSidebar({ currentActive, setCurrentActive, logout }: AdminSidebarProps) {
  const [highlightTop, setHighlightTop] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
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

  const handleMenuItemClick = (item: "dashboard" | "products" | "orders" | "settings") => {
    setCurrentActive(item);
    setIsOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className={`${style.mobileToggle} ${isOpen ? style.burgerHide : style.burgerShow}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className={style.overlay} onClick={() => setIsOpen(false)} />}

      <section className={`${style.adminSidebarContainer} ${isOpen ? style.open : ''}`}>
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
              onClick={() => handleMenuItemClick("dashboard")}
            >
              <DashboardIcon />
              Dashboard
            </li>
            <li
              className={
                currentActive === "products" ? style.activeAdminLink : ""
              }
              ref={liRefs.products}
              onClick={() => handleMenuItemClick("products")}
            >
              <ProductsIcon />
              Produkter
            </li>
            <li
              className={
                currentActive === "orders" ? style.activeAdminLink : ""
              }
              ref={liRefs.orders}
              onClick={() => handleMenuItemClick("orders")}
            >
              <OrdersIcon />
              Bestillinger
            </li>
            <li
              className={
                currentActive === "settings" ? style.activeAdminLink : ""
              }
              ref={liRefs.settings}
              onClick={() => handleMenuItemClick("settings")}
            >
              <SettingsIcon/>
              Instillinger
            </li>
          </ul>
        </article>
        <article className={style.adminSidebarInteractions}>
          <LogoutIcon/>
          <EventButton
            text="Logg Ut"
            event={() => {
              logout();
            }}
            buttonWidth={40}
            checkBox={false}
          />
        </article>
      </section>
    </>
  );
}

export default AdminSidebar;