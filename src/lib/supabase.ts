import { createClient } from '@supabase/supabase-js';

// Estas chaves você pegará no painel do Supabase (Project Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🔍 INJEÇÃO DE DIAGNÓSTICO: Verifica o que o Vite está a ler do ficheiro .env
console.log("🔗 URL DO SUPABASE DETECTADA:", supabaseUrl);
console.log("🔑 CHAVE ANON DETECTADA:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');