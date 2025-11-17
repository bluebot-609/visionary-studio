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
  }
}

