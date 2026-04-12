import { createClient } from '@supabase/supabase-js';

// Estas chaves você pegará no painel do Supabase (Project Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);