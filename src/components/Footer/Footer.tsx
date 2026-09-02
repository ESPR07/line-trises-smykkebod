import { Link } from "react-router";
import style from "./Footer.module.css";
function Footer() {
  return (
    <footer className={style.footerContainer}>
      <div className={style.sectionWrapper}>
        <div className={style.paymentInfoSection}>
          <p className={style.paymentInfoHeader}>KUNDESERVICE</p>
          <ul>
            <Link to={"/om-meg"} className={style.listPoint}>
              Om Meg
            </Link>
            <Link to={"/retur-og-angrerett"} className={style.listPoint}>
              Retur og Angrerett
            </Link>
            <Link to={"/kontakt"} className={style.listPoint}>
              Kontakt
            </Link>
          </ul>
        </div>
        <div className={style.middleSection}>
          <Link aria-label="Home Link" className={style.logo} to={"/"} />
          <p className={style.footerSellerInfo}>
            Håndlagde smykker med særpreg, formet i resin og glass. Laget i
            Norge
          </p>
          <ul className={style.logoList}>
            {/* <li><Link aria-label="Instagram Link" className={`${style.socials} ${style.instagram}`} to={"#"}/></li> */}
            <li>
              <Link
                aria-label="Facebook Link"
                className={`${style.socials} ${style.facebook}`}
                target="_blank"
                to={"https://www.facebook.com/profile.php?id=61588272663749"}
              />
            </li>
          </ul>
        </div>
        <div className={style.paymentSafetySection}>
          <p className={style.paymentSafetyHeader}>TRYGG HANDEL</p>
          <ul className={style.pointList}>
            <li className={style.safetyPoint}>✔ Håndlaget i Norge</li>
            <li className={style.safetyPoint}>✔ 14 Dagers Retur</li>
            <li className={style.safetyPoint}>✔ Rask Levering</li>
          </ul>
          <ul className={style.paymentList}>
            <li className={style.klarna}></li>
            <li className={style.visa}></li>
            <li className={style.mastercard}></li>
          </ul>
        </div>
      </div>
      <span className={style.divider}></span>
      <p>
        © 2026 LT Kunstsmykker. Nettside utviklet av{" "}
        {
          <Link
            aria-label="Utvikler Informasjon"
            className={style.contribution}
            target="_blank"
            to={"https://sindrestromsaether.dev"}
          >
            Sindre Strømsæther Derås
          </Link>
        }
      </p>
    </footer>
  );
}
export default Footer;
