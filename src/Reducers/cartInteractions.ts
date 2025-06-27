import { Cart, CartItem } from "../App";

export const initialValue: Cart = {
  productList: [],
  totalPrice: 0,
};

export type InteractionAction = {
  type: "addToCart" | "updateProduct" | "clearCart";
  payload: CartItem;
};

const calculateTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce((total, product) => {
    const price = product.discountPrice ?? product.price;
    return total + price * product.quantity;
  }, 0);
};

const syncLocalStorage = (cartState: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cartState));
  window.dispatchEvent(new Event("storage"));
};

const cartInteractions = (state: Cart, action: InteractionAction): Cart => {
  let cart = [...state.productList];
  const payload = action.payload;

  switch (action.type) {
    case "addToCart": {
      const index = cart.findIndex((item) => item.id === payload.id);
      const quantityToAdd = payload.quantity ?? 1;

      const fullItem: CartItem = {
        id: payload.id,
        name: payload.name,
        price: payload.price,
        discountPrice: payload.discountPrice,
        imageURL: payload.imageURL,
        quantity: quantityToAdd,
      };

      if (index === -1) {
        cart.push(fullItem);
      } else {
        const existing = cart[index];
        cart[index] = {
          ...existing,
          ...fullItem, // Fill in any missing fields
          quantity: existing.quantity + quantityToAdd,
        };
      }

      const totalPrice = calculateTotalPrice(cart);
      const newCartState = { productList: cart, totalPrice };
      syncLocalStorage(newCartState);
      return newCartState;
    }

    case "updateProduct": {
      const index = cart.findIndex((item) => item.id === payload.id);

      if (index !== -1) {
        if ((payload.quantity ?? 0) < 1) {
          cart.splice(index, 1); // Remove item
        } else {
          cart[index] = {
            ...cart[index],
            quantity: payload.quantity!,
          };
        }
      }

      const totalPrice = calculateTotalPrice(cart);
      const newCartState = { productList: cart, totalPrice };
      syncLocalStorage(newCartState);
      return newCartState;
    }

    case "clearCart": {
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("storage"));
      return initialValue;
    }

    default:
      throw new Error("Unsupported action type");
  }
};

export default cartInteractions;