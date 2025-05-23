import NavigationButton from "../utils/Button/NavigationButton";
import style from "./InfoBox.module.css"

function InfoBox() {
  return(
    <section className={style.infoBoxContainer}>
      <h3 className={style.infoHeader}>Om Smykkene Mine</h3>
      <span className={style.infoDivider}></span>
      <article className={style.infoContentContainer}>
        <img src="/src/assets/pexels-gdtography-277628-6563393.jpg" alt="Info Image" className={style.infoImage}/>
        <div className={style.infoTextContainer}>
          <p className={style.infoText}>Mine produkter er laget av resirkulert glass til noe kult og unikt. Mine produkter er laget av resirkulert glass til noe kult og unikt.</p>
          <NavigationButton text="Oppdag" path="#" buttonWidth={30}/>
        </div>
      </article>
    </section>
  )
}

export default InfoBox;