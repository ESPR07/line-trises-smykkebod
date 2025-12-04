import { useContext, useEffect, useState } from "react";
import style from "./CartPage.module.css";
import { CartContext, CartItem, CartItemMinimal, APIResult } from "../App";
import CartProductCard from "../components/CartProductCard/CartProductCard";
import NavigationButton from "../components/utils/Button/NavigationButton";
import { verifyCart } from "../API/verifyCart";
import ShippingForm from "../components/utils/ShippingForm/ShippingForm";
import { shippingData } from "../@types/Database";

function CartPage() {
  const { state: cartState, dispatch } = useContext(CartContext);
  const { allProducts } = useContext(APIResult);

  const [enrichedCart, setEnrichedCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [verifiedTotal, setVerifiedTotal] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<Partial<shippingData>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Enrich minimal cart and calculate pricing
  useEffect(() => {
    if (!allProducts) return;

    const enriched = cartState.productList.map((cartItem: CartItemMinimal) => {
      const product = allProducts.find((product) => product.id === cartItem.id);

      if (!product) {
        console.warn("Product missing from API:", cartItem.id);
        return null;
      }

      return {
        id: product.id,
        name: product.name,
        price: Number(product.price), // Full price
        discountPrice:
          product.discount_amount !== null
            ? Number(product.discount_amount) // Already discounted final price
            : null,
        imageURL: product.image_url,
        quantity: cartItem.quantity,
      } as CartItem;
    });

    const validItems = enriched.filter(
      (product): product is CartItem => product !== null
    );

    const calculatedAfterDiscount = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return sum + (discount === 0 ? item.price : discount) * item.quantity;
    }, 0);

    const calculatedDiscount = validItems.reduce((sum, item) => {
      const discount = item.discountPrice ?? 0;
      return (
        sum + (discount !== 0 ? (item.price - discount) * item.quantity : 0)
      );
    }, 0);

    setEnrichedCart(validItems);
    setTotalPrice(calculatedAfterDiscount);
    setTotalDiscount(calculatedDiscount);
  }, [cartState, allProducts]);

  const handleCheckout = async () => {
    console.log("Leveranse Detaljer: ", shippingData);

    if (enrichedCart.length === 0) return;

    setIsProcessing(true);

    try {
      // SERVER VALIDATION (prevents all tampering)
      const result = await verifyCart(enrichedCart);

      // result should contain: items[], total, discounts, etc
      const verifiedItems = result.verifiedCart;
      const verifiedTotal = result.total;

      setVerifiedTotal(verifiedTotal);

      // Build full checkout payload
      const checkoutPayload = {
        customer: {
          email: shippingData.email ?? "",
          phone: shippingData.phone ?? "",
          firstName: shippingData.firstName ?? "",
          lastName: shippingData.lastName ?? "",
          adress: shippingData.adress ?? "",
          sted: shippingData.place ?? "",
          postNr: shippingData.postNr ?? "",
        },

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

      console.log("Checkout payload:", checkoutPayload);

      // TODO: Send checkoutPayload → Supabase or to your API route
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout. Please try again.");
      localStorage.removeItem("cart");
    } finally {
      setIsProcessing(false);
    }
  };

  if (enrichedCart.length === 0) {
    return (
      <main className={style.cartPageContainer}>
        <h1 className={style.cartHeader}>Handlekurv</h1>
        <section className={style.contentContainer}>
          <article className={style.cartItemList}></article>
          <div className={style.cartPaymentInfo}>
            <article className={style.cartInfo}>
              <h2>Oppsummering</h2>
              <p className={style.emptyMessage}>Her var det visst tomt!</p>
              <NavigationButton
                text="Utforsk"
                path="/browse"
                buttonWidth={100}
              />
            </article>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={style.cartPageContainer}>
      <h1 className={style.cartHeader}>Handlekurv</h1>
      <section className={style.contentContainer}>
        <article className={style.cartItemList}>
          {enrichedCart.map((product) => (
            <CartProductCard
              key={product.id}
              product={product}
              onUpdate={(p, quantity) =>
                dispatch({
                  type: "updateProduct",
                  payload: { id: p.id, quantity },
                })
              }
              onRemove={(p) =>
                dispatch({
                  type: "updateProduct",
                  payload: { id: p.id, quantity: 0 },
                })
              }
            />
          ))}
        </article>
        <div className={style.cartPaymentInfo}>
          <article className={style.cartInfo}>
            <h2>Oppsummering</h2>
            <div className={style.cartInfoRow}>
              <p>Rabatter:</p>
              <p>kr {totalDiscount.toFixed(2)}</p>
            </div>
            <div className={style.cartInfoRow}>
              <p>Totalt:</p>
              <p>
                kr{" "}
                {verifiedTotal !== null
                  ? verifiedTotal.toFixed(2)
                  : totalPrice.toFixed(2)}
              </p>
            </div>
          </article>
          <ShippingForm
            handleCheckout={handleCheckout}
            disabled={isProcessing}
            setShippingData={setShippingData}
          />
        </div>
      </section>
    </main>
  );
}

export default CartPage;
