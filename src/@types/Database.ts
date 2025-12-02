export type Database = {
  public: {
    Tables: {
      todos: {
        Row: { id: number; title: string; is_complete: boolean };
        Insert: { title: string; is_complete?: boolean };
        Update: { title?: string; is_complete?: boolean };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          discount: boolean;
          discount_amount: number;
          short_description?: string;
          long_description?: string;
          image_url?: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          discount: boolean;
          discount_amount: number;
          short_description?: string;
          long_description?: string;
          image_url?: string;
        };
        Update: {
          name?: string;
          price?: number;
          discount?: boolean;
          discount_amount?: number;
          short_description?: string;
          long_description?: string;
          image_url?: string;
        };
      };
    };
  };
};


export type FetchResult = {
    id: string,
    name: string,
    price: number,
    created_at: string,
    discount: boolean,
    discount_amount: number | null,
    image_url: string,
    short_description: string,
    long_description: string,
    active_status: boolean
  }