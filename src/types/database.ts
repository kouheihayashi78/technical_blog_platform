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
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          qiita_access_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          qiita_access_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          qiita_access_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          slug: string
          status: 'draft' | 'private' | 'shareable'
          tags: string[]
          category: string | null
          thumbnail_url: string | null
          qiita_url: string | null
          qiita_article_id: string | null
          qiita_synced_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          slug: string
          status?: 'draft' | 'private' | 'shareable'
          tags?: string[]
          category?: string | null
          thumbnail_url?: string | null
          qiita_url?: string | null
          qiita_article_id?: string | null
          qiita_synced_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          slug?: string
          status?: 'draft' | 'private' | 'shareable'
          tags?: string[]
          category?: string | null
          thumbnail_url?: string | null
          qiita_url?: string | null
          qiita_article_id?: string | null
          qiita_synced_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      post_versions: {
        Row: {
          id: string
          post_id: string
          title: string
          content: string
          version_number: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          title: string
          content: string
          version_number: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          title?: string
          content?: string
          version_number?: number
          created_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          width?: number | null
          height?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_profile_if_not_exists: {
        Args: {
          user_id: string
          user_email: string
          user_display_name: string
        }
        Returns: undefined
      }
      create_post_version: {
        Args: {
          p_post_id: string
          p_title: string
          p_content: string
          p_version_number: number
        }
        Returns: undefined
      }
    }
    Enums: {
      post_status: 'draft' | 'private' | 'shareable'
    }
  }
}
