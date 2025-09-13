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
      client_notification_preferences: {
        Row: {
          client_contact_id: string
          created_at: string
          email_notifications: boolean | null
          frequency: string | null
          id: string
          milestone_notifications: boolean | null
          report_notifications: boolean | null
          task_notifications: boolean | null
          updated_at: string
        }
        Insert: {
          client_contact_id: string
          created_at?: string
          email_notifications?: boolean | null
          frequency?: string | null
          id?: string
          milestone_notifications?: boolean | null
          report_notifications?: boolean | null
          task_notifications?: boolean | null
          updated_at?: string
        }
        Update: {
          client_contact_id?: string
          created_at?: string
          email_notifications?: boolean | null
          frequency?: string | null
          id?: string
          milestone_notifications?: boolean | null
          report_notifications?: boolean | null
          task_notifications?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      company_culture: {
        Row: {
          application_info: string | null
          benefits: Json | null
          created_at: string
          culture_description: string | null
          id: string
          selection_process: Json | null
          updated_at: string
        }
        Insert: {
          application_info?: string | null
          benefits?: Json | null
          created_at?: string
          culture_description?: string | null
          id?: string
          selection_process?: Json | null
          updated_at?: string
        }
        Update: {
          application_info?: string | null
          benefits?: Json | null
          created_at?: string
          culture_description?: string | null
          id?: string
          selection_process?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      company_manifesto: {
        Row: {
          created_at: string
          dna_content: string
          dna_title: string
          history_content: string
          history_title: string
          id: string
          manifesto_content: string
          manifesto_title: string
          principles: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          dna_content?: string
          dna_title?: string
          history_content?: string
          history_title?: string
          id?: string
          manifesto_content?: string
          manifesto_title?: string
          principles?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          dna_content?: string
          dna_title?: string
          history_content?: string
          history_title?: string
          id?: string
          manifesto_content?: string
          manifesto_title?: string
          principles?: Json
          updated_at?: string
        }
        Relationships: []
      }
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
          is_public: boolean
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
          is_public?: boolean
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
          is_public?: boolean
          label?: string
          metadata?: Json | null
          type?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      craft_ideas: {
        Row: {
          business_model: string | null
          created_at: string
          current_stage: string | null
          development_roadmap: string | null
          estimated_investment: string | null
          estimated_timeline: string | null
          id: string
          ideal_partners: string[] | null
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          keywords: string[] | null
          meta_description: string | null
          mvp_description: string | null
          next_steps: string | null
          pain_points: string[] | null
          problem_thesis: string
          proposed_solution: string
          required_skills: string[] | null
          revenue_streams: string[] | null
          risk_assessment: string | null
          slug: string
          status: string
          target_persona: string
          title: string
          updated_at: string
        }
        Insert: {
          business_model?: string | null
          created_at?: string
          current_stage?: string | null
          development_roadmap?: string | null
          estimated_investment?: string | null
          estimated_timeline?: string | null
          id?: string
          ideal_partners?: string[] | null
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          mvp_description?: string | null
          next_steps?: string | null
          pain_points?: string[] | null
          problem_thesis: string
          proposed_solution: string
          required_skills?: string[] | null
          revenue_streams?: string[] | null
          risk_assessment?: string | null
          slug: string
          status?: string
          target_persona: string
          title: string
          updated_at?: string
        }
        Update: {
          business_model?: string | null
          created_at?: string
          current_stage?: string | null
          development_roadmap?: string | null
          estimated_investment?: string | null
          estimated_timeline?: string | null
          id?: string
          ideal_partners?: string[] | null
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          mvp_description?: string | null
          next_steps?: string | null
          pain_points?: string[] | null
          problem_thesis?: string
          proposed_solution?: string
          required_skills?: string[] | null
          revenue_streams?: string[] | null
          risk_assessment?: string | null
          slug?: string
          status?: string
          target_persona?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "craft_ideas_current_stage_fkey"
            columns: ["current_stage"]
            isOneToOne: false
            referencedRelation: "craft_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      craft_partnership_inquiries: {
        Row: {
          company: string | null
          contact_info: Json | null
          created_at: string
          id: string
          idea_id: string | null
          investment_capacity: string | null
          ip_address: unknown | null
          message: string
          partner_email: string
          partner_name: string
          partner_type: string
          portfolio_url: string | null
          skills_offered: string[] | null
          source_page: string | null
          status: string
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          company?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          idea_id?: string | null
          investment_capacity?: string | null
          ip_address?: unknown | null
          message: string
          partner_email: string
          partner_name: string
          partner_type?: string
          portfolio_url?: string | null
          skills_offered?: string[] | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          company?: string | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          idea_id?: string | null
          investment_capacity?: string | null
          ip_address?: unknown | null
          message?: string
          partner_email?: string
          partner_name?: string
          partner_type?: string
          portfolio_url?: string | null
          skills_offered?: string[] | null
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
            foreignKeyName: "craft_partnership_inquiries_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "craft_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      craft_stages: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_activities: {
        Row: {
          completed: boolean
          completed_at: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_contact_interactions: {
        Row: {
          channel_data: Json | null
          contact_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          interaction_date: string
          interaction_type: string
          next_steps: string | null
          outcome: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          channel_data?: Json | null
          contact_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_date?: string
          interaction_type: string
          next_steps?: string | null
          outcome?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          channel_data?: Json | null
          contact_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string
          next_steps?: string | null
          outcome?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contact_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          budget_range: string | null
          company: string | null
          company_size: string | null
          created_at: string
          custom_fields: Json | null
          decision_timeline: string | null
          email: string | null
          engagement_score: number | null
          icp_score: number | null
          id: string
          industry: string | null
          is_active: boolean
          job_title: string | null
          last_interaction_date: string | null
          lead_score: number | null
          lead_source: string | null
          lifecycle_stage: string | null
          name: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          pain_points: string[] | null
          phone: string | null
          products_interest: string[] | null
          social_media: Json | null
          source: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          custom_fields?: Json | null
          decision_timeline?: string | null
          email?: string | null
          engagement_score?: number | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean
          job_title?: string | null
          last_interaction_date?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lifecycle_stage?: string | null
          name: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          pain_points?: string[] | null
          phone?: string | null
          products_interest?: string[] | null
          social_media?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          company_size?: string | null
          created_at?: string
          custom_fields?: Json | null
          decision_timeline?: string | null
          email?: string | null
          engagement_score?: number | null
          icp_score?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean
          job_title?: string | null
          last_interaction_date?: string | null
          lead_score?: number | null
          lead_source?: string | null
          lifecycle_stage?: string | null
          name?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          pain_points?: string[] | null
          phone?: string | null
          products_interest?: string[] | null
          social_media?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      crm_custom_fields: {
        Row: {
          created_at: string
          display_order: number | null
          entity_type: string
          field_label: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          is_active: boolean
          is_required: boolean
          pipeline_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          entity_type: string
          field_label: string
          field_name: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          pipeline_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          entity_type?: string
          field_label?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_active?: boolean
          is_required?: boolean
          pipeline_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_deals: {
        Row: {
          assigned_to: string | null
          contact_id: string | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          id: string
          is_active: boolean
          pipeline_id: string
          probability: number | null
          source: string | null
          stage_id: string
          tags: string[] | null
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          is_active?: boolean
          pipeline_id: string
          probability?: number | null
          source?: string | null
          stage_id: string
          tags?: string[] | null
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          is_active?: boolean
          pipeline_id?: string
          probability?: number | null
          source?: string | null
          stage_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      crm_lead_scoring: {
        Row: {
          calculated_at: string
          contact_id: string
          created_at: string
          criteria: Json
          expires_at: string | null
          id: string
          is_active: boolean
          score_type: string
          score_value: number
          updated_at: string
        }
        Insert: {
          calculated_at?: string
          contact_id: string
          created_at?: string
          criteria?: Json
          expires_at?: string | null
          id?: string
          is_active?: boolean
          score_type: string
          score_value?: number
          updated_at?: string
        }
        Update: {
          calculated_at?: string
          contact_id?: string
          created_at?: string
          criteria?: Json
          expires_at?: string | null
          id?: string
          is_active?: boolean
          score_type?: string
          score_value?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_scoring_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_pipelines: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_product_interests: {
        Row: {
          budget_indicated: number | null
          contact_id: string
          created_at: string
          id: string
          interest_level: number
          notes: string | null
          product_category: string
          source_interaction: string | null
          specific_products: string[] | null
          timeline_indicated: string | null
          updated_at: string
        }
        Insert: {
          budget_indicated?: number | null
          contact_id: string
          created_at?: string
          id?: string
          interest_level?: number
          notes?: string | null
          product_category: string
          source_interaction?: string | null
          specific_products?: string[] | null
          timeline_indicated?: string | null
          updated_at?: string
        }
        Update: {
          budget_indicated?: number | null
          contact_id?: string
          created_at?: string
          id?: string
          interest_level?: number
          notes?: string | null
          product_category?: string
          source_interaction?: string | null
          specific_products?: string[] | null
          timeline_indicated?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_product_interests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stages: {
        Row: {
          auto_actions: Json | null
          color: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          pipeline_id: string
          updated_at: string
        }
        Insert: {
          auto_actions?: Json | null
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          pipeline_id: string
          updated_at?: string
        }
        Update: {
          auto_actions?: Json | null
          color?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          pipeline_id?: string
          updated_at?: string
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
      job_positions: {
        Row: {
          created_at: string
          description: string
          differentials: Json | null
          id: string
          location: string | null
          modality: string | null
          requirements: Json | null
          salary_range: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          differentials?: Json | null
          id?: string
          location?: string | null
          modality?: string | null
          requirements?: Json | null
          salary_range?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          differentials?: Json | null
          id?: string
          location?: string | null
          modality?: string | null
          requirements?: Json | null
          salary_range?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      newsletter_campaigns: {
        Row: {
          click_count: number | null
          content: string
          created_at: string
          id: string
          name: string
          open_count: number | null
          sent_at: string | null
          sent_count: number | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          click_count?: number | null
          content: string
          created_at?: string
          id?: string
          name: string
          open_count?: number | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          click_count?: number | null
          content?: string
          created_at?: string
          id?: string
          name?: string
          open_count?: number | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          ip_address: unknown | null
          source_page: string | null
          status: string
          unsubscribed_at: string | null
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          ip_address?: unknown | null
          source_page?: string | null
          status?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown | null
          source_page?: string | null
          status?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
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
      project_client_access: {
        Row: {
          access_level: string | null
          access_token: string | null
          client_contact_id: string
          created_at: string | null
          id: string
          invitation_accepted_at: string | null
          invitation_sent_at: string | null
          is_active: boolean | null
          last_accessed_at: string | null
          permissions: Json | null
          project_id: string
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          access_token?: string | null
          client_contact_id: string
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_sent_at?: string | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          permissions?: Json | null
          project_id: string
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          access_token?: string | null
          client_contact_id?: string
          created_at?: string | null
          id?: string
          invitation_accepted_at?: string | null
          invitation_sent_at?: string | null
          is_active?: boolean | null
          last_accessed_at?: string | null
          permissions?: Json | null
          project_id?: string
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_client_access_client_contact_id_fkey"
            columns: ["client_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_client_access_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_email_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          notification_type: string
          project_id: string
          recipient_email: string
          recipient_type: string
          retry_count: number | null
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notification_type: string
          project_id: string
          recipient_email: string
          recipient_type?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notification_type?: string
          project_id?: string
          recipient_email?: string
          recipient_type?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_milestones: {
        Row: {
          client_action_description: string | null
          client_action_required: boolean | null
          completed_date: string | null
          created_at: string | null
          deliverables: string[] | null
          dependencies: string[] | null
          description: string | null
          due_date: string
          id: string
          is_active: boolean | null
          milestone_type: string | null
          notification_sent: boolean | null
          project_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_action_description?: string | null
          client_action_required?: boolean | null
          completed_date?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          dependencies?: string[] | null
          description?: string | null
          due_date: string
          id?: string
          is_active?: boolean | null
          milestone_type?: string | null
          notification_sent?: boolean | null
          project_id: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_action_description?: string | null
          client_action_required?: boolean | null
          completed_date?: string | null
          created_at?: string | null
          deliverables?: string[] | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string
          id?: string
          is_active?: boolean | null
          milestone_type?: string | null
          notification_sent?: boolean | null
          project_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports: {
        Row: {
          content: Json
          created_at: string | null
          generated_at: string | null
          id: string
          is_active: boolean | null
          metrics: Json | null
          period_end: string | null
          period_start: string | null
          project_id: string
          report_type: string
          sent_at: string | null
          sent_to_client: boolean | null
          template_used: string | null
          title: string
        }
        Insert: {
          content: Json
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          metrics?: Json | null
          period_end?: string | null
          period_start?: string | null
          project_id: string
          report_type: string
          sent_at?: string | null
          sent_to_client?: boolean | null
          template_used?: string | null
          title: string
        }
        Update: {
          content?: Json
          created_at?: string | null
          generated_at?: string | null
          id?: string
          is_active?: boolean | null
          metrics?: Json | null
          period_end?: string | null
          period_start?: string | null
          project_id?: string
          report_type?: string
          sent_at?: string | null
          sent_to_client?: boolean | null
          template_used?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sprints: {
        Row: {
          burndown_data: Json | null
          created_at: string | null
          description: string | null
          end_date: string
          goal_description: string | null
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          sprint_number: number
          start_date: string
          status: string
          updated_at: string | null
          velocity_points: number | null
        }
        Insert: {
          burndown_data?: Json | null
          created_at?: string | null
          description?: string | null
          end_date: string
          goal_description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          sprint_number: number
          start_date: string
          status?: string
          updated_at?: string | null
          velocity_points?: number | null
        }
        Update: {
          burndown_data?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          goal_description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          sprint_number?: number
          start_date?: string
          status?: string
          updated_at?: string | null
          velocity_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_sprints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status_logs: {
        Row: {
          action_type: string
          change_description: string | null
          changed_by: string | null
          client_visible: boolean | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          project_id: string
        }
        Insert: {
          action_type: string
          change_description?: string | null
          changed_by?: string | null
          client_visible?: boolean | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          project_id: string
        }
        Update: {
          action_type?: string
          change_description?: string | null
          changed_by?: string | null
          client_visible?: boolean | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_status_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          acceptance_criteria: string[] | null
          actual_hours: number | null
          assigned_to: string | null
          client_visible: boolean | null
          completed_at: string | null
          created_at: string | null
          custom_fields: Json | null
          dependencies: string[] | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          priority: string | null
          project_id: string
          reporter_id: string | null
          sprint_id: string | null
          status: string
          story_points: number | null
          tags: string[] | null
          task_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          acceptance_criteria?: string[] | null
          actual_hours?: number | null
          assigned_to?: string | null
          client_visible?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          project_id: string
          reporter_id?: string | null
          sprint_id?: string | null
          status?: string
          story_points?: number | null
          tags?: string[] | null
          task_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          acceptance_criteria?: string[] | null
          actual_hours?: number | null
          assigned_to?: string | null
          client_visible?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          dependencies?: string[] | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          project_id?: string
          reporter_id?: string | null
          sprint_id?: string | null
          status?: string
          story_points?: number | null
          tags?: string[] | null
          task_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "project_sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      project_webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          project_id: string
          response_body: string | null
          response_code: number | null
          retry_count: number | null
          sent_at: string | null
          status: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          project_id: string
          response_body?: string | null
          response_code?: number | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          project_id?: string
          response_body?: string | null
          response_code?: number | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_end_date: string | null
          budget_value: number | null
          client_id: string | null
          created_at: string | null
          custom_fields: Json | null
          deal_id: string | null
          description: string | null
          expected_end_date: string | null
          id: string
          is_active: boolean | null
          priority: string | null
          progress_percentage: number | null
          project_manager_id: string | null
          project_type: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_end_date?: string | null
          budget_value?: number | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deal_id?: string | null
          description?: string | null
          expected_end_date?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          project_manager_id?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_end_date?: string | null
          budget_value?: number | null
          client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          deal_id?: string | null
          description?: string | null
          expected_end_date?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          progress_percentage?: number | null
          project_manager_id?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      public_company_settings: {
        Row: {
          brand_accent_color: string
          brand_primary_color: string
          business_hours: Json | null
          company_name: string
          created_at: string
          id: string
          public_support_email: string | null
          public_whatsapp_number: string | null
          social_media: Json | null
          updated_at: string
        }
        Insert: {
          brand_accent_color?: string
          brand_primary_color?: string
          business_hours?: Json | null
          company_name?: string
          created_at?: string
          id?: string
          public_support_email?: string | null
          public_whatsapp_number?: string | null
          social_media?: Json | null
          updated_at?: string
        }
        Update: {
          brand_accent_color?: string
          brand_primary_color?: string
          business_hours?: Json | null
          company_name?: string
          created_at?: string
          id?: string
          public_support_email?: string | null
          public_whatsapp_number?: string | null
          social_media?: Json | null
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
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      system_performance_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          end_time: string | null
          error_count: number | null
          id: string
          metadata: Json | null
          operation_type: string
          records_processed: number | null
          start_time: string
          status: string
          success_count: number | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          end_time?: string | null
          error_count?: number | null
          id?: string
          metadata?: Json | null
          operation_type: string
          records_processed?: number | null
          start_time?: string
          status?: string
          success_count?: number | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          end_time?: string | null
          error_count?: number | null
          id?: string
          metadata?: Json | null
          operation_type?: string
          records_processed?: number | null
          start_time?: string
          status?: string
          success_count?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          curriculum_content: string | null
          curriculum_is_public: boolean
          curriculum_slug: string | null
          display_order: number | null
          expertise: Json | null
          id: string
          is_active: boolean
          name: string
          position: string
          social_links: Json | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          curriculum_content?: string | null
          curriculum_is_public?: boolean
          curriculum_slug?: string | null
          display_order?: number | null
          expertise?: Json | null
          id?: string
          is_active?: boolean
          name: string
          position: string
          social_links?: Json | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          curriculum_content?: string | null
          curriculum_is_public?: boolean
          curriculum_slug?: string | null
          display_order?: number | null
          expertise?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          position?: string
          social_links?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      workshop_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      workshop_enrollments: {
        Row: {
          company: string | null
          created_at: string
          email: string
          expectations: string | null
          experience_level: string | null
          honeypot_field: string | null
          id: string
          ip_address: unknown | null
          name: string
          phone: string | null
          preferred_modality: string | null
          source_page: string | null
          status: string
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          workshop_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          expectations?: string | null
          experience_level?: string | null
          honeypot_field?: string | null
          id?: string
          ip_address?: unknown | null
          name: string
          phone?: string | null
          preferred_modality?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          workshop_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          expectations?: string | null
          experience_level?: string | null
          honeypot_field?: string | null
          id?: string
          ip_address?: unknown | null
          name?: string
          phone?: string | null
          preferred_modality?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_enrollments_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_instructor_assignments: {
        Row: {
          created_at: string
          id: string
          instructor_id: string
          role: string
          workshop_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          instructor_id: string
          role?: string
          workshop_id: string
        }
        Update: {
          created_at?: string
          id?: string
          instructor_id?: string
          role?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_instructor_assignments_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "workshop_instructors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workshop_instructor_assignments_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_instructors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          github_url: string | null
          id: string
          is_active: boolean
          linkedin_url: string | null
          name: string
          portfolio_url: string | null
          slug: string
          specialties: string[] | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          portfolio_url?: string | null
          slug: string
          specialties?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          portfolio_url?: string | null
          slug?: string
          specialties?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      workshop_modules: {
        Row: {
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          module_order: number
          title: string
          topics: string[] | null
          workshop_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          module_order: number
          title: string
          topics?: string[] | null
          workshop_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          module_order?: number
          title?: string
          topics?: string[] | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_modules_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          category_id: string | null
          certificate_included: boolean
          created_at: string
          description: string
          difficulty_level: string
          duration_hours: number
          id: string
          is_active: boolean
          is_featured: boolean
          keywords: string[] | null
          learning_objectives: string[] | null
          meta_description: string | null
          modalities: string[]
          practical_project: string | null
          prerequisites: string[] | null
          price_amount: number | null
          price_type: string
          short_description: string | null
          slug: string
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          certificate_included?: boolean
          created_at?: string
          description: string
          difficulty_level?: string
          duration_hours: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[] | null
          learning_objectives?: string[] | null
          meta_description?: string | null
          modalities?: string[]
          practical_project?: string | null
          prerequisites?: string[] | null
          price_amount?: number | null
          price_type?: string
          short_description?: string | null
          slug: string
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          certificate_included?: boolean
          created_at?: string
          description?: string
          difficulty_level?: string
          duration_hours?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[] | null
          learning_objectives?: string[] | null
          meta_description?: string | null
          modalities?: string[]
          practical_project?: string | null
          prerequisites?: string[] | null
          price_amount?: number | null
          price_type?: string
          short_description?: string | null
          slug?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshops_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "workshop_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_summary: {
        Row: {
          active_projects: number | null
          avg_email_processing_time: number | null
          failed_emails: number | null
          new_contacts_month: number | null
          new_projects_month: number | null
          pending_emails: number | null
          pending_webhooks: number | null
          system_errors_today: number | null
          total_contacts: number | null
          total_deals: number | null
          total_projects: number | null
        }
        Relationships: []
      }
      project_statistics: {
        Row: {
          active_projects: number | null
          avg_budget: number | null
          avg_progress: number | null
          completed_projects: number | null
          draft_projects: number | null
          last_updated: string | null
          on_hold_projects: number | null
          projects_last_30_days: number | null
          projects_last_7_days: number | null
          total_budget: number | null
          total_projects: number | null
          unique_clients: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          identifier: string
          max_requests?: number
          time_window?: unknown
        }
        Returns: boolean
      }
      check_subscription_status: {
        Args: { email_address: string }
        Returns: {
          status: string
        }[]
      }
      check_workshop_enrollment_limit: {
        Args: { email_param: string; ip_param: unknown }
        Returns: boolean
      }
      cleanup_old_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_enrollments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      complete_system_operation: {
        Args: {
          p_error_count?: number
          p_log_id: string
          p_records_processed?: number
          p_status?: string
          p_success_count?: number
        }
        Returns: undefined
      }
      create_contact_from_lead_source: {
        Args: {
          p_company?: string
          p_email: string
          p_name: string
          p_phone?: string
          p_pipeline_name?: string
          p_source?: string
          p_source_data?: Json
        }
        Returns: string
      }
      generate_client_access_token: {
        Args: {
          p_access_level?: string
          p_client_contact_id: string
          p_project_id: string
        }
        Returns: string
      }
      get_all_newsletter_subscriptions: {
        Args: Record<PropertyKey, never>
        Returns: {
          confirmed_at: string
          created_at: string
          email: string
          id: string
          source_page: string
          status: string
          unsubscribed_at: string
          utm_campaign: string
          utm_medium: string
          utm_source: string
        }[]
      }
      get_newsletter_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_count: number
          pending_count: number
          total_count: number
          unsubscribed_count: number
        }[]
      }
      get_recent_newsletter_subscriptions: {
        Args: { limit_count?: number }
        Returns: {
          created_at: string
          email: string
          id: string
        }[]
      }
      log_security_event: {
        Args: {
          details?: Json
          event_type: string
          ip_address?: unknown
          user_agent?: string
          user_id?: string
        }
        Returns: undefined
      }
      log_system_operation: {
        Args: { p_metadata?: Json; p_operation_type: string }
        Returns: string
      }
      refresh_project_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
