import React from 'react';
import styles from './ReturnPolicyPage.module.css';

const ReturnPolicyPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Retur og angrerett</h1>
        <p className={styles.subtitle}>
          Jeg ønsker at du skal være fornøyd med ditt kjøp. Les om dine rettigheter ved netthandel.
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>14 dagers angrerett</h2>
          <p>
            Du har 14 dagers angrerett når du handler hos meg. Dette er en lovfestet rett som gir deg 
            mulighet til å angre på kjøpet uten å oppgi noen grunn.
          </p>
          <div className={styles.infoBox}>
            <p><strong>Når starter fristen?</strong></p>
            <p>
              Fristen begynner dagen <em>etter</em> at du har mottatt varen. For tjenester starter fristen 
              dagen etter at avtalen er inngått.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2>Slik benytter du angreretten</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <h3>Gi beskjed innen 14 dager</h3>
                <p>
                  Meld fra til meg innen 14 dager fra du mottok varen. Send en e-post til 
                  <a href="mailto:trine-lise@ltkunstsmykker.no" className={styles.link}> trine-lise@ltkunstsmykker.no</a> med ordrenummer og beskjed om at du ønsker å benytte angreretten.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <h3>Send varen i retur</h3>
                <p>
                  Du må sende varen tilbake til meg så fort som mulig, og senest 14 dager etter at du 
                  ga beskjed om at du vil benytte angreretten. Du er selv ansvarlig for at varen kommer trygt frem.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h3>Få pengene tilbake</h3>
                <p>
                  Jeg refunderer hele kjøpesummen inkludert leveringskostnader innen 14 dager etter at jeg har 
                  mottat varen eller dokumentasjon på at den er returnert.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2>Kostnader ved retur</h2>
          <p>
            Du må som hovedregel dekke de direkte kostnadene ved å returnere varen. Dette kan være 
            returfrakt eller porto. Jeg anbefaler at du bruker sporbar frakt og tar vare på kvittering.
          </p>
          <div className={styles.warningBox}>
            <p>
              <strong>Viktig:</strong> Du vil ikke få dekket returfrakt, med mindre varen er mangelfull 
              eller feil vare er sendt.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2>Varens tilstand</h2>
          <p>
            Du kan åpne emballasjen og undersøke varen på samme måte som du ville gjort i en fysisk butikk. 
            Varen må returneres i vesentlig samme stand og mengde som da du mottok den.
          </p>
          <ul className={styles.list}>
            <li>Du kan teste varen for å se om den passer som forventet</li>
            <li>Emballasje kan åpnes, men bør bevares for trygg retur</li>
            <li>Varen må ikke være brukt utover det som er nødvendig for å undersøke den</li>
            <li>Hvis varen er skadet eller brukt mer enn nødvendig, kan jeg trekke fra et beløp som tilsvarer verdiforringelsen</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2>Unntak fra angreretten</h2>
          <p>Enkelte varer og tjenester er unntatt fra angreretten:</p>
          <ul className={styles.list}>
            <li>Varer som er laget spesielt for deg eller har tydelig personlig preg for eksempel fra "Lag din egen" seksjonen</li>
            <li>Forseglede varer som av hygieniske årsaker ikke kan returneres etter at forseglingen er brutt</li>
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.iconBox}>
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2>Reklamasjonsrett</h2>
          <p>
            Har du kjøpt en vare som er mangelfull eller ikke fungerer som den skal? Da kan du ha rett til 
            å reklamere. Reklamasjonsretten gjelder i tillegg til angreretten.
          </p>
          <div className={styles.infoBox}>
            <p><strong>Dine rettigheter ved mangel:</strong></p>
            <ul className={styles.list}>
              <li>Krav om retting eller omlevering</li>
              <li>Prisavslag</li>
              <li>Heving av kjøpet</li>
              <li>Erstatning for tap</li>
            </ul>
            <p>
              Du har 2 års reklamasjonsrett i Norge for varer med mangel. Kontakt oss så raskt som mulig 
              etter at du oppdaget feilen.
            </p>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Trenger du hjelp?</h2>
          <p>
            Jeg svarer gjerne på spørsmål om retur, angrerett eller reklamasjon.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <strong>E-post:</strong>
              <a href="mailto:trine-lise@ltkunstsmykker.no" className={styles.link}>
                trine-lise@ltkunstsmykker.no
              </a>
            </div>
          </div>
        </section>

        <section className={styles.legalSection}>
          <h3>Lovgrunnlag</h3>
          <p>
            Denne siden er basert på lov 20. juni 2014 nr. 27 om opplysningsplikt og angrerett ved fjernsalg 
            og salg utenom faste forretningslokaler (angrerettloven) og forbrukerkjøpsloven. 
            Les mer på <a href="https://www.forbrukertilsynet.no" className={styles.link} target="_blank" rel="noopener noreferrer">Forbrukertilsynet.no</a>
          </p>
          <p className={styles.updated}>Sist oppdatert: Februar 2026</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;