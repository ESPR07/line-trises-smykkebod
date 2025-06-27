import './App.css'
import { Outlet, Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Homepage from './pages/Homepage'
import BrowsePage from './pages/BrowsePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import { FetchResult } from './types/Database'
import { createContext, useReducer } from "react";
import cartInteractions, {
  InteractionAction,
  initialValue,
} from "./Reducers/cartInteractions";
import { getProductList } from './API/getProducts'


type APIInterface = {
  allProducts: FetchResult[] | undefined;
  loading: boolean;
  error: boolean;
};

export interface CartItem {
  id: number;
  name: string;
  price: number;
  discountPrice: number | null;
  imageURL: string;
  quantity: number;
}

export interface Cart {
  productList: CartItem[];
  totalPrice: number;
}

export const CartContext = createContext<{
  state: Cart;
  dispatch: ({ type, payload }: InteractionAction) => void;
}>({ state: initialValue, dispatch: () => {} });

export const APIResult = createContext<APIInterface>({
  allProducts: [],
  loading: false,
  error: false,
});

function Layout() {
  const { productList, isLoading, isError } = getProductList();

  const localStoreCart = localStorage.getItem("cart");

  const [state, dispatch] = useReducer(
    cartInteractions,
    localStoreCart !== null ? JSON.parse(localStoreCart) : initialValue
  );

  return(
    <>
      <CartContext.Provider value={{ state: state, dispatch: dispatch}}>
        <APIResult.Provider value={{ allProducts: productList, loading: isLoading, error: isError}}>
          <Navbar/>
          <Outlet/>
          <Footer/>
        </APIResult.Provider>
      </CartContext.Provider>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Homepage/>}/>
        <Route path="browse" element={<BrowsePage/>}/>
        <Route path="produkt/:id" element={<ProductPage/>}/>
        <Route path="cart" element={<CartPage/>}/>
      </Route>
    </Routes>
  )
}

export default App
