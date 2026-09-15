export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          id: string
          payload: Json
          target_entity: string
          target_id: string | null
          timestamp: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          id?: string
          payload?: Json
          target_entity: string
          target_id?: string | null
          timestamp?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          id?: string
          payload?: Json
          target_entity?: string
          target_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      badges: {
        Row: {
          category_id: string | null
          created_at: string
          criteria_threshold: number
          criteria_type: string
          description: string
          icon_key: string
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          criteria_threshold?: number
          criteria_type: string
          description: string
          icon_key: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          criteria_threshold?: number
          criteria_type?: string
          description?: string
          icon_key?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "badges_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "contribution_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          current_progress: number
          id: string
          is_completed: boolean
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          current_progress?: number
          id?: string
          is_completed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      challenges: {
        Row: {
          badge_reward_id: string | null
          category_id: string | null
          created_at: string
          description: string
          end_date: string
          goal_count: number
          id: string
          start_date: string
          status: string
          title: string
          xp_reward: number
        }
        Insert: {
          badge_reward_id?: string | null
          category_id?: string | null
          created_at?: string
          description: string
          end_date: string
          goal_count?: number
          id?: string
          start_date: string
          status?: string
          title: string
          xp_reward?: number
        }
        Update: {
          badge_reward_id?: string | null
          category_id?: string | null
          created_at?: string
          description?: string
          end_date?: string
          goal_count?: number
          id?: string
          start_date?: string
          status?: string
          title?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenges_badge_reward_id_fkey"
            columns: ["badge_reward_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "contribution_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      clarification_messages: {
        Row: {
          contribution_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          contribution_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          contribution_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clarification_messages_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clarification_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contribution_categories: {
        Row: {
          base_xp: number
          color_hex: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          base_xp?: number
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          base_xp?: number
          color_hex?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      contribution_evidence: {
        Row: {
          contribution_id: string
          created_at: string
          evidence_type: string
          id: string
          metadata: Json
          title: string | null
          url_or_path: string
        }
        Insert: {
          contribution_id: string
          created_at?: string
          evidence_type: string
          id?: string
          metadata?: Json
          title?: string | null
          url_or_path: string
        }
        Update: {
          contribution_id?: string
          created_at?: string
          evidence_type?: string
          id?: string
          metadata?: Json
          title?: string | null
          url_or_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribution_evidence_contribution_id_fkey"
            columns: ["contribution_id"]
            isOneToOne: false
            referencedRelation: "contributions"
            referencedColumns: ["id"]
          }
        ]
      }
      contributions: {
        Row: {
          category_id: string
          created_at: string
          description: string
          event_id: string | null
          id: string
          points_awarded: number
          project_event_name: string | null
          project_id: string | null
          reviewer_id: string | null
          reviewer_notes: string | null
          status: string
          submission_date: string
          title: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          event_id?: string | null
          id?: string
          points_awarded?: number
          project_event_name?: string | null
          project_id?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          submission_date?: string
          title: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          event_id?: string | null
          id?: string
          points_awarded?: number
          project_event_name?: string | null
          project_id?: string | null
          reviewer_id?: string | null
          reviewer_notes?: string | null
          status?: string
          submission_date?: string
          title?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "contribution_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      event_members: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          role: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          role?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          location: string | null
          name: string
          organizer_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          location?: string | null
          name: string
          organizer_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          location?: string | null
          name?: string
          organizer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      levels: {
        Row: {
          description: string | null
          id: number
          name: string
          xp_threshold: number
        }
        Insert: {
          description?: string | null
          id: number
          name: string
          xp_threshold: number
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          xp_threshold?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      point_rules: {
        Row: {
          action_key: string
          category_id: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          xp_value: number
        }
        Insert: {
          action_key: string
          category_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          xp_value: number
        }
        Update: {
          action_key?: string
          category_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          xp_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "point_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "contribution_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          current_level: string
          department: string | null
          email: string
          id: string
          interests: string[]
          name: string
          portfolio_public: boolean
          role: string
          skills: string[]
          total_xp: number
          updated_at: string
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_level?: string
          department?: string | null
          email: string
          id: string
          interests?: string[]
          name: string
          portfolio_public?: boolean
          role?: string
          skills?: string[]
          total_xp?: number
          updated_at?: string
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          current_level?: string
          department?: string | null
          email?: string
          id?: string
          interests?: string[]
          name?: string
          portfolio_public?: boolean
          role?: string
          skills?: string[]
          total_xp?: number
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          owner_id: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_badges: {
        Row: {
          awarded_by: string | null
          badge_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          awarded_by?: string | null
          badge_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          awarded_by?: string | null
          badge_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_awarded_by_fkey"
            columns: ["awarded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_streaks: {
        Row: {
          current_streak: number
          id: string
          last_qualifying_activity_at: string | null
          longest_streak: number
          streak_milestones: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_qualifying_activity_at?: string | null
          longest_streak?: number
          streak_milestones?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_qualifying_activity_at?: string | null
          longest_streak?: number
          streak_milestones?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      view_club_analytics_summary: {
        Row: {
          active_members_30d: number | null
          active_projects: number | null
          clarification_contributions: number | null
          pending_contributions: number | null
          total_contributions: number | null
          total_members: number | null
          upcoming_events: number | null
          verified_contributions: number | null
        }
        Relationships: []
      }
      view_club_category_distribution: {
        Row: {
          category_id: string | null
          category_name: string | null
          color_hex: string | null
          total_submissions: number | null
          total_xp_awarded: number | null
          verified_submissions: number | null
        }
        Relationships: []
      }
      view_leaderboard_all_time: {
        Row: {
          avatar_url: string | null
          current_level: string | null
          current_streak: number | null
          department: string | null
          name: string | null
          rank: number | null
          role: string | null
          total_verified_contributions: number | null
          total_xp: number | null
          user_id: string | null
        }
        Relationships: []
      }
      view_leaderboard_monthly: {
        Row: {
          avatar_url: string | null
          department: string | null
          monthly_xp: number | null
          name: string | null
          rank: number | null
          user_id: string | null
        }
        Relationships: []
      }
      view_leaderboard_most_improved: {
        Row: {
          avatar_url: string | null
          department: string | null
          name: string | null
          prior_xp: number | null
          rank: number | null
          recent_xp: number | null
          user_id: string | null
          xp_gain: number | null
        }
        Relationships: []
      }
      view_leaderboard_weekly: {
        Row: {
          avatar_url: string | null
          department: string | null
          name: string | null
          rank: number | null
          user_id: string | null
          weekly_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      auth_user_role: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_coordinator_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
