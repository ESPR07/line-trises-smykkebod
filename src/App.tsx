import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { createContext, useReducer, lazy, Suspense } from "react";
import cartInteractions, { InteractionAction, initialValue } from "./Reducers/cartInteractions"
import { useProductList } from './API/useProducts'
import { Database } from './@types/Database'
import { useGetOrders } from './API/useGetOrders'
import PurchaseSuccess from './pages/PurchaseSucessPage';

// Lazy-load pages only
const Homepage = lazy(() => import('./pages/Homepage'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export interface CartItemMinimal {
  id: string;
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
  totalPrice: number;
}

export const CartContext = createContext<{
  state: Cart;
  dispatch: ({ type, payload }: InteractionAction) => void;
}>({ state: initialValue, dispatch: () => {} });

export const APIResult = createContext({
  allProducts: [] as Database["public"]["Tables"]["products"]["Row"][] | undefined,
  loading: false,
  error: false,
  fetchProducts: () => {}
});

export const ordersResult = createContext({
  allOrders: [] as Database["public"]["Tables"]["orders"]["Row"][] | undefined,
  loading: false,
  error: false,
  fetchOrders: (_sortBy?: string, _ascending?: boolean) => {}
});

function Layout() {
  const { productList, isLoading, isError, fetchProducts } = useProductList();
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
  const { productList, isLoading, isError, fetchProducts } = useProductList();
  const { orderList, ordersLoading, ordersError, fetchOrders } = useGetOrders();

  return (
    <APIResult.Provider value={{ allProducts: productList, loading: isLoading, error: isError, fetchProducts }}>
      <ordersResult.Provider value={{ allOrders: orderList, loading: ordersLoading, error: ordersError, fetchOrders}}>
        <Outlet />
      </ordersResult.Provider>
    </APIResult.Provider>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Laster...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="produkt/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="success" element={<PurchaseSuccess/>} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
