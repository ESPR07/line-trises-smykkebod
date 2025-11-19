import React from "react";
import style from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  return (
    <main>
      <section className={style.aboutBanner}>
        <article className={style.aboutBannerTextContainer}>
          <h2>Hvem er jeg?</h2>
          <p>
            Velkommen til Smykkeboden! Her finner du unike, håndlagde smykker
            laget med kjærlighet og omtanke.
          </p>
        </article>
        <img
          src="/src/assets/aboutSplashMe.webp"
          alt="Bilde av en smykkelager i arbeid"
          className={style.aboutBannerImage}
        />
      </section>
      <section className={style.aboutBannerRight}>
        <img
          src="/src/assets/aboutSplashMe.webp"
          alt="Bilde av en smykkelager i arbeid"
          className={style.aboutBannerImage}
        />
        <article className={style.aboutBannerTextContainerRight}>
          <h2>Smykkeboden min</h2>
          <p>
            Smykker laget av ekte materiale og med ønske om å ha unike smykker.
          </p>
        </article>
      </section>
      <section className={style.aboutBanner}>
        <article className={style.aboutBannerTextContainer}>
          <h2>Inspirasjon</h2>
          <p>
            Dette er hva jeg elsekrer å lage, og jeg håper du finner noe som
            inspirerer deg også!
          </p>
        </article>
        <img
          src="/src/assets/aboutSplashMe.webp"
          alt="Bilde av en smykkelager i arbeid"
          className={style.aboutBannerImage}
        />
      </section>
    </main>
  );
};

export default AboutPage;
