import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import style from "./PurchaseSucessPage.module.css";

function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  
  const orderNumber = searchParams.get("order") || "12345";
  const customerName = searchParams.get("name") || "Kunde";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <title>Takk for ditt kjøp! | Line Trises Smykkebod</title>
      <meta name="description" content="Din bestilling er mottatt og bekreftet." />
      
      <main className={style.successPageContainer}>
        <div className={`${style.successCard} ${isVisible ? style.visible : ""}`}>
          {/* Success Icon */}
          <div className={style.iconContainer}>
            <div className={style.checkmarkCircle}>
              <div className={style.checkmark}></div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className={style.successTitle}>Takk for ditt kjøp!</h1>
          <p className={style.successSubtitle}>
            Hei {customerName}, din bestilling er mottatt og bekreftet.
          </p>

          {/* Order Details */}
          <div className={style.orderDetails}>
            <div className={style.orderInfoRow}>
              <span className={style.label}>Ordrenummer:</span>
              <span className={style.value}>#{orderNumber}</span>
            </div>
            <div className={style.orderInfoRow}>
              <span className={style.label}>Status:</span>
              <span className={style.statusBadge}>Bekreftet</span>
            </div>
          </div>

          {/* Info Box */}
          <div className={style.infoBox}>
            <div className={style.infoIcon}>📧</div>
            <p className={style.infoText}>
              En ordrebekreftelse er sendt til din e-post. Du vil motta en ny melding når 
              bestillingen din er sendt.
            </p>
          </div>

          {/* Next Steps */}
          <div className={style.nextSteps}>
            <h2 className={style.nextStepsTitle}>Hva skjer nå?</h2>
            <div className={style.stepsList}>
              <div className={style.step}>
                <div className={style.stepNumber}>1</div>
                <div className={style.stepContent}>
                  <h3>Pakking</h3>
                  <p>Jeg pakker din bestilling med omhu</p>
                </div>
              </div>
              <div className={style.step}>
                <div className={style.stepNumber}>2</div>
                <div className={style.stepContent}>
                  <h3>Forsendelse</h3>
                  <p>Du mottar sporingsnummer på e-post</p>
                </div>
              </div>
              <div className={style.step}>
                <div className={style.stepNumber}>3</div>
                <div className={style.stepContent}>
                  <h3>Levering</h3>
                  <p>Pakken leveres på din adresse</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={style.buttonGroup}>
            <Link to="/browse" className={style.primaryButton}>
              Fortsett å handle
            </Link>
            <Link to="/" className={style.secondaryButton}>
              Tilbake til forsiden
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={style.confetti}>
          {[...Array(30)].map((_, i) => (
            <div key={i} className={style.confettiPiece} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </main>
    </>
  );
}

export default PurchaseSuccess;