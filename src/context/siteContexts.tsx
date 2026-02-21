import { createContext } from "react";
import { Database } from "../@types/Database";
import { Cart } from "../App";
import { initialValue, InteractionAction } from "../Reducers/cartInteractions";

export const CartContext = createContext<{
  state: Cart;
  dispatch: ({ type, payload }: InteractionAction) => void;
}>({ state: initialValue, dispatch: () => {} });

export const APIResult = createContext({
  allProducts: [] as Database["public"]["Tables"]["products"]["Row"][] | undefined,
  loading: false,
  error: false,
  searchQuery: "",
  setSearchQuery: (_query: string) => {},
  fetchProducts: (
    _page?: number,
    _showAvailable?: boolean,
    _searchQuery?: string,
    _categories?: string[],
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
    _searchQuery?: string,
  ) => {},
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  setCurrentPage: (_page: number) => {},
});