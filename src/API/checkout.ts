import { SetStateAction } from "react";
import { Database, NewOrderData } from "../@types/Database";
import { CartItem } from "../App";
import { verifyCart } from "./verifyCart";
import { InteractionAction } from "../Reducers/cartInteractions";
import { useNavigate } from "react-router";

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
    const result = await verifyCart(enrichedCart);
    console.log(result);
    const verifiedItems = result.verifiedCart;
    const verifiedTotal = result.total;

    setVerifiedTotal?.(verifiedTotal);

    const checkoutPayload = {
      customer_email: shippingData.email ?? "",
      customer_phone: shippingData.phone ?? "",
      customer_firstName: shippingData.firstName ?? "",
      customer_lastName: shippingData.lastName ?? "",
      customer_adress: shippingData.adress ?? "",
      customer_place: shippingData.place ?? "",
      customer_postNr: shippingData.postNr ?? "",

      cart: verifiedItems.map((item) => {
        const unitPrice =
          item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.price;

        return {
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      }),

      totals: {
        verifiedTotal,
        itemCount: verifiedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      },

      meta: {
        createdAt: new Date().toISOString(),
        clientPlatform: navigator.userAgent,
      },
    };

    const insertedOrder = await createOrder(checkoutPayload);

    if (insertedOrder) {
      console.log("Order successfully created:", insertedOrder);
      localStorage.removeItem("cart");
      setEnrichedCart([])
      dispatch({ type: "clearCart", payload: { id: "", quantity: 0 } });
      navigate(`/success?order=${insertedOrder.order_id}&name=${insertedOrder.customer_firstName}`)
    } else {
      console.error("Failed to create order");
    }
  } catch (err) {
    console.error("Checkout failed:", err);
    localStorage.removeItem("cart");
  } finally {
    setIsProcessing?.(false);
  }
}
