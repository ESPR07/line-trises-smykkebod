import { Link } from "react-router";
import style from "./Footer.module.css"
function Footer() {
  return (
    <footer className={style.footerContainer}>
      <Link aria-label="Home Link" className={style.logo} to={"/"}/>
      <ul className={style.logoList}>
        <li><Link aria-label="Instagram Link" className={`${style.socials} ${style.instagram}`} to={"#"}/></li>
        <li><Link aria-label="Facebook Link" className={`${style.socials} ${style.facebook}`} to={"#"}/></li>
      </ul>
      <div className={style.footerNav}>
        <Link to="/retur-og-angrerett" className={style.footerLink}>
          Retur og angrerett
        </Link>
      </div>
      <span className={style.divider}></span>
      <p>Nettside utviklet av Sindre Strømsæther Derås</p>
    </footer>
  )
}
export default Footer;