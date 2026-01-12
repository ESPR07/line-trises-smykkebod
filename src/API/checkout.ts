import { SetStateAction } from "react";
import { Database, NewOrderData } from "../@types/Database";
import { CartItem } from "../App";
import { InteractionAction } from "../Reducers/cartInteractions";
import { useNavigate } from "react-router";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Stripe, StripeElements } from "@stripe/stripe-js";

export interface CheckoutDependencies {
  enrichedCart: CartItem[];
  setEnrichedCart: React.Dispatch<SetStateAction<CartItem[]>>;
  dispatch: (action: InteractionAction) => void;
  shippingData: Partial<{
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    adress: string;
    place: string;
    postNr: string;
  }>;
  createOrder: (
    data: NewOrderData
  ) => Promise<Database["public"]["Tables"]["orders"]["Row"] | null>;
  setVerifiedTotal?: (total: number) => void;
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
  createOrder,
  setVerifiedTotal,
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
    let verifiedTotal = 0;

    const finalCart: {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      metadata?: Record<string, any>;
    }[] = [];

    // Verify cart & calculate price
    for (const item of enrichedCart) {
      if (item.metadata) {
        const { data: customData, error } = await supabaseClient
          .from("custom_products")
          .select("*")
          .eq("id", item.id)
          .single();

        if (error || !customData) {
          alert(`Tilpasset produkt "${item.name}" er utløpt eller mangler.`);
          dispatch({
            type: "updateProduct",
            payload: { id: item.id, quantity: 0 },
          });
          continue;
        }

        const unitPrice = customData.calculated_price;

        finalCart.push({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
          metadata: customData.configuration,
        });

        verifiedTotal += unitPrice * item.quantity;
      } else {
        const unitPrice =
          item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.price;

        finalCart.push({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        });

        verifiedTotal += unitPrice * item.quantity;
      }
    }

    if (finalCart.length === 0) {
      alert("Handlekurven er tom etter verifisering.");
      return;
    }

    setVerifiedTotal?.(verifiedTotal);

    // Confirm payment
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      alert(result.error.message ?? "Betalingen feilet.");
      return;
    }

    const paymentIntent = result.paymentIntent;

    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      alert("Betalingen ble ikke fullført.");
      return;
    }

    // Create order after payment
    const checkoutPayload: NewOrderData = {
      customer_email: shippingData.email ?? "",
      customer_info: {
        customer_email: shippingData.email ?? "",
        customer_phone: shippingData.phone ?? "",
        customer_firstName: shippingData.firstName ?? "",
        customer_lastName: shippingData.lastName ?? "",
        customer_adress: shippingData.adress ?? "",
        customer_place: shippingData.place ?? "",
        customer_postNr: shippingData.postNr ?? "",
      },
      cart: finalCart,
      totals: {
        verifiedTotal,
        itemCount: finalCart.reduce((sum, i) => sum + i.quantity, 0),
      },
      meta: {
        createdAt: new Date().toISOString(),
        clientPlatform: navigator.userAgent,
      },
    };

    const insertedOrder = await createOrder(checkoutPayload);

    if (!insertedOrder) {
      console.error("Kunne ikke opprette ordre");
      return;
    }

    // Cleanup & redirect
    localStorage.removeItem("cart");
    setEnrichedCart([]);
    dispatch({ type: "clearCart", payload: { id: "", quantity: 0 } });

    navigate(
      `/velykket?order=${insertedOrder.order_id}&name=${insertedOrder.customer_info.customer_firstName}`
    );
  } catch (err) {
    console.error("Checkout feilet:", err);
    alert("Noe gikk galt. Prøv igjen.");
  } finally {
    setIsProcessing?.(false);
  }
}
