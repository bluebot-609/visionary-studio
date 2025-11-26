export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shots: {
        Row: {
          id: string
          user_id: string
          image_id: string
          image_url: string
          file_name: string
          hue: number
          saturation: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_id: string
          image_url: string
          file_name: string
          hue: number
          saturation: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_id?: string
          image_url?: string
          file_name?: string
          hue?: number
          saturation?: number
          created_at?: string
        }
      }
      device_fingerprints: {
        Row: {
          id: string
          user_id: string
          fingerprint: string
          ip_address: string | null
          user_agent: string | null
          is_signup: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fingerprint: string
          ip_address?: string | null
          user_agent?: string | null
          is_signup?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fingerprint?: string
          ip_address?: string | null
          user_agent?: string | null
          is_signup?: boolean
          created_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          source: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          source?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          source?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_device_account_limit: {
        Args: {
          fingerprint_text: string
          max_accounts?: number
        }
        Returns: boolean
      }
      grant_trial_credits: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      has_sufficient_credits: {
        Args: {
          p_user_id: string
          required_credits?: number
        }
        Returns: boolean
      }
      deduct_credits: {
        Args: {
          p_user_id: string
          amount: number
          transaction_type: string
          metadata?: Json | null
        }
        Returns: number
      }
      add_credits: {
        Args: {
          p_user_id: string
          amount: number
          source: string
          metadata?: Json | null
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

