export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  api: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_payment_event: {
        Args: {
          p_amount_irr: number
          p_payload_hash: string
          p_provider: string
          p_provider_event_id: string
          p_provider_reference: string
          p_status: Database["public"]["Enums"]["payment_status"]
        }
        Returns: {
          applied: boolean
          order_id: string
          order_status: Database["public"]["Enums"]["order_status"]
        }[]
      }
      cancel_own_order: {
        Args: { p_order_id: string; p_reason?: string }
        Returns: Database["public"]["Enums"]["order_status"]
      }
      create_pending_order: {
        Args: {
          p_address_id: string
          p_idempotency_key: string
          p_items: Json
          p_restaurant_id: string
        }
        Returns: {
          order_id: string
          reused: boolean
          tracking_token: string
        }[]
      }
      get_public_tracking: {
        Args: { p_token: string }
        Returns: {
          created_at: string
          restaurant_name: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
        }[]
      }
      transition_order_status: {
        Args: {
          p_order_id: string
          p_reason?: string
          p_to_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: Database["public"]["Enums"]["order_status"]
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
      addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string
          id: string
          is_default: boolean
          latitude: number | null
          longitude: number | null
          postal_code: string
          province: string
          recipient_name: string
          recipient_phone: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          latitude?: number | null
          longitude?: number | null
          postal_code: string
          province: string
          recipient_name: string
          recipient_phone: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          latitude?: number | null
          longitude?: number | null
          postal_code?: string
          province?: string
          recipient_name?: string
          recipient_phone?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          normalized_name: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          normalized_name?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          normalized_name?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          restaurant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          restaurant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          restaurant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          addons_snapshot: Json
          id: string
          line_total_irr: number
          order_id: string
          product_id: string | null
          product_name_snapshot: string
          quantity: number
          unit_price_irr: number
          variant_snapshot: Json | null
        }
        Insert: {
          addons_snapshot?: Json
          id?: string
          line_total_irr: number
          order_id: string
          product_id?: string | null
          product_name_snapshot: string
          quantity: number
          unit_price_irr: number
          variant_snapshot?: Json | null
        }
        Update: {
          addons_snapshot?: Json
          id?: string
          line_total_irr?: number
          order_id?: string
          product_id?: string | null
          product_name_snapshot?: string
          quantity?: number
          unit_price_irr?: number
          variant_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          actor_id: string | null
          actor_type: string
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: number
          order_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          actor_id?: string | null
          actor_type: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: never
          order_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: never
          order_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          address_snapshot: Json
          created_at: string
          delivery_fee_irr: number
          id: string
          idempotency_key: string
          restaurant_id: string
          restaurant_name_snapshot: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal_irr: number
          tax_irr: number
          total_irr: number
          tracking_token_hash: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          address_snapshot: Json
          created_at?: string
          delivery_fee_irr: number
          id?: string
          idempotency_key: string
          restaurant_id: string
          restaurant_name_snapshot: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_irr: number
          tax_irr: number
          total_irr: number
          tracking_token_hash: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          address_snapshot?: Json
          created_at?: string
          delivery_fee_irr?: number
          id?: string
          idempotency_key?: string
          restaurant_id?: string
          restaurant_name_snapshot?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_irr?: number
          tax_irr?: number
          total_irr?: number
          tracking_token_hash?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          applied: boolean
          event_status: Database["public"]["Enums"]["payment_status"]
          id: number
          payload_hash: string
          payment_id: string | null
          provider: string
          provider_event_id: string
          received_at: string
        }
        Insert: {
          applied?: boolean
          event_status: Database["public"]["Enums"]["payment_status"]
          id?: never
          payload_hash: string
          payment_id?: string | null
          provider: string
          provider_event_id: string
          received_at?: string
        }
        Update: {
          applied?: boolean
          event_status?: Database["public"]["Enums"]["payment_status"]
          id?: never
          payload_hash?: string
          payment_id?: string | null
          provider?: string
          provider_event_id?: string
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_irr: number
          created_at: string
          id: string
          order_id: string
          provider: string
          provider_reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount_irr: number
          created_at?: string
          id?: string
          order_id: string
          provider: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount_irr?: number
          created_at?: string
          id?: string
          order_id?: string
          provider?: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_addons: {
        Row: {
          id: string
          is_available: boolean
          name: string
          price_irr: number
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_available?: boolean
          name: string
          price_irr?: number
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_available?: boolean
          name?: string
          price_irr?: number
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_addons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          is_available: boolean
          name: string
          price_adjustment_irr: number
          product_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_available?: boolean
          name: string
          price_adjustment_irr?: number
          product_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_available?: boolean
          name?: string
          price_adjustment_irr?: number
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string
          id: string
          image_path: string | null
          is_available: boolean
          name: string
          normalized_name: string | null
          price_irr: number
          restaurant_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          image_path?: string | null
          is_available?: boolean
          name: string
          normalized_name?: string | null
          price_irr: number
          restaurant_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          image_path?: string | null
          is_available?: boolean
          name?: string
          normalized_name?: string | null
          price_irr?: number
          restaurant_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string
          id: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_categories: {
        Row: {
          category_id: string
          restaurant_id: string
        }
        Insert: {
          category_id: string
          restaurant_id: string
        }
        Update: {
          category_id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          cover_path: string | null
          created_at: string
          delivery_fee_irr: number
          description: string
          estimated_delivery_max: number
          estimated_delivery_min: number
          id: string
          is_active: boolean
          logo_path: string | null
          minimum_order_irr: number
          name: string
          normalized_name: string | null
          rating: number
          slug: string
          tax_rate_bps: number
          updated_at: string
        }
        Insert: {
          cover_path?: string | null
          created_at?: string
          delivery_fee_irr?: number
          description?: string
          estimated_delivery_max?: number
          estimated_delivery_min?: number
          id?: string
          is_active?: boolean
          logo_path?: string | null
          minimum_order_irr?: number
          name: string
          normalized_name?: string | null
          rating?: number
          slug: string
          tax_rate_bps?: number
          updated_at?: string
        }
        Update: {
          cover_path?: string | null
          created_at?: string
          delivery_fee_irr?: number
          description?: string
          estimated_delivery_max?: number
          estimated_delivery_min?: number
          id?: string
          is_active?: boolean
          logo_path?: string | null
          minimum_order_irr?: number
          name?: string
          normalized_name?: string | null
          rating?: number
          slug?: string
          tax_rate_bps?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending_payment"
        | "confirmed"
        | "preparing"
        | "ready"
        | "delivering"
        | "delivered"
        | "canceled"
      payment_status:
        | "created"
        | "pending"
        | "succeeded"
        | "failed"
        | "canceled"
        | "refunded"
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
  api: {
    Enums: {},
  },
  public: {
    Enums: {
      order_status: [
        "pending_payment",
        "confirmed",
        "preparing",
        "ready",
        "delivering",
        "delivered",
        "canceled",
      ],
      payment_status: [
        "created",
        "pending",
        "succeeded",
        "failed",
        "canceled",
        "refunded",
      ],
    },
  },
} as const
