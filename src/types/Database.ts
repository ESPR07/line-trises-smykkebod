export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number
          title: string
          is_complete: boolean
        }
        Insert: {
          title: string
          is_complete?: boolean
        }
        Update: {
          title?: string
          is_complete?: boolean
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type FetchResult = {
    id: number,
    name: string,
    price: number,
    created_at: string,
    discount: boolean,
    discount_amount: number | null,
    image_url: string,
    short_description: string,
    long_description: string
  }