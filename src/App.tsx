import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Homepage from './pages/Homepage'
import BrowsePage from './pages/BrowsePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import { createContext, useReducer } from "react";
import cartInteractions, { InteractionAction, initialValue } from "./Reducers/cartInteractions"
import { getProductList } from './API/getProducts'
import { FetchResult } from './types/Database'

export interface CartItemMinimal {
  id: number;
  quantity: number;
}

export interface CartState {
  productList: CartItemMinimal[];
}

export type CartItem = CartItemMinimal & {
  name: string;
  price: number;
  discountPrice: number | null;
  imageURL: string;
}

export interface Cart {
  productList: CartItemMinimal[];
  totalPrice: number; // For convenience, can calculate dynamically
}

export const CartContext = createContext<{
  state: Cart;
  dispatch: ({ type, payload }: InteractionAction) => void;
}>({ state: initialValue, dispatch: () => {} });

export const APIResult = createContext({
  allProducts: [] as FetchResult[] | undefined,
  loading: false,
  error: false,
  fetchProducts: () => {}
});

function Layout() {
  const { productList, isLoading, isError, fetchProducts } = getProductList();
  const localStoreCart = localStorage.getItem("cart");

  const [state, dispatch] = useReducer(
    cartInteractions,
    localStoreCart !== null ? { productList: JSON.parse(localStoreCart), totalPrice: 0 } : initialValue
  );

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      <APIResult.Provider value={{ allProducts: productList, loading: isLoading, error: isError, fetchProducts }}>
        <Navbar />
        <Outlet />
        <Footer />
      </APIResult.Provider>
    </CartContext.Provider>
  );
}

function AdminLayout() {
  const { productList, isLoading, isError, fetchProducts } = getProductList();

  return (
    <APIResult.Provider value={{ allProducts: productList, loading: isLoading, error: isError, fetchProducts }}>
      <Outlet />
    </APIResult.Provider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="produkt/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
