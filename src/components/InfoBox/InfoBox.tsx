import NavigationButton from "../utils/Button/NavigationButton";
import style from "./InfoBox.module.css"

function InfoBox() {
  return(
    <section className={style.infoBoxContainer}>
      <h3 className={style.infoHeader}>Om Smykkene Mine</h3>
      <span className={style.infoDivider}></span>
      <article className={style.infoContentContainer}>
        <img src="/images/aboutMain.webp" alt="Info Image" className={style.infoImage}/>
        <div className={style.infoTextContainer}>
          <p className={style.infoText}>Materialene jeg bruker er sølv, glass og resin. Jeg bruker sølvtråd og sølvleire. Glasset er staver som jeg smelter til glass perler. Resin er et to komponenter plast materiale  med mange muligheter</p>
          <NavigationButton text="Oppdag" path="produkter" buttonWidth={50}/>
        </div>
      </article>
    </section>
  )
}

export default InfoBox;