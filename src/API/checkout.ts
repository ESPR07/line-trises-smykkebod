import { SetStateAction } from "react";
import { CartItem } from "../App";
import { InteractionAction } from "../Reducers/cartInteractions";
import { useNavigate } from "react-router";
import { Stripe, StripeElements } from "@stripe/stripe-js";
import { shippingData } from "../@types/Database";

export interface CheckoutDependencies {
  enrichedCart: CartItem[];
  setEnrichedCart: React.Dispatch<SetStateAction<CartItem[]>>;
  dispatch: (action: InteractionAction) => void;
  shippingData: Partial<shippingData>;
  setIsProcessing?: (processing: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
  stripe: Stripe | null;
  elements: StripeElements | null;
}

export async function handleCheckout({
  enrichedCart,
  setEnrichedCart,
  dispatch,
  shippingData,
  setIsProcessing,
  navigate,
  stripe,
  elements,
}: CheckoutDependencies) {
  if (enrichedCart.length === 0) return;

  if (!stripe || !elements) {
    alert("Stripe er ikke klart. Prøv igjen.");
    return;
  }

  setIsProcessing?.(true);

  try {
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: shippingData.email,
      },
      redirect: "if_required",
    });

    if (result.error) {
      console.error("Stripe payment error:", result.error);
      alert(result.error.message ?? "Betalingen feilet.");
      return;
    }

    const paymentIntentId = result.paymentIntent?.id;
    if (!paymentIntentId) {
      alert("Noe gikk galt med betalingen.");
      return;
    }

    localStorage.removeItem("cart");
    setEnrichedCart([]);
    dispatch({ type: "clearCart", payload: { id: "", quantity: 0 } });

    navigate(`/order-processing?paymentIntentId=${paymentIntentId}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Checkout failed:", err.message);
    } else {
      console.error("Checkout failed:", err);
    }
    alert("Noe gikk galt. Prøv igjen.");
  } finally {
    setIsProcessing?.(false);
  }
}
