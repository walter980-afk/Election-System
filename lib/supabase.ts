import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      elections: {
        Row: {
          id: string
          title: string
          description: string | null
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
        }
      }
      posts: {
        Row: {
          id: string
          election_id: string
          title: string
          description: string | null
          category: string | null
          max_votes: number
          order_index: number
          created_at: string
        }
      }
      candidates: {
        Row: {
          id: string
          post_id: string
          name: string
          gender: string | null
          created_at: string
        }
      }
      voters: {
        Row: {
          id: string
          voter_id: string
          name: string
          email: string | null
          has_voted: boolean
          voted_at: string | null
          created_at: string
        }
      }
      votes: {
        Row: {
          id: string
          voter_id: string
          candidate_id: string
          post_id: string
          election_id: string
          created_at: string
        }
      }
    }
  }
}
