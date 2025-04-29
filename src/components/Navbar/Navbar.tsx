import { Link } from "react-router";
import style from "./Navbar.module.css";
import { useState } from "react";

function Navbar() {
  const [burgerToggle, setBurgerToggle] = useState<boolean>(false);

  return(
    <>
    <nav>
      <Link className={style.navLogo} to={"/"}/>
      <div className={style.burgerIcon} onClick={() => {setBurgerToggle(!burgerToggle)}}></div>
      <ul className={style.navInteractions}>
        <li className={style.cartContainer}><span className={style.cartCount}>1</span></li>
      </ul>
    </nav>
    <ul className={`${style.navList} ${burgerToggle? style.open : style.close}`}>
      <li>Produkter</li>
      <li>Om Meg</li>
      <li>Kontakt</li>
    </ul>
    </>
  )
}

export default Navbar;