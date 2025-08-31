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
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
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
