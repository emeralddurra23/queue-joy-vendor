export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_stats: {
        Row: {
          abandonment_rate: number | null
          avg_wait_minutes: number | null
          created_at: string
          date: string
          id: string
          peak_hour: number | null
          revenue: number | null
          total_customers: number | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          abandonment_rate?: number | null
          avg_wait_minutes?: number | null
          created_at?: string
          date: string
          id?: string
          peak_hour?: number | null
          revenue?: number | null
          total_customers?: number | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          abandonment_rate?: number | null
          avg_wait_minutes?: number | null
          created_at?: string
          date?: string
          id?: string
          peak_hour?: number | null
          revenue?: number | null
          total_customers?: number | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_stats_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          is_bestseller: boolean | null
          is_special: boolean | null
          name: string
          prep_time_minutes: number | null
          price: number | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          is_bestseller?: boolean | null
          is_special?: boolean | null
          name: string
          prep_time_minutes?: number | null
          price?: number | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          is_bestseller?: boolean | null
          is_special?: boolean | null
          name?: string
          prep_time_minutes?: number | null
          price?: number | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          delivered: boolean | null
          id: string
          message: string
          sent_at: string | null
          ticket_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string
          delivered?: boolean | null
          id?: string
          message: string
          sent_at?: string | null
          ticket_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string
          delivered?: boolean | null
          id?: string
          message?: string
          sent_at?: string | null
          ticket_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "queue_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          quantity: number
          special_instructions: string | null
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          quantity?: number
          special_instructions?: string | null
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          quantity?: number
          special_instructions?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "queue_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_tickets: {
        Row: {
          abandoned_time: string | null
          actual_wait_minutes: number | null
          completed_time: string | null
          created_at: string
          customer_name: string | null
          customer_phone: string | null
          estimated_wait_minutes: number | null
          id: string
          order_start_time: string | null
          prep_start_time: string | null
          ready_time: string | null
          status: Database["public"]["Enums"]["queue_status"]
          ticket_code: string
          ticket_number: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          abandoned_time?: string | null
          actual_wait_minutes?: number | null
          completed_time?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          estimated_wait_minutes?: number | null
          id?: string
          order_start_time?: string | null
          prep_start_time?: string | null
          ready_time?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          ticket_code: string
          ticket_number: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          abandoned_time?: string | null
          actual_wait_minutes?: number | null
          completed_time?: string | null
          created_at?: string
          customer_name?: string | null
          customer_phone?: string | null
          estimated_wait_minutes?: number | null
          id?: string
          order_start_time?: string | null
          prep_start_time?: string | null
          ready_time?: string | null
          status?: Database["public"]["Enums"]["queue_status"]
          ticket_code?: string
          ticket_number?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_tickets_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string
          id: string
          qr_badge_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          qr_badge_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          qr_badge_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          api_endpoint: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          created_at?: string
          id?: string
          name?: string
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
      notification_type: "in_app" | "sms" | "whatsapp"
      queue_status:
        | "waiting"
        | "ordering"
        | "preparing"
        | "ready"
        | "completed"
        | "abandoned"
      user_role: "owner" | "staff"
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
  public: {
    Enums: {
      notification_type: ["in_app", "sms", "whatsapp"],
      queue_status: [
        "waiting",
        "ordering",
        "preparing",
        "ready",
        "completed",
        "abandoned",
      ],
      user_role: ["owner", "staff"],
    },
  },
} as const
