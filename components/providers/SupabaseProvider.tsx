'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';

// Создаем контекст
type SupabaseContextType = {
  session: Session | null;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Провайдер компонента
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Подписываемся на изменения сессии
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Функция для выхода
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    signOut,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

// Хук для использования контекста
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 