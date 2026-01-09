import { SetStateAction } from "react";
import { Database, NewOrderData } from "../@types/Database";
import { CartItem } from "../App";
import { InteractionAction } from "../Reducers/cartInteractions";
import { useNavigate } from "react-router";
import { supabaseClient } from "../components/utils/supabaseClient";

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
  createOrder: (data: NewOrderData) => Promise<Database["public"]["Tables"]["orders"]["Row"] | null>;
  setVerifiedTotal?: (total: number) => void;
  setIsProcessing?: (processing: boolean) => void;
  navigate: ReturnType<typeof useNavigate>;
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
}: CheckoutDependencies) {
  if (enrichedCart.length === 0) return;
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

    for (const item of enrichedCart) {
      if (item.metadata) {
        const { data: customData, error } = await supabaseClient
          .from("custom_products")
          .select("*")
          .eq("id", item.id)
          .single();

        if (error || !customData) {
          alert(
            `Tilpasset produkt "${item.name}" er utløpt eller mangler. Vennligst fjern det fra handlekurven.`
          );
          dispatch({ type: "updateProduct", payload: { id: item.id, quantity: 0 } });
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
      alert("Handlekurven er tom etter prisverifisering.");
      setIsProcessing?.(false);
      return;
    }

    setVerifiedTotal?.(verifiedTotal);

    const checkoutPayload = {
      customer_email: shippingData.email ?? "",
      customer_phone: shippingData.phone ?? "",
      customer_firstName: shippingData.firstName ?? "",
      customer_lastName: shippingData.lastName ?? "",
      customer_adress: shippingData.adress ?? "",
      customer_place: shippingData.place ?? "",
      customer_postNr: shippingData.postNr ?? "",
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

    if (insertedOrder) {
      localStorage.removeItem("cart");
      setEnrichedCart([]);
      dispatch({ type: "clearCart", payload: { id: "", quantity: 0 } });
      navigate(
        `/success?order=${insertedOrder.order_id}&name=${insertedOrder.customer_firstName}`
      );
    } else {
      console.error("Kunne ikke opprette ordre");
    }
  } catch (err) {
    console.error("Checkout feilet:", err);
    localStorage.removeItem("cart");
  } finally {
    setIsProcessing?.(false);
  }
}
