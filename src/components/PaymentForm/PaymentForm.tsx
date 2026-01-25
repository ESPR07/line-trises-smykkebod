import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import style from "./PaymentForm.module.css";
import { CartItem } from "../../App";
import { shippingData } from "../../@types/Database";
import { Stripe, StripeElements } from "@stripe/stripe-js";

interface PaymentFormProps {
  clientSecret: string;
  enrichedCart: CartItem[];
  shippingData: Partial<shippingData>;
  handleCheckout: (stripe: Stripe, elements: StripeElements) => Promise<void>;
  disabled: boolean;
  onEditShipping?: () => void; // Optional callback to go back to shipping form
}

function PaymentForm({
  clientSecret,
  shippingData,
  handleCheckout,
  disabled,
  onEditShipping,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const submitResult = await elements.submit();
    if (submitResult.error) {
      console.error("PaymentElement submit error:", submitResult.error);
      alert(submitResult.error.message ?? "Betalingen feilet.");
      return;
    }
    await handleCheckout(stripe, elements);
  };

  if (!clientSecret) return null;

  return (
    <form className={style.paymentForm} onSubmit={onSubmit}>
      {/* Shipping Info Summary */}
      <div className={style.shippingSummary}>
        <div className={style.summaryHeader}>
          <span className={style.summaryLabel}>Leveres til</span>
          {onEditShipping && (
            <button 
              type="button" 
              onClick={onEditShipping}
              className={style.editButton}
            >
              Endre
            </button>
          )}
        </div>
        <div className={style.summaryContent}>
          <strong>
            {shippingData.firstName} {shippingData.lastName}
          </strong>
          <div className={style.summaryAddress}>
            {shippingData.adress}
          </div>
          <div className={style.summaryAddress}>
            {shippingData.postNr} {shippingData.place}
          </div>
          <div className={style.summaryContact}>
            {shippingData.email} • {shippingData.phone}
          </div>
        </div>
      </div>

      <h3>Betaling</h3>
      <PaymentElement />
      <button type="submit" disabled={disabled} className={style.kortBetaling}>
        Betal
      </button>
    </form>
  );
}

export default PaymentForm;