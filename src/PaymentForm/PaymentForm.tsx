import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import style from "./PaymentForm.module.css";
import { CartItem } from "../App";
import { shippingData } from "../@types/Database";
import { Stripe, StripeElements } from "@stripe/stripe-js";

interface PaymentFormProps {
  clientSecret: string;
  enrichedCart: CartItem[];
  shippingData: Partial<shippingData>;
  handleCheckout: (stripe: Stripe, elements: StripeElements) => Promise<void>;
  disabled: boolean;
}

function PaymentForm({
  clientSecret,
  handleCheckout,
  disabled,
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
      <h3>Betaling</h3>
      <PaymentElement />
      <button type="submit" disabled={disabled} className={style.kortBetaling}>
        Betal
      </button>
    </form>
  );
}

export default PaymentForm;
