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
      accounts_payable: {
        Row: {
          account_id: string | null
          amount: number
          cost_center_id: string | null
          created_at: string
          description: string
          due_date: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          project_id: string | null
          status: string
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          cost_center_id?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          cost_center_id?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          account_id: string | null
          amount: number
          contact_id: string | null
          created_at: string
          deal_id: string | null
          description: string
          due_date: string
          id: string
          installment_number: number | null
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          project_id: string | null
          status: string
          total_installments: number | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description: string
          due_date: string
          id?: string
          installment_number?: number | null
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string
          total_installments?: number | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          contact_id?: string | null
          created_at?: string
          deal_id?: string | null
          description?: string
          due_date?: string
          id?: string
          installment_number?: number | null
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          project_id?: string | null
          status?: string
          total_installments?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_executions: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          error_message: string | null
          execution_data: Json | null
          execution_type: string
          id: string
          performance_metrics: Json | null
          results: Json | null
          sequence_id: string | null
          started_at: string
          status: string
          trigger_id: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          error_message?: string | null
          execution_data?: Json | null
          execution_type: string
          id?: string
          performance_metrics?: Json | null
          results?: Json | null
          sequence_id?: string | null
          started_at?: string
          status: string
          trigger_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          error_message?: string | null
          execution_data?: Json | null
          execution_type?: string
          id?: string
          performance_metrics?: Json | null
          results?: Json | null
          sequence_id?: string | null
          started_at?: string
          status?: string
          trigger_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "lead_nurturing_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_trigger_id_fkey"
            columns: ["trigger_id"]
            isOneToOne: false
            referencedRelation: "automation_triggers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "marketing_automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_metrics: {
        Row: {
          contact_id: string | null
          conversions: number | null
          created_at: string
          date: string
          emails_clicked: number | null
          emails_opened: number | null
          emails_sent: number | null
          engagement_score: number | null
          id: string
          revenue_generated: number | null
          whatsapp_delivered: number | null
          whatsapp_replied: number | null
          whatsapp_sent: number | null
          workflow_id: string | null
        }
        Insert: {
          contact_id?: string | null
          conversions?: number | null
          created_at?: string
          date?: string
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          engagement_score?: number | null
          id?: string
          revenue_generated?: number | null
          whatsapp_delivered?: number | null
          whatsapp_replied?: number | null
          whatsapp_sent?: number | null
          workflow_id?: string | null
        }
        Update: {
          contact_id?: string | null
          conversions?: number | null
          created_at?: string
          date?: string
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          engagement_score?: number | null
          id?: string
          revenue_generated?: number | null
          whatsapp_delivered?: number | null
          whatsapp_replied?: number | null
          whatsapp_sent?: number | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_metrics_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_metrics_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "marketing_automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_triggers: {
        Row: {
          conditions: Json
          cooldown_hours: number | null
          created_at: string
          created_by: string | null
          description: string | null
          event_name: string
          execution_count: number | null
          frequency_limit: string | null
          id: string
          is_active: boolean
          last_executed_at: string | null
          name: string
          priority: number | null
          target_workflows: string[] | null
          trigger_type: string
          updated_at: string
        }
        Insert: {
          conditions?: Json
          cooldown_hours?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_name: string
          execution_count?: number | null
          frequency_limit?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name: string
          priority?: number | null
          target_workflows?: string[] | null
          trigger_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json
          cooldown_hours?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_name?: string
          execution_count?: number | null
          frequency_limit?: string | null
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          name?: string
          priority?: number | null
          target_workflows?: string[] | null
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      brand_colors: {
        Row: {
          accent_color: string
          accessibility_notes: string | null
          contrast_checked: boolean
          created_at: string
          gradients: Json
          id: string
          is_active: boolean
          is_system_preset: boolean
          neutral_scale: Json
          primary_color: string
          scheme_description: string | null
          scheme_name: string
          semantic_colors: Json
          shadows: Json
          system_colors: Json
          theme_mode: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          accessibility_notes?: string | null
          contrast_checked?: boolean
          created_at?: string
          gradients?: Json
          id?: string
          is_active?: boolean
          is_system_preset?: boolean
          neutral_scale?: Json
          primary_color?: string
          scheme_description?: string | null
          scheme_name?: string
          semantic_colors?: Json
          shadows?: Json
          system_colors?: Json
          theme_mode?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          accessibility_notes?: string | null
          contrast_checked?: boolean
          created_at?: string
          gradients?: Json
          id?: string
          is_active?: boolean
          is_system_preset?: boolean
          neutral_scale?: Json
          primary_color?: string
          scheme_description?: string | null
          scheme_name?: string
          semantic_colors?: Json
          shadows?: Json
          system_colors?: Json
          theme_mode?: string
          updated_at?: string
        }
        Relationships: []
      }
      budget_items: {
        Row: {
          account_id: string | null
          amount: number
          budget_id: string | null
          cost_center_id: string | null
          created_at: string
          id: string
          period_type: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          budget_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          id?: string
          period_type?: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          budget_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          id?: string
          period_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          account_type: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          level: number
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          account_type: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          level?: number
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
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
      color_presets: {
        Row: {
          category: string
          colors: Json
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          preset_description: string | null
          preset_name: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category?: string
          colors: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          preset_description?: string | null
          preset_name: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string
          colors?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          preset_description?: string | null
          preset_name?: string
          updated_at?: string
          usage_count?: number
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
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
      cost_centers: {
        Row: {
          budget_amount: number | null
          code: string
          created_at: string
          department: string
          id: string
          is_active: boolean
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          budget_amount?: number | null
          code: string
          created_at?: string
          department: string
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          budget_amount?: number | null
          code?: string
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name?: string
          updated_at?: string
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
          is_recurring: boolean
          modified_from_template: boolean
          occurrence_date: string | null
          recurrence_id: string | null
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
          is_recurring?: boolean
          modified_from_template?: boolean
          occurrence_date?: string | null
          recurrence_id?: string | null
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
          is_recurring?: boolean
          modified_from_template?: boolean
          occurrence_date?: string | null
          recurrence_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_recurrence_id_fkey"
            columns: ["recurrence_id"]
            isOneToOne: false
            referencedRelation: "crm_activity_recurrence"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activity_recurrence: {
        Row: {
          by_month_day: number[] | null
          by_set_pos: number[] | null
          by_weekday: number[] | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          default_time: string
          description: string | null
          end_date: string | null
          frequency: Database["public"]["Enums"]["recurrence_frequency"]
          id: string
          interval: number
          is_active: boolean
          last_generated_date: string | null
          max_occurrences: number | null
          occurrences_generated: number
          start_date: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          by_month_day?: number[] | null
          by_set_pos?: number[] | null
          by_weekday?: number[] | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          default_time?: string
          description?: string | null
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          interval?: number
          is_active?: boolean
          last_generated_date?: string | null
          max_occurrences?: number | null
          occurrences_generated?: number
          start_date: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          by_month_day?: number[] | null
          by_set_pos?: number[] | null
          by_weekday?: number[] | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          default_time?: string
          description?: string | null
          end_date?: string | null
          frequency?: Database["public"]["Enums"]["recurrence_frequency"]
          id?: string
          interval?: number
          is_active?: boolean
          last_generated_date?: string | null
          max_occurrences?: number | null
          occurrences_generated?: number
          start_date?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activity_recurrence_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activity_recurrence_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_audit_log: {
        Row: {
          action_type: string
          change_description: string | null
          changed_by: string | null
          created_at: string
          entity_id: string
          entity_type: string
          event_timestamp: string
          field_name: string | null
          id: string
          is_manual_edit: boolean | null
          metadata: Json | null
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          action_type: string
          change_description?: string | null
          changed_by?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          event_timestamp?: string
          field_name?: string | null
          id?: string
          is_manual_edit?: boolean | null
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          action_type?: string
          change_description?: string | null
          changed_by?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          event_timestamp?: string
          field_name?: string | null
          id?: string
          is_manual_edit?: boolean | null
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
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
      crm_contact_score_history: {
        Row: {
          change_reason: string | null
          changed_by: string | null
          contact_id: string
          created_at: string
          id: string
          metadata: Json | null
          new_value: number
          old_value: number | null
          score_type: string
        }
        Insert: {
          change_reason?: string | null
          changed_by?: string | null
          contact_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          new_value: number
          old_value?: number | null
          score_type: string
        }
        Update: {
          change_reason?: string | null
          changed_by?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          new_value?: number
          old_value?: number | null
          score_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contact_score_history_contact_id_fkey"
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
          business_unit: string | null
          closed_at: string | null
          contact_id: string | null
          created_at: string
          currency: string | null
          custom_fields: Json | null
          description: string | null
          expected_close_date: string | null
          id: string
          is_active: boolean
          is_won: boolean | null
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
          business_unit?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          is_active?: boolean
          is_won?: boolean | null
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
          business_unit?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          currency?: string | null
          custom_fields?: Json | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          is_active?: boolean
          is_won?: boolean | null
          pipeline_id?: string
          probability?: number | null
          source?: string | null
          stage_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_deals_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["id"]
          },
        ]
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
      crm_notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          archived_at: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string
          priority: string
          read_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          archived_at?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string
          read_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          archived_at?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string
          read_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      crm_pipelines: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          is_default: boolean
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
          is_default?: boolean
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
          is_default?: boolean
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
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
      dashboard_layouts: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_default: boolean
          name: string
          updated_at: string
          widgets_config: Json
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_default?: boolean
          name: string
          updated_at?: string
          widgets_config?: Json
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_default?: boolean
          name?: string
          updated_at?: string
          widgets_config?: Json
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          a_b_variants: Json | null
          content_html: string
          content_text: string | null
          created_at: string
          created_by: string | null
          description: string | null
          design_config: Json | null
          id: string
          is_active: boolean
          name: string
          performance_metrics: Json | null
          personalization_fields: Json | null
          subject_template: string
          template_type: string
          updated_at: string
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          a_b_variants?: Json | null
          content_html: string
          content_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_config?: Json | null
          id?: string
          is_active?: boolean
          name: string
          performance_metrics?: Json | null
          personalization_fields?: Json | null
          subject_template: string
          template_type: string
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          a_b_variants?: Json | null
          content_html?: string
          content_text?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          design_config?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          performance_metrics?: Json | null
          personalization_fields?: Json | null
          subject_template?: string
          template_type?: string
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      email_tracking_events: {
        Row: {
          contact_id: string | null
          created_at: string
          email_subject: string | null
          enrollment_id: string | null
          event_type: string
          id: string
          ip_address: unknown
          link_clicked: string | null
          metadata: Json | null
          resend_event_id: string | null
          step_index: number
          user_agent: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          email_subject?: string | null
          enrollment_id?: string | null
          event_type: string
          id?: string
          ip_address?: unknown
          link_clicked?: string | null
          metadata?: Json | null
          resend_event_id?: string | null
          step_index: number
          user_agent?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          email_subject?: string | null
          enrollment_id?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown
          link_clicked?: string | null
          metadata?: Json | null
          resend_event_id?: string | null
          step_index?: number
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_tracking_events_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_tracking_events_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "nurturing_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          cost_center_id: string | null
          created_at: string
          department: string | null
          document: string | null
          email: string | null
          hire_date: string | null
          id: string
          is_active: boolean
          job_title: string | null
          name: string
          salary: number | null
          salary_type: string | null
          updated_at: string
        }
        Insert: {
          cost_center_id?: string | null
          created_at?: string
          department?: string | null
          document?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          name: string
          salary?: number | null
          salary_type?: string | null
          updated_at?: string
        }
        Update: {
          cost_center_id?: string | null
          created_at?: string
          department?: string | null
          document?: string | null
          email?: string | null
          hire_date?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          name?: string
          salary?: number | null
          salary_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      excel_imports: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          errors: Json | null
          filename: string
          id: string
          import_type: string
          mapping: Json | null
          processed_rows: number | null
          status: string
          total_rows: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          errors?: Json | null
          filename: string
          id?: string
          import_type: string
          mapping?: Json | null
          processed_rows?: number | null
          status?: string
          total_rows?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          errors?: Json | null
          filename?: string
          id?: string
          import_type?: string
          mapping?: Json | null
          processed_rows?: number | null
          status?: string
          total_rows?: number | null
        }
        Relationships: []
      }
      feedback_campaign_executions: {
        Row: {
          business_unit: string
          campaign_id: string
          channel: string
          contact_id: string | null
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          message_sent: string | null
          project_id: string
          responded_at: string | null
          response_feedback_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          business_unit?: string
          campaign_id: string
          channel: string
          contact_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_sent?: string | null
          project_id: string
          responded_at?: string | null
          response_feedback_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          business_unit?: string
          campaign_id?: string
          channel?: string
          contact_id?: string | null
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_sent?: string | null
          project_id?: string
          responded_at?: string | null
          response_feedback_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_campaign_executions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "feedback_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_campaign_executions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_campaign_executions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_campaign_executions_response_feedback_id_fkey"
            columns: ["response_feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_campaigns: {
        Row: {
          business_unit: string
          channel: string
          created_at: string
          id: string
          is_active: boolean
          message_template: string
          name: string
          project_id: string
          settings: Json | null
          target_persona: string
          trigger_delay_hours: number | null
          trigger_event: string
          type: string
          updated_at: string
        }
        Insert: {
          business_unit?: string
          channel?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message_template: string
          name: string
          project_id: string
          settings?: Json | null
          target_persona: string
          trigger_delay_hours?: number | null
          trigger_event: string
          type: string
          updated_at?: string
        }
        Update: {
          business_unit?: string
          channel?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message_template?: string
          name?: string
          project_id?: string
          settings?: Json | null
          target_persona?: string
          trigger_delay_hours?: number | null
          trigger_event?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_campaigns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_entries: {
        Row: {
          attachments: Json | null
          channel: string
          contact_id: string | null
          context: Json | null
          created_at: string
          id: string
          ip_address: unknown
          locale: string | null
          module_id: string | null
          persona: string
          priority_score: number | null
          project_id: string
          resolution_note: string | null
          resolved_at: string | null
          rice_confidence: number | null
          rice_effort: number | null
          rice_impact: number | null
          rice_reach: number | null
          rice_score: number | null
          score: number | null
          severity: string
          status: string
          type: string
          updated_at: string
          user_agent: string | null
          verbatim: string
          wsjf_job_size: number | null
          wsjf_risk_reduction: number | null
          wsjf_score: number | null
          wsjf_time_criticality: number | null
          wsjf_user_value: number | null
        }
        Insert: {
          attachments?: Json | null
          channel: string
          contact_id?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          locale?: string | null
          module_id?: string | null
          persona: string
          priority_score?: number | null
          project_id: string
          resolution_note?: string | null
          resolved_at?: string | null
          rice_confidence?: number | null
          rice_effort?: number | null
          rice_impact?: number | null
          rice_reach?: number | null
          rice_score?: number | null
          score?: number | null
          severity?: string
          status?: string
          type: string
          updated_at?: string
          user_agent?: string | null
          verbatim: string
          wsjf_job_size?: number | null
          wsjf_risk_reduction?: number | null
          wsjf_score?: number | null
          wsjf_time_criticality?: number | null
          wsjf_user_value?: number | null
        }
        Update: {
          attachments?: Json | null
          channel?: string
          contact_id?: string | null
          context?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          locale?: string | null
          module_id?: string | null
          persona?: string
          priority_score?: number | null
          project_id?: string
          resolution_note?: string | null
          resolved_at?: string | null
          rice_confidence?: number | null
          rice_effort?: number | null
          rice_impact?: number | null
          rice_reach?: number | null
          rice_score?: number | null
          score?: number | null
          severity?: string
          status?: string
          type?: string
          updated_at?: string
          user_agent?: string | null
          verbatim?: string
          wsjf_job_size?: number | null
          wsjf_risk_reduction?: number | null
          wsjf_score?: number | null
          wsjf_time_criticality?: number | null
          wsjf_user_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_entries_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entries_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "feedback_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_metrics_daily: {
        Row: {
          avg_first_response_hours: number | null
          avg_resolution_hours: number | null
          bugs_count: number | null
          ces_responses: number | null
          ces_score: number | null
          created_at: string
          csat_responses: number | null
          csat_score: number | null
          date: string
          email_feedback: number | null
          id: string
          ideas_count: number | null
          inapp_feedback: number | null
          nps_responses: number | null
          nps_score: number | null
          pmf_responses: number | null
          pmf_score: number | null
          project_id: string
          questions_count: number | null
          tickets_closed: number | null
          tickets_created: number | null
          total_feedback: number | null
          whatsapp_feedback: number | null
        }
        Insert: {
          avg_first_response_hours?: number | null
          avg_resolution_hours?: number | null
          bugs_count?: number | null
          ces_responses?: number | null
          ces_score?: number | null
          created_at?: string
          csat_responses?: number | null
          csat_score?: number | null
          date: string
          email_feedback?: number | null
          id?: string
          ideas_count?: number | null
          inapp_feedback?: number | null
          nps_responses?: number | null
          nps_score?: number | null
          pmf_responses?: number | null
          pmf_score?: number | null
          project_id: string
          questions_count?: number | null
          tickets_closed?: number | null
          tickets_created?: number | null
          total_feedback?: number | null
          whatsapp_feedback?: number | null
        }
        Update: {
          avg_first_response_hours?: number | null
          avg_resolution_hours?: number | null
          bugs_count?: number | null
          ces_responses?: number | null
          ces_score?: number | null
          created_at?: string
          csat_responses?: number | null
          csat_score?: number | null
          date?: string
          email_feedback?: number | null
          id?: string
          ideas_count?: number | null
          inapp_feedback?: number | null
          nps_responses?: number | null
          nps_score?: number | null
          pmf_responses?: number | null
          pmf_score?: number | null
          project_id?: string
          questions_count?: number | null
          tickets_closed?: number | null
          tickets_created?: number | null
          total_feedback?: number | null
          whatsapp_feedback?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_metrics_daily_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_modules: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          key: string
          name: string
          path_hint: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          key: string
          name: string
          path_hint?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          key?: string
          name?: string
          path_hint?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_modules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_tickets: {
        Row: {
          assigned_to: string | null
          closed_at: string | null
          contact_id: string | null
          created_at: string
          csat_comment: string | null
          csat_score: number | null
          description: string
          feedback_id: string | null
          first_response_at: string | null
          id: string
          priority: string
          project_id: string
          resolution_note: string | null
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          csat_comment?: string | null
          csat_score?: number | null
          description: string
          feedback_id?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string
          project_id: string
          resolution_note?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          closed_at?: string | null
          contact_id?: string | null
          created_at?: string
          csat_comment?: string | null
          csat_score?: number | null
          description?: string
          feedback_id?: string | null
          first_response_at?: string | null
          id?: string
          priority?: string
          project_id?: string
          resolution_note?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_tickets_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_forecasts: {
        Row: {
          assumptions: Json | null
          based_on_crm: boolean | null
          created_at: string
          end_date: string
          id: string
          name: string
          scenario: string
          start_date: string
          updated_at: string
        }
        Insert: {
          assumptions?: Json | null
          based_on_crm?: boolean | null
          created_at?: string
          end_date: string
          id?: string
          name: string
          scenario: string
          start_date: string
          updated_at?: string
        }
        Update: {
          assumptions?: Json | null
          based_on_crm?: boolean | null
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          scenario?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_id: string | null
          amount: number
          category: string | null
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          project_id: string | null
          reference_id: string | null
          reference_type: string | null
          tags: string[] | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          category?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          project_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tags?: string[] | null
          transaction_date: string
          transaction_type: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          category?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          project_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          tags?: string[] | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      forecast_items: {
        Row: {
          account_id: string | null
          confidence_level: number | null
          cost_center_id: string | null
          created_at: string
          forecast_id: string | null
          id: string
          month_year: string
          notes: string | null
          projected_amount: number
        }
        Insert: {
          account_id?: string | null
          confidence_level?: number | null
          cost_center_id?: string | null
          created_at?: string
          forecast_id?: string | null
          id?: string
          month_year: string
          notes?: string | null
          projected_amount: number
        }
        Update: {
          account_id?: string | null
          confidence_level?: number | null
          cost_center_id?: string | null
          created_at?: string
          forecast_id?: string | null
          id?: string
          month_year?: string
          notes?: string | null
          projected_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "forecast_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forecast_items_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forecast_items_forecast_id_fkey"
            columns: ["forecast_id"]
            isOneToOne: false
            referencedRelation: "financial_forecasts"
            referencedColumns: ["id"]
          },
        ]
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
      icp_criteria: {
        Row: {
          created_at: string | null
          criterion_field: string
          criterion_name: string
          criterion_type: string
          description: string | null
          id: string
          is_active: boolean
          target_values: Json
          updated_at: string | null
          weight: number
        }
        Insert: {
          created_at?: string | null
          criterion_field: string
          criterion_name: string
          criterion_type: string
          description?: string | null
          id?: string
          is_active?: boolean
          target_values?: Json
          updated_at?: string | null
          weight?: number
        }
        Update: {
          created_at?: string | null
          criterion_field?: string
          criterion_name?: string
          criterion_type?: string
          description?: string | null
          id?: string
          is_active?: boolean
          target_values?: Json
          updated_at?: string | null
          weight?: number
        }
        Relationships: []
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
      lead_nurturing_sequences: {
        Row: {
          channel: string
          conditions: Json | null
          content_template_id: string | null
          created_at: string
          delay_hours: number
          description: string | null
          failure_actions: Json | null
          id: string
          is_active: boolean
          name: string
          personalization_rules: Json | null
          sequence_order: number
          success_actions: Json | null
          trigger_event: string
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          channel: string
          conditions?: Json | null
          content_template_id?: string | null
          created_at?: string
          delay_hours?: number
          description?: string | null
          failure_actions?: Json | null
          id?: string
          is_active?: boolean
          name: string
          personalization_rules?: Json | null
          sequence_order?: number
          success_actions?: Json | null
          trigger_event: string
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          channel?: string
          conditions?: Json | null
          content_template_id?: string | null
          created_at?: string
          delay_hours?: number
          description?: string | null
          failure_actions?: Json | null
          id?: string
          is_active?: boolean
          name?: string
          personalization_rules?: Json | null
          sequence_order?: number
          success_actions?: Json | null
          trigger_event?: string
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_nurturing_sequences_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "marketing_automation_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scoring_rules: {
        Row: {
          condition_field: string
          condition_operator: string
          condition_value: Json
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          points: number
          priority: number | null
          rule_name: string
          rule_type: string
          score_type: string
          updated_at: string | null
        }
        Insert: {
          condition_field: string
          condition_operator: string
          condition_value: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          points?: number
          priority?: number | null
          rule_name: string
          rule_type: string
          score_type?: string
          updated_at?: string | null
        }
        Update: {
          condition_field?: string
          condition_operator?: string
          condition_value?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          points?: number
          priority?: number | null
          rule_name?: string
          rule_type?: string
          score_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      legal_clause_groups: {
        Row: {
          color: string
          created_at: string
          description: string | null
          display_order: number
          icon_name: string | null
          id: string
          is_active: boolean
          name: string
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
          updated_at?: string
        }
        Relationships: []
      }
      legal_clauses: {
        Row: {
          conditions: Json
          content_markdown: string
          created_at: string
          display_order: number
          group_id: string
          id: string
          is_active: boolean
          is_locked_by_legal: boolean
          tags: string[] | null
          title: string
          updated_at: string
          variables: Json
        }
        Insert: {
          conditions?: Json
          content_markdown: string
          created_at?: string
          display_order?: number
          group_id: string
          id?: string
          is_active?: boolean
          is_locked_by_legal?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          variables?: Json
        }
        Update: {
          conditions?: Json
          content_markdown?: string
          created_at?: string
          display_order?: number
          group_id?: string
          id?: string
          is_active?: boolean
          is_locked_by_legal?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "legal_clauses_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "legal_clause_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_contract_signatures: {
        Row: {
          contract_id: string
          created_at: string
          envelope_id: string | null
          id: string
          provider: string
          sent_at: string | null
          signed_at: string | null
          signers: Json
          status: string
          updated_at: string
          webhook_data: Json | null
        }
        Insert: {
          contract_id: string
          created_at?: string
          envelope_id?: string | null
          id?: string
          provider?: string
          sent_at?: string | null
          signed_at?: string | null
          signers?: Json
          status?: string
          updated_at?: string
          webhook_data?: Json | null
        }
        Update: {
          contract_id?: string
          created_at?: string
          envelope_id?: string | null
          id?: string
          provider?: string
          sent_at?: string | null
          signed_at?: string | null
          signers?: Json
          status?: string
          updated_at?: string
          webhook_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_contract_signatures_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "legal_contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_contracts: {
        Row: {
          ai_draft_review: Json | null
          ai_law_design_summary: string | null
          ai_risk_score: number | null
          approved_at: string | null
          approved_by: string | null
          clicksign_document_key: string | null
          clicksign_status: string | null
          client_contact_id: string
          content_markdown: string | null
          contract_number: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          id: string
          pdf_generated_at: string | null
          pdf_hash: string | null
          pdf_url: string | null
          project_id: string | null
          selected_clauses: string[] | null
          signed_at: string | null
          signed_document_url: string | null
          status: string
          template_id: string
          title: string
          updated_at: string
          variables_data: Json
        }
        Insert: {
          ai_draft_review?: Json | null
          ai_law_design_summary?: string | null
          ai_risk_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          clicksign_document_key?: string | null
          clicksign_status?: string | null
          client_contact_id: string
          content_markdown?: string | null
          contract_number?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          pdf_generated_at?: string | null
          pdf_hash?: string | null
          pdf_url?: string | null
          project_id?: string | null
          selected_clauses?: string[] | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string
          template_id: string
          title: string
          updated_at?: string
          variables_data?: Json
        }
        Update: {
          ai_draft_review?: Json | null
          ai_law_design_summary?: string | null
          ai_risk_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          clicksign_document_key?: string | null
          clicksign_status?: string | null
          client_contact_id?: string
          content_markdown?: string | null
          contract_number?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          pdf_generated_at?: string | null
          pdf_hash?: string | null
          pdf_url?: string | null
          project_id?: string | null
          selected_clauses?: string[] | null
          signed_at?: string | null
          signed_document_url?: string | null
          status?: string
          template_id?: string
          title?: string
          updated_at?: string
          variables_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "legal_contracts_client_contact_id_fkey"
            columns: ["client_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_contracts_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_contracts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_contracts_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "legal_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_templates: {
        Row: {
          contract_type: string
          created_at: string
          created_by: string | null
          default_clauses: Json | null
          default_groups: string[] | null
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          updated_at: string
          variables_mapping: Json
        }
        Insert: {
          contract_type: string
          created_at?: string
          created_by?: string | null
          default_clauses?: Json | null
          default_groups?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          updated_at?: string
          variables_mapping?: Json
        }
        Update: {
          contract_type?: string
          created_at?: string
          created_by?: string | null
          default_clauses?: Json | null
          default_groups?: string[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          updated_at?: string
          variables_mapping?: Json
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
      marketing_automation_workflows: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          is_template: boolean
          name: string
          steps: Json
          success_metrics: Json | null
          target_persona: string
          trigger_conditions: Json
          updated_at: string
          workflow_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_template?: boolean
          name: string
          steps?: Json
          success_metrics?: Json | null
          target_persona: string
          trigger_conditions?: Json
          updated_at?: string
          workflow_type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_template?: boolean
          name?: string
          steps?: Json
          success_metrics?: Json | null
          target_persona?: string
          trigger_conditions?: Json
          updated_at?: string
          workflow_type?: string
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      nurturing_enrollments: {
        Row: {
          completed_at: string | null
          contact_id: string
          conversion_value: number | null
          converted_to_deal_id: string | null
          created_at: string
          current_step_id: string | null
          email_clicks: number | null
          email_opens: number | null
          emails_clicked: number | null
          emails_opened: number | null
          engagement_score: number | null
          enrolled_at: string
          enrollment_data: Json | null
          id: string
          last_activity_at: string | null
          next_action_at: string | null
          paused_at: string | null
          replies_received: number | null
          sequence_id: string
          status: string
          steps_completed: number | null
          total_steps: number
          updated_at: string
          whatsapp_delivered: number | null
          whatsapp_read: number | null
          whatsapp_replied: number | null
        }
        Insert: {
          completed_at?: string | null
          contact_id: string
          conversion_value?: number | null
          converted_to_deal_id?: string | null
          created_at?: string
          current_step_id?: string | null
          email_clicks?: number | null
          email_opens?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          engagement_score?: number | null
          enrolled_at?: string
          enrollment_data?: Json | null
          id?: string
          last_activity_at?: string | null
          next_action_at?: string | null
          paused_at?: string | null
          replies_received?: number | null
          sequence_id: string
          status?: string
          steps_completed?: number | null
          total_steps: number
          updated_at?: string
          whatsapp_delivered?: number | null
          whatsapp_read?: number | null
          whatsapp_replied?: number | null
        }
        Update: {
          completed_at?: string | null
          contact_id?: string
          conversion_value?: number | null
          converted_to_deal_id?: string | null
          created_at?: string
          current_step_id?: string | null
          email_clicks?: number | null
          email_opens?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          engagement_score?: number | null
          enrolled_at?: string
          enrollment_data?: Json | null
          id?: string
          last_activity_at?: string | null
          next_action_at?: string | null
          paused_at?: string | null
          replies_received?: number | null
          sequence_id?: string
          status?: string
          steps_completed?: number | null
          total_steps?: number
          updated_at?: string
          whatsapp_delivered?: number | null
          whatsapp_read?: number | null
          whatsapp_replied?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nurturing_enrollments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurturing_enrollments_converted_to_deal_id_fkey"
            columns: ["converted_to_deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurturing_enrollments_current_step_id_fkey"
            columns: ["current_step_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequence_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurturing_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequence_metrics"
            referencedColumns: ["sequence_id"]
          },
          {
            foreignKeyName: "nurturing_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      nurturing_sequence_steps: {
        Row: {
          clicked_count: number | null
          completed_count: number | null
          created_at: string
          delay_days: number
          delay_hours: number
          email_content: string | null
          email_subject: string | null
          email_template_id: string | null
          failed_count: number | null
          id: string
          is_active: boolean
          opened_count: number | null
          replied_count: number | null
          sent_count: number | null
          sequence_id: string
          skip_conditions: Json | null
          step_order: number
          step_type: string
          success_criteria: Json | null
          task_description: string | null
          task_title: string | null
          task_type: string | null
          updated_at: string
          webhook_payload: Json | null
          webhook_url: string | null
          whatsapp_message: string | null
          whatsapp_template_id: string | null
        }
        Insert: {
          clicked_count?: number | null
          completed_count?: number | null
          created_at?: string
          delay_days?: number
          delay_hours?: number
          email_content?: string | null
          email_subject?: string | null
          email_template_id?: string | null
          failed_count?: number | null
          id?: string
          is_active?: boolean
          opened_count?: number | null
          replied_count?: number | null
          sent_count?: number | null
          sequence_id: string
          skip_conditions?: Json | null
          step_order: number
          step_type: string
          success_criteria?: Json | null
          task_description?: string | null
          task_title?: string | null
          task_type?: string | null
          updated_at?: string
          webhook_payload?: Json | null
          webhook_url?: string | null
          whatsapp_message?: string | null
          whatsapp_template_id?: string | null
        }
        Update: {
          clicked_count?: number | null
          completed_count?: number | null
          created_at?: string
          delay_days?: number
          delay_hours?: number
          email_content?: string | null
          email_subject?: string | null
          email_template_id?: string | null
          failed_count?: number | null
          id?: string
          is_active?: boolean
          opened_count?: number | null
          replied_count?: number | null
          sent_count?: number | null
          sequence_id?: string
          skip_conditions?: Json | null
          step_order?: number
          step_type?: string
          success_criteria?: Json | null
          task_description?: string | null
          task_title?: string | null
          task_type?: string | null
          updated_at?: string
          webhook_payload?: Json | null
          webhook_url?: string | null
          whatsapp_message?: string | null
          whatsapp_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nurturing_sequence_steps_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurturing_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequence_metrics"
            referencedColumns: ["sequence_id"]
          },
          {
            foreignKeyName: "nurturing_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      nurturing_sequences: {
        Row: {
          avg_engagement_score: number | null
          completion_rate: number | null
          created_at: string
          created_by: string | null
          description: string | null
          enrollment_count: number | null
          id: string
          is_active: boolean
          max_score: number | null
          min_score: number | null
          name: string
          priority: number | null
          target_lifecycle_stages: string[] | null
          target_tags: string[] | null
          trigger_conditions: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          avg_engagement_score?: number | null
          completion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enrollment_count?: number | null
          id?: string
          is_active?: boolean
          max_score?: number | null
          min_score?: number | null
          name: string
          priority?: number | null
          target_lifecycle_stages?: string[] | null
          target_tags?: string[] | null
          trigger_conditions?: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          avg_engagement_score?: number | null
          completion_rate?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          enrollment_count?: number | null
          id?: string
          is_active?: boolean
          max_score?: number | null
          min_score?: number | null
          name?: string
          priority?: number | null
          target_lifecycle_stages?: string[] | null
          target_tags?: string[] | null
          trigger_conditions?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      nurturing_step_executions: {
        Row: {
          clicked_at: string | null
          created_at: string
          enrollment_id: string
          error_message: string | null
          executed_at: string | null
          execution_data: Json | null
          id: string
          opened_at: string | null
          replied_at: string | null
          retry_count: number | null
          scheduled_at: string
          status: string
          step_id: string
          updated_at: string
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          enrollment_id: string
          error_message?: string | null
          executed_at?: string | null
          execution_data?: Json | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          retry_count?: number | null
          scheduled_at: string
          status?: string
          step_id: string
          updated_at?: string
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          enrollment_id?: string
          error_message?: string | null
          executed_at?: string | null
          execution_data?: Json | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          retry_count?: number | null
          scheduled_at?: string
          status?: string
          step_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nurturing_step_executions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "nurturing_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nurturing_step_executions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "nurturing_sequence_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      page_seo: {
        Row: {
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
      payroll: {
        Row: {
          additions: Json | null
          created_at: string
          deductions: Json | null
          employee_id: string | null
          gross_salary: number
          id: string
          net_salary: number
          payment_date: string | null
          reference_month: string
          status: string
          updated_at: string
        }
        Insert: {
          additions?: Json | null
          created_at?: string
          deductions?: Json | null
          employee_id?: string | null
          gross_salary: number
          id?: string
          net_salary: number
          payment_date?: string | null
          reference_month: string
          status?: string
          updated_at?: string
        }
        Update: {
          additions?: Json | null
          created_at?: string
          deductions?: Json | null
          employee_id?: string | null
          gross_salary?: number
          id?: string
          net_salary?: number
          payment_date?: string | null
          reference_month?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permission_audit_log: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: unknown
          new_value: Json | null
          old_value: Json | null
          permission: Database["public"]["Enums"]["permission_action"] | null
          resource: Database["public"]["Enums"]["app_resource"] | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          permission?: Database["public"]["Enums"]["permission_action"] | null
          resource?: Database["public"]["Enums"]["app_resource"] | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          permission?: Database["public"]["Enums"]["permission_action"] | null
          resource?: Database["public"]["Enums"]["app_resource"] | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string
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
      proposal_approvals: {
        Row: {
          approved_at: string | null
          approver_email: string
          approver_type: string | null
          comments: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          proposal_id: string
          user_agent: string | null
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approver_email: string
          approver_type?: string | null
          comments?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          proposal_id: string
          user_agent?: string | null
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approver_email?: string
          approver_type?: string | null
          comments?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          proposal_id?: string
          user_agent?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_approvals_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_change_requests: {
        Row: {
          change_type: string | null
          created_at: string | null
          from_version: number
          id: string
          notes: string | null
          proposal_id: string
          requested_by: string | null
          to_version: number
        }
        Insert: {
          change_type?: string | null
          created_at?: string | null
          from_version: number
          id?: string
          notes?: string | null
          proposal_id: string
          requested_by?: string | null
          to_version: number
        }
        Update: {
          change_type?: string | null
          created_at?: string | null
          from_version?: number
          id?: string
          notes?: string | null
          proposal_id?: string
          requested_by?: string | null
          to_version?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_change_requests_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_pricing_catalog: {
        Row: {
          benefits: Json | null
          category: string | null
          created_at: string | null
          currency: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          value: number
        }
        Insert: {
          benefits?: Json | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          value: number
        }
        Update: {
          benefits?: Json | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          value?: number
        }
        Relationships: []
      }
      proposal_templates: {
        Row: {
          business_unit: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          schema: Json
          updated_at: string | null
        }
        Insert: {
          business_unit?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          schema: Json
          updated_at?: string | null
        }
        Update: {
          business_unit?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          schema?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      proposal_versions: {
        Row: {
          created_at: string | null
          created_by: string | null
          docx_url: string | null
          id: string
          pdf_url: string | null
          pricing: Json
          proposal_id: string
          published_expires_at: string | null
          published_token: string | null
          published_url: string | null
          sections: Json
          variables: Json
          version_number: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          docx_url?: string | null
          id?: string
          pdf_url?: string | null
          pricing: Json
          proposal_id: string
          published_expires_at?: string | null
          published_token?: string | null
          published_url?: string | null
          sections: Json
          variables: Json
          version_number: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          docx_url?: string | null
          id?: string
          pdf_url?: string | null
          pricing?: Json
          proposal_id?: string
          published_expires_at?: string | null
          published_token?: string | null
          published_url?: string | null
          sections?: Json
          variables?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "proposal_versions_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          contact_id: string
          created_at: string | null
          created_by: string | null
          current_version: number
          deal_id: string
          flags: Json | null
          id: string
          proposal_number: string | null
          status: string
          template_id: string
          title: string
          updated_at: string | null
          valid_until: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          created_by?: string | null
          current_version?: number
          deal_id: string
          flags?: Json | null
          id?: string
          proposal_number?: string | null
          status: string
          template_id: string
          title: string
          updated_at?: string | null
          valid_until: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          created_by?: string | null
          current_version?: number
          deal_id?: string
          flags?: Json | null
          id?: string
          proposal_number?: string | null
          status?: string
          template_id?: string
          title?: string
          updated_at?: string | null
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "crm_deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "proposal_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      public_company_settings: {
        Row: {
          brand_accent_color: string
          brand_primary_color: string
          business_hours: Json | null
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      role_permissions: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions: Json | null
          id: string
          is_granted: boolean
          resource: Database["public"]["Enums"]["app_resource"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          id?: string
          is_granted?: boolean
          resource: Database["public"]["Enums"]["app_resource"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          id?: string
          is_granted?: boolean
          resource?: Database["public"]["Enums"]["app_resource"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          business_unit: string
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
          business_unit?: string
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
          business_unit?: string
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
      suppliers: {
        Row: {
          address: Json | null
          created_at: string
          document: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          payment_terms: number | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          payment_terms?: number | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          payment_terms?: number | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_configurations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      system_error_logs: {
        Row: {
          component_name: string | null
          created_at: string
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          metadata: Json | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          session_id: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          component_name?: string | null
          created_at?: string
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          component_name?: string | null
          created_at?: string
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          metadata?: Json | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
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
      user_crm_preferences: {
        Row: {
          board_density: string | null
          created_at: string
          default_pipeline_id: string | null
          id: string
          last_viewed_pipeline_id: string | null
          show_card_close_date: boolean | null
          show_card_probability: boolean | null
          show_card_value: boolean | null
          show_stage_metrics: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          board_density?: string | null
          created_at?: string
          default_pipeline_id?: string | null
          id?: string
          last_viewed_pipeline_id?: string | null
          show_card_close_date?: boolean | null
          show_card_probability?: boolean | null
          show_card_value?: boolean | null
          show_stage_metrics?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          board_density?: string | null
          created_at?: string
          default_pipeline_id?: string | null
          id?: string
          last_viewed_pipeline_id?: string | null
          show_card_close_date?: boolean | null
          show_card_probability?: boolean | null
          show_card_value?: boolean | null
          show_stage_metrics?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_crm_preferences_default_pipeline_id_fkey"
            columns: ["default_pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_crm_preferences_last_viewed_pipeline_id_fkey"
            columns: ["last_viewed_pipeline_id"]
            isOneToOne: false
            referencedRelation: "crm_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions: Json | null
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_granted: boolean
          reason: string | null
          resource: Database["public"]["Enums"]["app_resource"]
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_granted: boolean
          reason?: string | null
          resource: Database["public"]["Enums"]["app_resource"]
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["permission_action"]
          conditions?: Json | null
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_granted?: boolean
          reason?: string | null
          resource?: Database["public"]["Enums"]["app_resource"]
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string
          employee_id: string | null
          id: string
          is_active: boolean
          job_title: string | null
          last_login_at: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name: string
          employee_id?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string
          employee_id?: string | null
          id?: string
          is_active?: boolean
          job_title?: string | null
          last_login_at?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          notes: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      nurturing_sequence_metrics: {
        Row: {
          active_enrollments: number | null
          avg_opens_per_enrollment: number | null
          click_through_rate: number | null
          completed_enrollments: number | null
          completion_rate: number | null
          conversion_rate: number | null
          failed_enrollments: number | null
          last_activity: string | null
          sequence_id: string | null
          sequence_name: string | null
          total_conversion_value: number | null
          total_conversions: number | null
          total_email_clicks: number | null
          total_email_opens: number | null
          total_enrollments: number | null
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
          stats_id: number | null
          total_budget: number | null
          total_projects: number | null
          unique_clients: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_next_occurrence: {
        Args: {
          p_by_month_day: number[]
          p_by_weekday: number[]
          p_current_date: string
          p_frequency: Database["public"]["Enums"]["recurrence_frequency"]
          p_interval: number
        }
        Returns: string
      }
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
      cleanup_old_data: { Args: never; Returns: undefined }
      cleanup_old_enrollments: { Args: never; Returns: undefined }
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
      create_first_superadmin: {
        Args: { p_display_name?: string; p_email: string }
        Returns: {
          message: string
          role: Database["public"]["Enums"]["app_role"]
          success: boolean
          user_id: string
        }[]
      }
      generate_client_access_token: {
        Args: {
          p_access_level?: string
          p_client_contact_id: string
          p_project_id: string
        }
        Returns: string
      }
      generate_contract_number: { Args: never; Returns: string }
      generate_proposal_number: { Args: never; Returns: string }
      get_admin_dashboard_summary: {
        Args: never
        Returns: {
          active_projects: number
          avg_email_processing_time: number
          failed_emails: number
          new_contacts_month: number
          new_projects_month: number
          pending_emails: number
          pending_webhooks: number
          system_errors_today: number
          total_contacts: number
          total_deals: number
          total_projects: number
        }[]
      }
      get_all_newsletter_subscriptions: {
        Args: never
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
      get_icp_health_stats: {
        Args: never
        Returns: {
          incomplete_contacts: number
          incomplete_percent: number
          total_contacts: number
        }[]
      }
      get_newsletter_stats: {
        Args: never
        Returns: {
          active_count: number
          pending_count: number
          total_count: number
          unsubscribed_count: number
        }[]
      }
      get_project_statistics: {
        Args: never
        Returns: {
          active_projects: number
          avg_budget: number
          avg_progress: number
          completed_projects: number
          draft_projects: number
          last_updated: string
          on_hold_projects: number
          projects_last_30_days: number
          projects_last_7_days: number
          total_budget: number
          total_projects: number
          unique_clients: number
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
      get_user_roles: {
        Args: { p_user_id: string }
        Returns: {
          role_name: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_permission: {
        Args: {
          p_action: Database["public"]["Enums"]["permission_action"]
          p_resource: Database["public"]["Enums"]["app_resource"]
          p_user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          p_role: Database["public"]["Enums"]["app_role"]
          p_user_id: string
        }
        Returns: boolean
      }
      is_superadmin: { Args: { p_user_id?: string }; Returns: boolean }
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
      log_system_error: {
        Args: {
          p_component_name?: string
          p_error_message: string
          p_error_stack?: string
          p_error_type: string
          p_metadata?: Json
        }
        Returns: string
      }
      log_system_operation: {
        Args: { p_metadata?: Json; p_operation_type: string }
        Returns: string
      }
      manual_enroll_contact: {
        Args: { p_contact_id: string; p_sequence_id: string }
        Returns: string
      }
      notify_hot_leads: { Args: never; Returns: undefined }
      notify_overdue_follow_ups: { Args: never; Returns: undefined }
      notify_stale_deals: { Args: never; Returns: undefined }
      refresh_nurturing_metrics: { Args: never; Returns: undefined }
      refresh_project_statistics: { Args: never; Returns: undefined }
    }
    Enums: {
      app_resource:
        | "crm"
        | "financial"
        | "projects"
        | "feedback"
        | "analytics"
        | "settings"
        | "users"
        | "campaigns"
        | "newsletters"
        | "workshops"
      app_role: "superadmin" | "admin" | "manager" | "analyst" | "viewer"
      permission_action:
        | "create"
        | "read"
        | "update"
        | "delete"
        | "approve"
        | "export"
        | "manage"
      recurrence_frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "quarterly"
        | "yearly"
        | "custom"
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
      app_resource: [
        "crm",
        "financial",
        "projects",
        "feedback",
        "analytics",
        "settings",
        "users",
        "campaigns",
        "newsletters",
        "workshops",
      ],
      app_role: ["superadmin", "admin", "manager", "analyst", "viewer"],
      permission_action: [
        "create",
        "read",
        "update",
        "delete",
        "approve",
        "export",
        "manage",
      ],
      recurrence_frequency: [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "quarterly",
        "yearly",
        "custom",
      ],
    },
  },
} as const
