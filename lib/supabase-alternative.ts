import { createClient } from '@supabase/supabase-js';

// Эти значения будут взяты из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем клиент Supabase с минимальной конфигурацией
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 