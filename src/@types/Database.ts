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
          active_status: boolean;
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
          active_status?: boolean;
        };
        Update: {
          name?: string;
          price?: number;
          discount?: boolean;
          discount_amount?: number;
          short_description?: string;
          long_description?: string;
          image_url?: string;
          active_status?: boolean;
        };
      };
    };
  };
};

export type FetchResult = {
    id: string;
    name: string;
    price: number;
    discount: boolean;
    discount_amount: number | null;
    image_url?: string;
    short_description?: string;
    long_description?: string;
    created_at?: string;
    active_status?: boolean;
}

export type shippingData = {
  email: string,
  phone: string,
  firstName: string,
  lastName: string,
  adress: string,
  place: string,
  postNr: string
}

