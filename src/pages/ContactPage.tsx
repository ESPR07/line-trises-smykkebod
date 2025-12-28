import EventButton from "../components/utils/EventButton/EventButton";
import style from "./ContactPage.module.css";

function sendMail() {
  console.log("Test: Mail sent!");
}

function ContactPage() {
  return (
    <>
      <title>Kontakt meg - Line Trises Kunstsmykker</title>
      <meta name="description" content="Ta kontakt med Line Trises Kunstsmykker for spørsmål om bestillinger, spesialdesign eller samarbeid."/>
      <main className={style.contactMain}>
        <section className={style.contactStatic}>
          <article className={style.contactBox1}>
            <p>Har du et spørsmål?</p>
          </article>
          <article className={style.contactBox2}>
            <p>
              Du kan nå meg på{" "}
              <a href="mailto:linetrise@ltkunstsmykker.no">linetrise@ltkunstsmykker.no</a>
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
            <label htmlFor="mail">Email</label>
            <input type="text" id="mail" name="mail" placeholder="f.eks ola@example.com" required />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="orderNumber">Ordre Nummer</label>
            <input type="text" id="orderNumber" name="orderNumber" placeholder="f.eks 12345" required />
          </div>
          <div className={style.formGroup}>
            <label htmlFor="inquiry">Hva lurer du på?</label>
            <textarea id="inquiry" name="inquiry" placeholder='f.eks "Pakken ble skadet under levering"' required />
          </div>
          <EventButton text="Send Melding" event={sendMail} buttonWidth={100}/>
        </form>
      </main>
    </>
  );
}

export default ContactPage;
