import React from "react";
import style from "./AboutPage.module.css";

const AboutPage: React.FC = () => {
  return (
    <>
      <title>Om meg - Line Trises Smykkebod</title>
      <meta
        name="description"
        content="Les historien bak Line Trises Smykkebod. Håndlagde smykker inspirert av natur, tradisjon og moderne design."
      />
      <main className={style.aboutMain}>
        <section className={style.aboutBanner}>
          <article className={style.aboutBannerTextContainer}>
            <h2>Hvem er jeg?</h2>
            <p>
              Jeg heter Trine Lise og lager smykker med lidenskap for håndverk
              og unike detaljer. Hvert smykke jeg lager, er inspirert av natur,
              form og historie, og jeg elsker å skape noe som både forteller en
              historie og kan brukes hver dag. Mitt mål er at smykkene mine skal
              gi glede, selvtillit og en følelse av å bære noe personlig og
              spesielt.
            </p>
            <p>
              Smykkedesign er mer enn bare estetikk for meg – det er en måte å
              uttrykke kreativitet og kjærlighet til kvalitet på. Jeg håper at
              hvert smykke du finner her, føles like unikt for deg som det var å
              lage det, og at det blir en liten skatt i hverdagen din.
            </p>
          </article>
          <img
            src="/images/aboutSplashMe.webp"
            alt="Bilde av en smykkelager i arbeid"
            className={style.aboutBannerImage}
          />
        </section>
        <section className={style.aboutBannerRight}>
          <img
            src="/images/aboutSplashMe2.webp"
            alt="Bilde av en smykkelager i arbeid"
            className={style.aboutBannerImage}
          />
          <article className={style.aboutBannerTextContainerRight}>
            <h2>Smykkeboden min</h2>
            <p>
              Smykkeboden min er stedet hvor kreativitet og håndverk møtes. Her
              finner du smykker som er laget med kjærlighet, nøye utvalgte
              materialer og øye for detaljer. Hver kollektion har sin egen
              historie, og målet mitt er å tilby smykker som både kan brukes til
              hverdags og til spesielle anledninger.
            </p>
            <p>
              I Smykkeboden ønsker jeg at du skal kunne finne noe som føles
              personlig og unikt, enten det er en gave til noen du er glad i,
              eller en liten skatt til deg selv. Her legger jeg sjelen min i
              hvert smykke, og håper at det du finner her, gir deg like mye
              glede som det ga meg å lage det.
            </p>
          </article>
        </section>
        <section className={style.aboutBanner}>
          <article className={style.aboutBannerTextContainer}>
            <h2>Inspirasjon</h2>
            <p>
              Inspirasjonssiden min er stedet hvor ideene bak smykkene får liv.
              Her deler jeg tanker, historier og øyeblikk som har inspirert
              hvert enkelt design – fra naturens former og farger til minner som
              betyr noe spesielt. Målet er å vise reisen bak smykkene og hvordan
              små detaljer kan gjøre stor forskjell. 
            </p>
            <p>
              Jeg håper denne siden kan
              gi deg ideer og glede, og kanskje inspirere deg til å finne eller
              skape ditt eget uttrykk gjennom smykker. La deg bli inspirert,
              drømme litt, og oppdag skjønnheten i det håndlagde.
            </p>
          </article>
          <img
            src="/images/aboutSplashMe3.webp"
            alt="Bilde av en smykkelager i arbeid"
            className={style.aboutBannerImage}
          />
        </section>
      </main>
    </>
  );
};

export default AboutPage;
