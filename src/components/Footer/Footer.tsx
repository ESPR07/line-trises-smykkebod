import { Link } from "react-router";
import style from "./Footer.module.css"

function Footer() {
  return (
    <footer className={style.footerContainer}>
      <Link className={style.logo} to={"/"}/>
      <ul className={style.logoList}>
        <li><Link className={`${style.socials} ${style.instagram}`} to={"#"}/></li>
        <li><Link className={`${style.socials} ${style.facebook}`} to={"#"}/></li>
        <li><Link className={`${style.socials} ${style.twitter}`} to={"#"}/></li>
      </ul>
      <span className={style.divider}></span>
      <p>Nettside utviklet av Sindre Strømsæther Derås</p>
    </footer>
  )
}

export default Footer;