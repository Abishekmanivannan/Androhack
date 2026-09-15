import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sluhurdmhkyxftmvqtah.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdWhurdmhkyxftmvqtahIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMzI0ODMsImV4cCI6MjEwNDkwODQ4M30.4abmA8pZ37Oi-5FvJ6KX968zSBVbW8ERqfyDxu4N8WM";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
