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
    // Calculate total in øre
    const totalAmountOere = Math.round(
      enrichedCart.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + price * item.quantity;
      }, 0) * 100
    );

    if (totalAmountOere <= 0) {
      alert("Handlekurven er tom eller ugyldig.");
      return;
    }

    // Create PaymentIntent on the fly with shipping info
    const res = await fetch("/.netlify/functions/createPaymentIntent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalAmountOere,
        cart: enrichedCart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          discountPrice: item.discountPrice,
        })),
        clientPlatform: "web",
        firstName: shippingData.firstName ?? "",
        lastName: shippingData.lastName ?? "",
        email: shippingData.email ?? "",
        phone: shippingData.phone ?? "",
        adress: shippingData.adress ?? "",
        place: shippingData.place ?? "",
        postNr: shippingData.postNr ?? "",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const { clientSecret } = await res.json();
    if (!clientSecret) throw new Error("Kunne ikke opprette betaling.");

    // Confirm payment with Stripe Elements
    const result = await stripe.confirmPayment({
      clientSecret,
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

    // Clear cart frontend
    localStorage.removeItem("cart");
    setEnrichedCart([]);
    dispatch({ type: "clearCart", payload: { id: "", quantity: 0 } });

    // Navigate to order-processing page
    navigate(`/order-processing?paymentIntentId=${paymentIntentId}`);
  } catch (err: any) {
    console.error("Checkout failed:", err);
    alert("Noe gikk galt. Prøv igjen.");
  } finally {
    setIsProcessing?.(false);
  }
}
