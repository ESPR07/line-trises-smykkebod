import { supabaseClient } from "../components/utils/supabaseClient";
import { CartItem } from "../App";
import { Database } from "../@types/Database";

type ProductPriceInfo = Pick<
  Database["public"]["Tables"]["products"]["Row"],
  "id" | "price" | "discount_amount"
>;

export async function verifyCart(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return { verifiedCart: [] as (CartItem & { price: number; discountPrice: number | null })[], total: 0 };
  }

  // Fetch authoritative prices from Supabase
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, price, discount_amount")
    .in(
      "id",
      cartItems.map((item) => item.id)
    );

  if (error) throw error;

  const products = data as ProductPriceInfo[];

  const verifiedCart = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.id);
    const price = product?.price ?? 0;
    const discountPrice = product?.discount_amount ?? null;

    return {
      ...item,
      price,
      discountPrice,
    };
  });

  const total = verifiedCart.reduce((sum, item) => {
    const effectivePrice = item.discountPrice ?? item.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  return { verifiedCart, total };
}
