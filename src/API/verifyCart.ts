import { createClient } from "@supabase/supabase-js";
import { CartItem } from "../App";
import { Database } from "../types/Database";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey = import.meta.env.VITE_SUPABASE_KEY;

const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export async function verifyCart(cartItems: CartItem[]) {
  // Fetch authoritative prices and discount prices from Supabase
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, price, discount_amount")
    .in("id", cartItems.map(item => item.id));

  if (error) throw error;

  // Map local cart items to authoritative product info
  const verifiedCart = cartItems.map(item => {
    const product = data.find(p => p.id === item.id);
    const price = product?.price ?? 0;
    const discountPrice = product?.discount_amount ?? null;

    return {
      ...item,
      price,
      discountPrice,
    };
  });

  // Compute total using discountPrice if available
  const total = verifiedCart.reduce((sum, item) => {
    const effectivePrice = item.discountPrice ?? 0;
    const finalPrice = effectivePrice === 0 ? item.price : effectivePrice;
    return sum + finalPrice * item.quantity;
  }, 0);

  return { verifiedCart, total };
}
