export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HouseholdRole = 'owner' | 'member';

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          owner_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      household_members: {
        Row: {
          household_id: string;
          user_id: string;
          role: HouseholdRole;
          last_active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          user_id: string;
          role: HouseholdRole;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_id?: string;
          user_id?: string;
          role?: HouseholdRole;
          last_active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          avatar: string | null;
          order_index: number;
          last_active_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          name: string;
          avatar?: string | null;
          order_index?: number;
          last_active_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          name?: string;
          avatar?: string | null;
          order_index?: number;
          last_active_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile_data: {
        Row: {
          profile_id: string;
          settings: Json;
          catalog_prefs: Json;
          trakt_auth: Json;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          settings?: Json;
          catalog_prefs?: Json;
          trakt_auth?: Json;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          settings?: Json;
          catalog_prefs?: Json;
          trakt_auth?: Json;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      addons: {
        Row: {
          household_id: string;
          url: string;
          enabled: boolean;
          name: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          household_id: string;
          url: string;
          enabled?: boolean;
          name?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          household_id?: string;
          url?: string;
          enabled?: boolean;
          name?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      ensure_household_membership: {
        Args: Record<PropertyKey, never>;
        Returns: {
          household_id: string;
          role: HouseholdRole;
        }[];
      };
      get_household_addons: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      replace_household_addons: {
        Args: {
          p_addons: Json;
        };
        Returns: undefined;
      };
      upsert_profile_data: {
        Args: {
          p_profile_id: string;
          p_settings: Json;
          p_catalog_prefs: Json;
          p_trakt_auth: Json;
        };
        Returns: undefined;
      };
      is_household_member: {
        Args: {
          p_household_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      can_manage_household_addons: {
        Args: {
          p_household_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      household_role: HouseholdRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type TableRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TableInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TableUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type ProfileRow = TableRow<'profiles'>;
export type HouseholdMemberRow = TableRow<'household_members'>;
