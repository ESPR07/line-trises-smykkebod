import { useState } from "react";
import style from "./ContactPage.module.css";

function ContactPage() {
  const [mail, setMail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function sendMail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = {
      mail,
      orderNumber,
      inquiry,
    };

    fetch("/.netlify/functions/sendContactEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send");

        setSuccessMessage(
          "Takk for din hendvendelse! Jeg svarer deg så snart jeg kan 💌",
        );
        setMail("");
        setOrderNumber("");
        setInquiry("");
      })
      .catch((err) => {
        setErrorMessage(err.message || "Noe gikk galt, prøv igjen senere.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <title>Kontakt meg - Line Trises Kunstsmykker</title>
      <meta
        name="description"
        content="Ta kontakt med Line Trises Kunstsmykker for spørsmål om bestillinger, spesialdesign eller samarbeid."
      />

      <main className={style.contactMain}>
        <section className={style.contactStatic}>
          <article className={style.contactBox1}>
            <p>Har du et spørsmål?</p>
          </article>
          <article className={style.contactBox2}>
            <p>
              Du kan nå meg på{" "}
              <a href="mailto:line-trise@ltkunstsmykker.no">
                line-trise@ltkunstsmykker.no
              </a>
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

        <form className={style.contactForm} onSubmit={sendMail}>
          <div className={style.formGroup}>
            <label htmlFor="mail">Email</label>
            <input
              type="text"
              id="mail"
              name="mail"
              placeholder="f.eks ola@example.com"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="orderNumber">Ordre Nummer</label>
            <input
              type="text"
              id="orderNumber"
              name="orderNumber"
              placeholder="f.eks 12345"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label htmlFor="inquiry">Hva lurer du på?</label>
            <textarea
              id="inquiry"
              name="inquiry"
              placeholder='f.eks "Pakken ble skadet under levering"'
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "none" }}>
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            className={style.submitButton}
            disabled={loading}
          >
            {loading ? "Sender..." : "Send melding"}
          </button>

          {successMessage && (
            <p className={style.successMessage}>{successMessage}</p>
          )}

          {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
        </form>
      </main>
    </>
  );
}

export default ContactPage;
