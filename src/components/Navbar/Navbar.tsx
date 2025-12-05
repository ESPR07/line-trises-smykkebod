import { Link, useNavigate } from "react-router";
import style from "./Navbar.module.css";
import { useContext, useEffect, useState } from "react";
import { Cart, CartContext } from "../../App";
import { initialValue } from "../../Reducers/cartInteractions";

function Navbar() {
  const [burgerToggle, setBurgerToggle] = useState<boolean>(false);
  const [currentCart, setCurrentCart] = useState<Cart>(initialValue);
  const { state } = useContext(CartContext);

  useEffect(() => {
    setCurrentCart(state);
  }, [state]);

  const numberOfItems =
    currentCart.productList !== undefined
      ? currentCart.productList
          .map((product) => product.quantity)
          .reduce((a, b) => a + b, 0)
      : 0;

  const navigate = useNavigate();

  function navigateCart() {
    navigate("/cart");
  }

  return (
    <header>
      <nav>
        <Link className={style.navLogo} to={"/"} aria-label="Home Link"/>
        <div
          className={style.burgerIcon}
          onClick={() => {
            setBurgerToggle(!burgerToggle);
          }}
        ></div>
        <ul className={style.navInteractions}>
          <li className={style.cartContainer} onClick={navigateCart}>
            <span className={style.cartCount}>{numberOfItems}</span>
          </li>
        </ul>
      </nav>
      <ul
        className={`${style.navList} ${
          burgerToggle ? style.open : style.close
        }`}
      >
        <li>
          <Link to={"browse"} className={style.link}>
            Produkter
          </Link>
        </li>
        <li>
          <Link to={"about"} className={style.link}>
            Om Meg
          </Link>
        </li>
        <li>
          <Link to={"contact"} className={style.link}>
            Kontakt
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
