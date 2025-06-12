export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      downloads: {
        Row: {
          created_at: string | null
          download_type: string | null
          id: string
          ip_address: unknown | null
          logo_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_type?: string | null
          id?: string
          ip_address?: unknown | null
          logo_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_type?: string | null
          id?: string
          ip_address?: unknown | null
          logo_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "logos"
            referencedColumns: ["id"]
          },
        ]
      }
      logo_invitations: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string
          expires_at: string | null
          id: string
          invite_token: string | null
          invited_by: string
          invited_email: string
          logo_id: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_token?: string | null
          invited_by: string
          invited_email: string
          logo_id: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          expires_at?: string | null
          id?: string
          invite_token?: string | null
          invited_by?: string
          invited_email?: string
          logo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "logo_invitations_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "logos"
            referencedColumns: ["id"]
          },
        ]
      }
      logos: {
        Row: {
          client_name: string | null
          colors: Json | null
          created_at: string | null
          download_count: number | null
          external_links: Json | null
          file_path: string
          file_size: number | null
          file_type: string
          fonts: Json | null
          id: string
          is_public: boolean | null
          notes: string | null
          share_token: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_name?: string | null
          colors?: Json | null
          created_at?: string | null
          download_count?: number | null
          external_links?: Json | null
          file_path: string
          file_size?: number | null
          file_type: string
          fonts?: Json | null
          id?: string
          is_public?: boolean | null
          notes?: string | null
          share_token?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_name?: string | null
          colors?: Json | null
          created_at?: string | null
          download_count?: number | null
          external_links?: Json | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          fonts?: Json | null
          id?: string
          is_public?: boolean | null
          notes?: string | null
          share_token?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          affiliate_notifications: boolean | null
          avatar_url: string | null
          branding_background_url: string | null
          branding_enabled: boolean | null
          branding_overlay_opacity: number | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          sales_notifications: boolean | null
          stripe_customer_id: string | null
          subscription_end: string | null
          subscription_status: string | null
          test_mode_notifications: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          affiliate_notifications?: boolean | null
          avatar_url?: string | null
          branding_background_url?: string | null
          branding_enabled?: boolean | null
          branding_overlay_opacity?: number | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          sales_notifications?: boolean | null
          stripe_customer_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          test_mode_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          affiliate_notifications?: boolean | null
          avatar_url?: string | null
          branding_background_url?: string | null
          branding_enabled?: boolean | null
          branding_overlay_opacity?: number | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          sales_notifications?: boolean | null
          stripe_customer_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          test_mode_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shares: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          logo_id: string
          recipient_email: string | null
          shared_by: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_id: string
          recipient_email?: string | null
          shared_by: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_id?: string
          recipient_email?: string | null
          shared_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "logos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invite_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      access_level: "view" | "download" | "edit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["view", "download", "edit"],
    },
  },
} as const
