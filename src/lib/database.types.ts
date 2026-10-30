export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          address_details: string | null
          admin_notes: string | null
          carrier: string | null
          city: string
          created_at: string
          currency: string
          customer_name: string
          department: string
          email: string | null
          event_id: string | null
          fbclid: string | null
          id: string
          ip: unknown
          items: Json
          landing_page: string | null
          notes: string | null
          number: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_provider_id: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          referrer: string | null
          shipping: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number: string | null
          ttclid: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          address: string
          address_details?: string | null
          admin_notes?: string | null
          carrier?: string | null
          city: string
          created_at?: string
          currency?: string
          customer_name: string
          department: string
          email?: string | null
          event_id?: string | null
          fbclid?: string | null
          id?: string
          ip?: unknown
          items: Json
          landing_page?: string | null
          notes?: string | null
          number?: never
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_provider_id?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          referrer?: string | null
          shipping?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          tracking_number?: string | null
          ttclid?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          address?: string
          address_details?: string | null
          admin_notes?: string | null
          carrier?: string | null
          city?: string
          created_at?: string
          currency?: string
          customer_name?: string
          department?: string
          email?: string | null
          event_id?: string | null
          fbclid?: string | null
          id?: string
          ip?: unknown
          items?: Json
          landing_page?: string | null
          notes?: string | null
          number?: never
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_provider_id?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          referrer?: string | null
          shipping?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          tracking_number?: string | null
          ttclid?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          badge: string | null
          bundles: Json
          compare_at_price: number | null
          created_at: string
          description: string | null
          faq: Json
          featured: boolean
          features: Json
          headline: string | null
          id: string
          images: Json
          in_the_box: Json
          moments: Json
          name: string
          price: number
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort: number
          specs: Json
          specs_confirmed: boolean
          stock: number | null
          tags: string[]
          updated_at: string
          variants: Json
          video_url: string | null
        }
        Insert: {
          active?: boolean
          badge?: string | null
          bundles?: Json
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          faq?: Json
          featured?: boolean
          features?: Json
          headline?: string | null
          id?: string
          images?: Json
          in_the_box?: Json
          moments?: Json
          name: string
          price: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort?: number
          specs?: Json
          specs_confirmed?: boolean
          stock?: number | null
          tags?: string[]
          updated_at?: string
          variants?: Json
          video_url?: string | null
        }
        Update: {
          active?: boolean
          badge?: string | null
          bundles?: Json
          compare_at_price?: number | null
          created_at?: string
          description?: string | null
          faq?: Json
          featured?: boolean
          features?: Json
          headline?: string | null
          id?: string
          images?: Json
          in_the_box?: Json
          moments?: Json
          name?: string
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort?: number
          specs?: Json
          specs_confirmed?: boolean
          stock?: number | null
          tags?: string[]
          updated_at?: string
          variants?: Json
          video_url?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author: string
          body: string
          city: string | null
          created_at: string
          id: string
          photo_url: string | null
          product_id: string | null
          published: boolean
          rating: number
        }
        Insert: {
          author: string
          body: string
          city?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          product_id?: string | null
          published?: boolean
          rating?: number
        }
        Update: {
          author?: string
          body?: string
          city?: string | null
          created_at?: string
          id?: string
          photo_url?: string | null
          product_id?: string | null
          published?: boolean
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          announcement: string | null
          cod_enabled: boolean
          delivery_estimate: string
          facebook_url: string | null
          free_shipping: boolean
          hero_poster_url: string | null
          hero_video_url: string | null
          id: number
          instagram_handle: string | null
          legal_address: string | null
          legal_name: string | null
          meta_pixel_id: string | null
          online_payment_enabled: boolean
          shipping_cost: number
          store_name: string
          support_email: string | null
          tax_id: string | null
          tiktok_handle: string | null
          tiktok_pixel_id: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          announcement?: string | null
          cod_enabled?: boolean
          delivery_estimate?: string
          facebook_url?: string | null
          free_shipping?: boolean
          hero_poster_url?: string | null
          hero_video_url?: string | null
          id?: number
          instagram_handle?: string | null
          legal_address?: string | null
          legal_name?: string | null
          meta_pixel_id?: string | null
          online_payment_enabled?: boolean
          shipping_cost?: number
          store_name: string
          support_email?: string | null
          tax_id?: string | null
          tiktok_handle?: string | null
          tiktok_pixel_id?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          announcement?: string | null
          cod_enabled?: boolean
          delivery_estimate?: string
          facebook_url?: string | null
          free_shipping?: boolean
          hero_poster_url?: string | null
          hero_video_url?: string | null
          id?: number
          instagram_handle?: string | null
          legal_address?: string | null
          legal_name?: string | null
          meta_pixel_id?: string | null
          online_payment_enabled?: boolean
          shipping_cost?: number
          store_name?: string
          support_email?: string | null
          tax_id?: string | null
          tiktok_handle?: string | null
          tiktok_pixel_id?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          id: string
          landing_page: string | null
          referrer: string | null
          session_id: string
          ttclid: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          landing_page?: string | null
          referrer?: string | null
          session_id: string
          ttclid?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          landing_page?: string | null
          referrer?: string | null
          session_id?: string
          ttclid?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_campaign_stats: {
        Args: { p_days?: number }
        Returns: {
          campaign: string
          orders: number
          revenue: number
          source: string
          visits: number
        }[]
      }
      admin_summary: {
        Args: { p_days?: number }
        Returns: {
          delivered_period: number
          orders_period: number
          orders_today: number
          pending_confirmation: number
          returned_period: number
          revenue_period: number
          revenue_today: number
          visits_period: number
        }[]
      }
      decrement_stock: {
        Args: { p_product_id: string; p_qty: number }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      order_status:
        | "nuevo"
        | "confirmado"
        | "enviado"
        | "entregado"
        | "cancelado"
        | "devuelto"
      payment_method: "contraentrega" | "online"
      payment_status: "pendiente" | "pagado" | "fallido"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      order_status: [
        "nuevo",
        "confirmado",
        "enviado",
        "entregado",
        "cancelado",
        "devuelto",
      ],
      payment_method: ["contraentrega", "online"],
      payment_status: ["pendiente", "pagado", "fallido"],
    },
  },
} as const

