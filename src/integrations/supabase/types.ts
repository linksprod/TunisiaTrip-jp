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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image: string | null
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          price: string | null
          rating: number | null
          show_in_start_my_trip: boolean | null
          show_in_travel: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          price?: string | null
          rating?: number | null
          show_in_start_my_trip?: boolean | null
          show_in_travel?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          price?: string | null
          rating?: number | null
          show_in_start_my_trip?: boolean | null
          show_in_travel?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      airports: {
        Row: {
          advantages: string[] | null
          code: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          region: string | null
          updated_at: string
        }
        Insert: {
          advantages?: string[] | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          region?: string | null
          updated_at?: string
        }
        Update: {
          advantages?: string[] | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          region?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_articles: {
        Row: {
          canonical_url: string | null
          category: string
          content: string | null
          created_at: string
          description: string
          facebook_description: string | null
          facebook_image: string | null
          facebook_title: string | null
          focus_keyword: string | null
          id: string
          image: string
          instagram_caption: string | null
          instagram_hashtags: string[] | null
          instagram_story_text: string | null
          language: string
          meta_description: string | null
          meta_robots: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_image_alt: string | null
          og_title: string | null
          original_id: string | null
          publish_date: string
          schema_markup_type: string | null
          seo_keywords: string[] | null
          slug: string | null
          status: string
          title: string
          twitter_card_type: string | null
          twitter_description: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          category: string
          content?: string | null
          created_at?: string
          description: string
          facebook_description?: string | null
          facebook_image?: string | null
          facebook_title?: string | null
          focus_keyword?: string | null
          id?: string
          image: string
          instagram_caption?: string | null
          instagram_hashtags?: string[] | null
          instagram_story_text?: string | null
          language?: string
          meta_description?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          original_id?: string | null
          publish_date?: string
          schema_markup_type?: string | null
          seo_keywords?: string[] | null
          slug?: string | null
          status?: string
          title: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          category?: string
          content?: string | null
          created_at?: string
          description?: string
          facebook_description?: string | null
          facebook_image?: string | null
          facebook_title?: string | null
          focus_keyword?: string | null
          id?: string
          image?: string
          instagram_caption?: string | null
          instagram_hashtags?: string[] | null
          instagram_story_text?: string | null
          language?: string
          meta_description?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_image_alt?: string | null
          og_title?: string | null
          original_id?: string | null
          publish_date?: string
          schema_markup_type?: string | null
          seo_keywords?: string[] | null
          slug?: string | null
          status?: string
          title?: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_articles_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      guesthouses: {
        Row: {
          amenities: string[] | null
          breakfast: boolean | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          price_per_night: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          breakfast?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          price_per_night?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          breakfast?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          price_per_night?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      hotels: {
        Row: {
          amenities: string[] | null
          breakfast: boolean | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          images: string[] | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          price_per_night: string | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          breakfast?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          price_per_night?: string | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          breakfast?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          images?: string[] | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          price_per_night?: string | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      predefined_trips: {
        Row: {
          activity_ids: string[] | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_days: number
          guesthouse_ids: string[] | null
          hotel_ids: string[] | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_estimate: string | null
          target_airport_id: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          activity_ids?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days: number
          guesthouse_ids?: string[] | null
          hotel_ids?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_estimate?: string | null
          target_airport_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          activity_ids?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_days?: number
          guesthouse_ids?: string[] | null
          hotel_ids?: string[] | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_estimate?: string | null
          target_airport_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "predefined_trips_target_airport_id_fkey"
            columns: ["target_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
        ]
      }
      predefined_trips_detailed: {
        Row: {
          created_at: string
          description: string | null
          detailed_days: Json | null
          difficulty_level: string
          duration_days: number
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_estimate: string | null
          target_airport_id: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          detailed_days?: Json | null
          difficulty_level?: string
          duration_days: number
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_estimate?: string | null
          target_airport_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          detailed_days?: Json | null
          difficulty_level?: string
          duration_days?: number
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_estimate?: string | null
          target_airport_id?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "predefined_trips_detailed_target_airport_id_fkey"
            columns: ["target_airport_id"]
            isOneToOne: false
            referencedRelation: "airports"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_predefined_trip_detailed: {
        Args: { trip_data: Json }
        Returns: string
      }
      get_predefined_trips_detailed: {
        Args: never
        Returns: {
          created_at: string
          description: string
          detailed_days: Json
          difficulty_level: string
          duration_days: number
          id: string
          images: string[]
          is_active: boolean
          is_featured: boolean
          name: string
          price_estimate: string
          target_airport_id: string
          theme: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_id: string }; Returns: boolean }
      is_user_admin: { Args: { user_id: string }; Returns: boolean }
      update_predefined_trip_detailed: {
        Args: { trip_data: Json; trip_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
