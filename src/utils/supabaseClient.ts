import { createClient } from '@supabase/supabase-js';

// Hardcoded (conforme solicitado)
const supabaseUrl = 'https://jzsjwmnjhltoiskwzpka.supabase.co';
const supabaseAnonKey = 'sb_publishable_C8mmKRIq5q5gg6Qlcbo8zQ_I2RDytiC';

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Evita quebrar o render imediatamente quando falta env; as chamadas da API vão falhar com mensagem clara.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : (null as any);


