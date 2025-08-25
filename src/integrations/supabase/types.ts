export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      company_settings: {
        Row: {
          addresses: Json | null
          auto_response_message: string | null
          brand_accent_color: string
          brand_primary_color: string
          business_hours: Json | null
          company_name: string
          contact_emails: Json | null
          contact_phones: Json | null
          created_at: string
          id: string
          response_time_hours: number | null
          social_media: Json | null
          support_email: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          addresses?: Json | null
          auto_response_message?: string | null
          brand_accent_color?: string
          brand_primary_color?: string
          business_hours?: Json | null
          company_name?: string
          contact_emails?: Json | null
          contact_phones?: Json | null
          created_at?: string
          id?: string
          response_time_hours?: number | null
          social_media?: Json | null
          support_email?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Update: {
          addresses?: Json | null
          auto_response_message?: string | null
          brand_accent_color?: string
          brand_primary_color?: string
          business_hours?: Json | null
          company_name?: string
          contact_emails?: Json | null
          contact_phones?: Json | null
          created_at?: string
          id?: string
          response_time_hours?: number | null
          social_media?: Json | null
          support_email?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean
          is_primary: boolean
          label: string
          metadata: Json | null
          type: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          label: string
          metadata?: Json | null
          type: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean
          is_primary?: boolean
          label?: string
          metadata?: Json | null
          type?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      custom_tags: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          page_paths: string[] | null
          position: string
          tag_type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          page_paths?: string[] | null
          position?: string
          tag_type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          page_paths?: string[] | null
          position?: string
          tag_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      form_fields: {
        Row: {
          created_at: string
          field_label: string
          field_name: string
          field_order: number
          field_type: string
          form_id: string
          id: string
          is_required: boolean
          options: string[] | null
          placeholder_text: string | null
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          field_label: string
          field_name: string
          field_order?: number
          field_type?: string
          form_id: string
          id?: string
          is_required?: boolean
          options?: string[] | null
          placeholder_text?: string | null
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          field_label?: string
          field_name?: string
          field_order?: number
          field_type?: string
          form_id?: string
          id?: string
          is_required?: boolean
          options?: string[] | null
          placeholder_text?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "qualification_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      logos: {
        Row: {
          created_at: string
          file_path: string
          height: number | null
          id: string
          is_active: boolean
          name: string
          public_url: string
          type: string
          updated_at: string
          usage_context: string | null
          variant: string
          width: number | null
        }
        Insert: {
          created_at?: string
          file_path: string
          height?: number | null
          id?: string
          is_active?: boolean
          name: string
          public_url: string
          type: string
          updated_at?: string
          usage_context?: string | null
          variant: string
          width?: number | null
        }
        Update: {
          created_at?: string
          file_path?: string
          height?: number | null
          id?: string
          is_active?: boolean
          name?: string
          public_url?: string
          type?: string
          updated_at?: string
          usage_context?: string | null
          variant?: string
          width?: number | null
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          keywords: string[] | null
          meta_description: string
          no_follow: boolean
          no_index: boolean
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_path: string
          schema_org_data: Json | null
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          meta_description: string
          no_follow?: boolean
          no_index?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path: string
          schema_org_data?: Json | null
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          meta_description?: string
          no_follow?: boolean
          no_index?: boolean
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_path?: string
          schema_org_data?: Json | null
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qualification_forms: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          name: string
          page_paths: string[] | null
          redirect_delay: number
          redirect_to_whatsapp: boolean
          thank_you_message: string
          thank_you_title: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name: string
          page_paths?: string[] | null
          redirect_delay?: number
          redirect_to_whatsapp?: boolean
          thank_you_message?: string
          thank_you_title?: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          name?: string
          page_paths?: string[] | null
          redirect_delay?: number
          redirect_to_whatsapp?: boolean
          thank_you_message?: string
          thank_you_title?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      qualification_submissions: {
        Row: {
          created_at: string
          form_data: Json
          form_id: string
          id: string
          ip_address: unknown | null
          source_page: string | null
          status: string
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          form_data: Json
          form_id: string
          id?: string
          ip_address?: unknown | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          form_data?: Json
          form_id?: string
          id?: string
          ip_address?: unknown | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qualification_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "qualification_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_settings: {
        Row: {
          canonical_base_url: string
          created_at: string
          facebook_pixel_id: string | null
          google_analytics_id: string | null
          google_tag_manager_id: string | null
          hotjar_id: string | null
          id: string
          meta_description: string
          og_image: string | null
          robots_txt_content: string
          schema_org_organization: Json | null
          site_name: string
          title_template: string
          twitter_handle: string | null
          updated_at: string
        }
        Insert: {
          canonical_base_url?: string
          created_at?: string
          facebook_pixel_id?: string | null
          google_analytics_id?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: string
          meta_description?: string
          og_image?: string | null
          robots_txt_content?: string
          schema_org_organization?: Json | null
          site_name?: string
          title_template?: string
          twitter_handle?: string | null
          updated_at?: string
        }
        Update: {
          canonical_base_url?: string
          created_at?: string
          facebook_pixel_id?: string | null
          google_analytics_id?: string | null
          google_tag_manager_id?: string | null
          hotjar_id?: string | null
          id?: string
          meta_description?: string
          og_image?: string | null
          robots_txt_content?: string
          schema_org_organization?: Json | null
          site_name?: string
          title_template?: string
          twitter_handle?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
