import { createClient } from "@supabase/supabase-js";
import { Database, FetchResult } from "../types/Database";
import { useEffect, useState } from "react";

const supabaseURL : string = import.meta.env.VITE_SUPABASE_URL;
const supabaseAPIKey : string = import.meta.env.VITE_SUPABASE_KEY;
const supabaseClient = createClient<Database>(supabaseURL, supabaseAPIKey);

export function getSingleProduct(id : number) {
  const [product, setProduct] = useState<FetchResult[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    async function APIFetch() {
      try {
        setIsLoading(true);
        setIsError(false);
        const {data, error} = await supabaseClient
          .from('products')
          .select()
          .eq("id", id)

        if(data) {
          setProduct(data);
        } else {
          console.log(error);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    APIFetch();
  }, [id])

  return {product, isLoading, isError};
}