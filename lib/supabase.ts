import { createClient } from '@supabase/supabase-js';

// Эти значения будут взяты из переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем клиент Supabase с отключенным realtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'spanish-estate'
    }
  }
}); 