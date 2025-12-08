import "./App.css";
import { Outlet, Route, Routes } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import {
  createContext,
  useReducer,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import cartInteractions, {
  InteractionAction,
  initialValue,
} from "./Reducers/cartInteractions";
import { useProductList } from "./API/useProducts";
import { useGetOrders } from "./API/useGetOrders";
import { Database } from "./@types/Database";
import PurchaseSuccess from "./pages/PurchaseSucessPage";
import MakeYourOwnPage from "./pages/MakeYourOwnPage";


// Lazy-loaded pages
const Homepage = lazy(() => import("./pages/Homepage"));
const BrowsePage = lazy(() => import("./pages/BrowsePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

// -------------------- Types --------------------
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
};

export interface Cart {
  productList: CartItemMinimal[];
  totalPrice: number;
}

// -------------------- Contexts --------------------
export const CartContext = createContext<{
  state: Cart;
  dispatch: ({ type, payload }: InteractionAction) => void;
}>({ state: initialValue, dispatch: () => {} });

export const APIResult = createContext({
  allProducts: [] as
    | Database["public"]["Tables"]["products"]["Row"][]
    | undefined,
  loading: false,
  error: false,
  searchQuery: "",
  setSearchQuery: (_query: string) => {},
  fetchProducts: (
    _page?: number,
    _showAvailable?: boolean,
    _searchQuery?: string
  ) => {},
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  setCurrentPage: (_page: number) => {},
});

export const ordersResult = createContext({
  allOrders: [] as Database["public"]["Tables"]["orders"]["Row"][] | undefined,
  loading: false,
  error: false,
  searchQuery: "",
  setSearchQuery: (_query: string) => {},
  fetchOrders: (
    _page?: number,
    _sortBy?: string,
    _ascending?: boolean,
    _searchQuery?: string
  ) => {},
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  setCurrentPage: (_page: number) => {},
});

// -------------------- Layouts --------------------
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
  }, [currentPage, productSearchQuery]);

  useEffect(() => {
    fetchOrders(ordersPage, undefined, true, orderSearchQuery);
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

// -------------------- App Component --------------------
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
          <Route path="lag-din-egen" element={<MakeYourOwnPage />} />
          <Route path="success" element={<PurchaseSuccess />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
