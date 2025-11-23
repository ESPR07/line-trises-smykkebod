import EventButton from "../components/utils/EventButton/EventButton";
import style from "./ContactPage.module.css";

function ContactPage() {
  return (
    <main className={style.contactMain}>
      <section className={style.contactStatic}>
        <article className={style.contactBox1}>
          <p>Har du et spørsmål?</p>
        </article>
        <article className={style.contactBox2}>
          <p>
            Du kan nå meg på{" "}
            <a href="mailto:linetrise@smykkebod.no">linetrise@smykkebod.no</a>
          </p>
        </article>
      </section>
      <div className={style.dividerContainer}>
        <div className={style.dividerLineBox}>
          <span className={style.dividerLine}></span>
        </div>
        <p className={style.dividerText}>Eller her</p>
        <div className={style.dividerLineBox}>
          <span className={style.dividerLine}></span>
        </div>
      </div>
      <form className={style.contactForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">Mail / Ordre Nummer</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="inquiry">Hva lurer du på?</label>
          <textarea id="inquiry" name="inquiry" required />
        </div>
        <EventButton text="Send Melding" buttonWidth={100}/>
      </form>
    </main>
  );
}

export default ContactPage;
