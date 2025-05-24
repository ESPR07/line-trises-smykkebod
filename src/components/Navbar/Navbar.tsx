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
        <li className={style.cartContainer}><span className={style.cartCount}>0</span></li>
      </ul>
    </nav>
    <ul className={`${style.navList} ${burgerToggle? style.open : style.close}`}>
      <li><Link to={"browse"} className={style.link}>Produkter</Link></li>
      <li><Link to={"about"} className={style.link}>Om Meg</Link></li>
      <li><Link to={"contact"} className={style.link}>Kontakt</Link></li>
    </ul>
    </>
  )
}

export default Navbar;