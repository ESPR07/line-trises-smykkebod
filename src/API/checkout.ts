import { Database, NewOrderData } from "../@types/Database";
import { CartItem } from "../App";
import { verifyCart } from "./verifyCart";

export interface CheckoutDependencies {
  enrichedCart: CartItem[];
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
}

export async function handleCheckout({
  enrichedCart,
  shippingData,
  createOrder,
  setVerifiedTotal,
  setIsProcessing,
}: CheckoutDependencies) {
  if (enrichedCart.length === 0) return;

  setIsProcessing?.(true);

  try {
    const result = await verifyCart(enrichedCart);
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
