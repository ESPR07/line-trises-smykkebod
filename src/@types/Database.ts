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

      orders: {
        Row: {
          id: string;
          order_id: string;
          customer_email: string;
          customer_phone: string;
          customer_firstName: string;
          customer_lastName: string;
          customer_adress: string;
          customer_place: string;
          customer_postNr: string;
          status: string;
          cart: {
            id: string;
            name: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
          }[];
          totals: {
            verifiedTotal: number;
            itemCount: number;
          };
          meta: {
            createdAt: string;
            clientPlatform: string;
          };
        };
        Insert: {
          id?: string;
          customer: {
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            adress: string;
            sted: string;
            postNr: string;
          };
          cart: {
            id: string;
            name: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
          }[];
          totals: {
            verifiedTotal: number;
            itemCount: number;
          };
          meta: {
            createdAt: string;
            clientPlatform: string;
          };
        };
        Update: {
          customer?: {
            email?: string;
            phone?: string;
            firstName?: string;
            lastName?: string;
            adress?: string;
            sted?: string;
            postNr?: string;
          };
          cart?: {
            id: string;
            name: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
          }[];
          totals?: {
            verifiedTotal?: number;
            itemCount?: number;
          };
          meta?: {
            createdAt?: string;
            clientPlatform?: string;
          };
        };
      };
      custom_options: {
        Row: {
          id: number;
          type: string;
          type_options: CustomOptionGroup[];
        };
        Insert: {
          id?: number;
          type: string;
          type_options: CustomOptionGroup[];
        };
        Update: {
          type?: string;
          type_options?: CustomOptionGroup[];
        };
      };
      custom_products: {
        Row: {
          id: string;
          configuration: Record<string, any>;
          calculated_price: number;
          expires_at: string | null;
          is_purchased: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          configuration: Record<string, any>;
          calculated_price: number;
          expires_at?: string | null;
          is_purchased?: boolean;
          created_at?: string;
        };
        Update: {
          configuration?: Record<string, any>;
          calculated_price?: number;
          expires_at?: string | null;
          is_purchased?: boolean;
          created_at?: string;
        };
      };
    };
  };
};

export type CustomOptionItem = {
  id: string;
  name: string;
  price: number;
};

export type CustomOptionGroup = {
  key: string;
  options: CustomOptionItem[];
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
};

export type shippingData = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  adress: string;
  place: string;
  postNr: string;
};

export interface NewOrderData {
  customer_email: string;
  customer_phone: string;
  customer_firstName: string;
  customer_lastName: string;
  customer_adress: string;
  customer_place: string;
  customer_postNr: string;

  cart: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];

  totals: {
    verifiedTotal: number;
    itemCount: number;
  };

  meta: {
    createdAt: string;
    clientPlatform: string;
  };
}

export type OrderItem = {
  id: string;
  order_id: string;
  customer_email: string;
  customer_phone: string;
  customer_firstName: string;
  customer_lastName: string;
  customer_adress: string;
  customer_place: string;
  customer_postNr: string;
  status: string;
  cart: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  totals: {
    verifiedTotal: number;
    itemCount: number;
  };
  meta: {
    createdAt: string;
    clientPlatform: string;
  };
};
