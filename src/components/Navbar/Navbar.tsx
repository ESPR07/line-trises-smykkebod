import { Link } from "react-router";
import style from "./Navbar.module.css";

function Navbar() {
  return(
    <nav>
      <Link className={style.navLogo} to={"/"}/>
      <ul className={style.navList}>
        <li>Produkter</li>
        <li>Om Meg</li>
        <li>Kontakt</li>
      </ul>
      <ul className={style.navInteractions}>
        <li className={style.cartContainer}><span className={style.cartCount}>1</span></li>
      </ul>
    </nav>
  )
}

export default Navbar;