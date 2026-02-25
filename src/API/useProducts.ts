import { useState } from "react";
import { supabaseClient } from "../components/utils/supabaseClient";
import { Database } from "../@types/Database";

export function useProductList() {
  const [productList, setProductList] = useState<
    Database["public"]["Tables"]["products"]["Row"][] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const itemsPerPage = 10;

  async function fetchProducts(
    page: number = 1,
    activeStatus?: boolean,
    searchQuery?: string,
    categories?: string[],
  ) {
    try {
      setIsLoading(true);
      setIsError(false);

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabaseClient
        .from("products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (activeStatus) query = query.eq("active_status", true);

      if (searchQuery?.trim()) {
        query = query.or(
          `name.ilike.%${searchQuery}%,long_description.ilike.%${searchQuery}%`,
        );
      }

      if (categories?.length) {
        query = query.filter("categories", "cs", JSON.stringify(categories));
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
        setIsError(true);
      } else if (data) {
        setProductList(data);
        if (count !== null) setTotalProducts(count);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return {
    productList,
    isLoading,
    isError,
    fetchProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
  };
}
