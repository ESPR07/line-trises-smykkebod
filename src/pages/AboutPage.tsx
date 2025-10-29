import React from "react";
import style from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  return (
    <main>
      <section className={style.aboutBanner}>
        <article className={style.aboutBannerTextContainer}>
          <p>
            Velkommen til Smykkeboden! Her finner du unike, håndlagde smykker
            laget med kjærlighet og omtanke.
          </p>
        </article>
        <img
          src="/src/assets/workshop.jpg"
          alt="Bilde av en smykkelager i arbeid"
          className={style.aboutBannerImage}
        />
      </section>
      <section className={style.aboutBannerRight}>
        <img
          src="/src/assets/workshop.jpg"
          alt="Bilde av en smykkelager i arbeid"
          className={style.aboutBannerImage}
        />
        <article className={style.aboutBannerTextContainerRight}>
          <p>
            Smykker laget av ekte materiale og med ønske om å ha unike smykker.
          </p>
        </article>
      </section>
    </main>
  );
};

export default AboutPage;
