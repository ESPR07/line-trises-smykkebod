import NavigationButton from "../utils/Button/NavigationButton";
import style from "./MakeYourOwn.module.css";

function MakeYourOwn() {
  return (
    <section className={style.customContainer}>
      <img
        className={style.customImage}
        src="/src/assets/images/encasedJewlery.webp"
        alt="Make your own jewelry"
      />
      <article className={style.customInfoBox}>
        <div className={style.customWrapper}>
          <div className={style.customTextFormat}>
            <div className={style.textWrapper}>
              <p className={style.line1}>Vet du <span className={style.textHighlight}>akkurat</span></p>
              <p className={style.line2}>hva du vil ha</p>
            </div>
            <p className={style.question}>?</p>
          </div>
          <NavigationButton text="Design din egen" path="/lag-din-egen" buttonWidth={100} />
        </div>
      </article>
    </section>
  );
}

export default MakeYourOwn;
