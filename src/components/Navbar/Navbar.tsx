import { Link, useNavigate } from "react-router";
import style from "./Navbar.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { Cart, CartContext } from "../../App";
import { initialValue } from "../../Reducers/cartInteractions";

function Navbar() {
  const [burgerToggle, setBurgerToggle] = useState<boolean>(false);
  const [currentCart, setCurrentCart] = useState<Cart>(initialValue);
  const { state } = useContext(CartContext);
  const navRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentCart(state);
  }, [state]);

  const numberOfItems =
    currentCart.productList?.reduce((sum, product) => sum + product.quantity, 0) ?? 0;

  const navigateCart = () => navigate("/handlekurv");

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        burgerToggle && 
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).classList.contains(style.burgerIcon)
      ) {
        setBurgerToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [burgerToggle]);

  // Close navbar when navigating via link
  const handleLinkClick = () => setBurgerToggle(false);

  return (
    <header>
      <nav>
        <Link className={style.navLogo} to={"/"} aria-label="Home Link" onClick={handleLinkClick} />
        <div
          className={style.burgerIcon}
          onClick={() => setBurgerToggle(!burgerToggle)}
        ></div>
        <ul className={style.navInteractions}>
          <li className={style.cartContainer} onClick={navigateCart}>
            <span className={style.cartCount}>{numberOfItems}</span>
          </li>
        </ul>
      </nav>

      <ul
        ref={navRef}
        className={`${style.navList} ${burgerToggle ? style.open : style.close}`}
      >
        <li>
          <Link to={"produkter"} className={style.link} onClick={handleLinkClick}>
            Produkter
          </Link>
        </li>
        <li>
          <Link to={"om-meg"} className={style.link} onClick={handleLinkClick}>
            Om Meg
          </Link>
        </li>
        <li>
          <Link to={"kontakt"} className={style.link} onClick={handleLinkClick}>
            Kontakt
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
