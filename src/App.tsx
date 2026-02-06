import "./App.css";
import { Outlet, Route, Routes } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import {
  useReducer,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import cartInteractions, {
  initialValue,
} from "./Reducers/cartInteractions";
import { useProductList } from "./API/useProducts";
import { useGetOrders } from "./API/useGetOrders";
import UnderConstruction from "./pages/UnderConstruction";
import { useAuthStatus } from "./API/useAuthStatus";
import OrderProcessingPage from "./pages/OrderProccessingPage";
import { CartContext, APIResult, ordersResult } from "./context/siteContexts";


// Lazy-loaded pages
const Homepage = lazy(() => import("./pages/Homepage"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PurchaseSuccess = lazy(() => import("./pages/PurchaseSucessPage"));
const MakeYourOwnPage = lazy(() => import("./pages/MakeYourOwnPage"));

export interface CartItemMinimal {
  id: string;
  quantity: number;
  price?: number;
  name?: string;
  metadata?: Record<string, string>;
}

export type CartItem = CartItemMinimal & {
  name: string;
  price: number;
  discountPrice: number | null;
  imageURL: string;
  short_description?: string;
};

export interface Cart {
  productList: CartItemMinimal[];
  totalPrice: number;
}

function Layout() {
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const {
    productList,
    isLoading,
    isError,
    fetchProducts,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
  } = useProductList();

  const [searchQuery, _setSearchQuery] = useState("");

  const localStoreCart = localStorage.getItem("cart");
  const [state, dispatch] = useReducer(
    cartInteractions,
    localStoreCart !== null
      ? { productList: JSON.parse(localStoreCart), totalPrice: 0 }
      : initialValue
  );

  useEffect(() => {
    fetchProducts(currentPage, true, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      <APIResult.Provider
        value={{
          allProducts: productList,
          loading: isLoading,
          error: isError,
          searchQuery: productSearchQuery,
          setSearchQuery: setProductSearchQuery,
          fetchProducts,
          currentPage,
          totalPages,
          itemsPerPage,
          setCurrentPage,
        }}
      >
        <Navbar />
        <Outlet />
        <Footer />
      </APIResult.Provider>
    </CartContext.Provider>
  );
}

function AdminLayout() {
  const {
    productList,
    isLoading,
    isError,
    fetchProducts,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
  } = useProductList();

  const {
    orderList,
    ordersLoading,
    ordersError,
    fetchOrders,
    currentPage: ordersPage,
    totalPages: ordersTotalPages,
    itemsPerPage: ordersPerPage,
    setCurrentPage: setOrdersPage,
  } = useGetOrders();

  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts(currentPage, false, productSearchQuery); // All products for admin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, productSearchQuery]);

  useEffect(() => {
    fetchOrders(ordersPage, undefined, true, orderSearchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersPage, orderSearchQuery]);

  return (
    <APIResult.Provider
      value={{
        allProducts: productList,
        loading: isLoading,
        error: isError,
        searchQuery: productSearchQuery,
        setSearchQuery: setProductSearchQuery,
        fetchProducts: (page?: number) =>
          fetchProducts(page ?? 1, false, productSearchQuery),
        currentPage,
        totalPages,
        itemsPerPage,
        setCurrentPage,
      }}
    >
      <ordersResult.Provider
        value={{
          allOrders: orderList,
          loading: ordersLoading,
          error: ordersError,
          searchQuery: orderSearchQuery,
          setSearchQuery: setOrderSearchQuery,
          fetchOrders: (page?: number) =>
            fetchOrders(page ?? 1, undefined, true, orderSearchQuery),
          currentPage: ordersPage,
          totalPages: ordersTotalPages,
          itemsPerPage: ordersPerPage,
          setCurrentPage: setOrdersPage,
        }}
      >
        <Outlet />
      </ordersResult.Provider>
    </APIResult.Provider>
  );
}

function App() {
  const { session } = useAuthStatus();

  if (!session) {
    return <UnderConstruction />;
  }

  return (
    <Suspense fallback={<div>Laster...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="produkter" element={<BrowsePage />} />
          <Route path="produkt/:id" element={<ProductPage />} />
          <Route path="handlekurv" element={<CartPage />} />
          <Route path="om-meg" element={<AboutPage />} />
          <Route path="kontakt" element={<ContactPage />} />
          <Route path="lag-din-egen" element={<MakeYourOwnPage />} />
          <Route path="velykket" element={<PurchaseSuccess />} />
          <Route path="order-processing" element={<OrderProcessingPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
