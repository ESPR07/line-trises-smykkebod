import { createClient } from "@supabase/supabase-js";
import { CartItem } from "../App";
import { Database } from "../types/Database";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey = import.meta.env.VITE_SUPABASE_KEY;

const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export async function verifyCart(cartItems: CartItem[]) {
  // Fetch authoritative prices from Supabase
  const { data, error } = await supabaseClient
    .from("products")
    .select("id, price")
    .in("id", cartItems.map(item => item.id));

  if (error) throw error;

  // Overwrite local prices with official prices
  const verifiedCart = cartItems.map(item => {
    const product = data.find(p => p.id === item.id);
    return {
      ...item,
      price: product?.price ?? 0, // overwrite price
    };
  });

  // Compute total based on authoritative prices
  const total = verifiedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { verifiedCart, total };
}
