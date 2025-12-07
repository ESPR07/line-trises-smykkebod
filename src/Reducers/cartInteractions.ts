import { Cart, CartItemMinimal } from "../App";

export const initialValue: Cart = {
  productList: [],
  totalPrice: 0,
};

export type InteractionAction = {
  type: "addToCart" | "updateProduct" | "clearCart";
  payload: CartItemMinimal;
};

const syncLocalStorage = (cartState: Cart) => {
  localStorage.setItem("cart", JSON.stringify(cartState.productList));
  window.dispatchEvent(new Event("storage"));
};

const cartInteractions = (state: Cart, action: InteractionAction): Cart => {
  const cart = [...state.productList];
  const { id, quantity } = action.payload;

  switch (action.type) {
    case "addToCart": {
      const index = cart.findIndex((item) => item.id === id);
      const quantityToAdd = quantity ?? 1;

      if (index === -1) {
        // Push the full payload (including metadata and price)
        cart.push({ ...action.payload, quantity: quantityToAdd });
      } else {
        cart[index].quantity += quantityToAdd;
      }

      const newCartState = { productList: cart, totalPrice: 0 };
      syncLocalStorage(newCartState);
      return newCartState;
    }

    case "updateProduct": {
      const index = cart.findIndex((item) => item.id === id);

      if (index !== -1) {
        if (quantity! < 1) {
          cart.splice(index, 1);
        } else {
          cart[index].quantity = quantity!;
        }
      }

      const newCartState = { productList: cart, totalPrice: 0 };
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
