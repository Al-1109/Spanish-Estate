import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
}

export const useSupabaseAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false
  });

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Ошибка получения сессии:', error);
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }

        if (data?.session) {
          const { session } = data;
          const { user } = session;
          
          // Проверяем, является ли пользователь администратором
          // Это упрощенная проверка, в реальном приложении нужно проверять роль в БД
          const isAdmin = user?.app_metadata?.role === 'admin' || 
                         user?.email?.endsWith('@spanish-estate.com') || 
                         false;
          
          setAuthState({
            user,
            session,
            loading: false,
            isAdmin
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Ошибка при инициализации аутентификации:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Подписываемся на изменения сессии
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        // Проверяем, является ли пользователь администратором
        const isAdmin = user?.app_metadata?.role === 'admin' || 
                       user?.email?.endsWith('@spanish-estate.com') || 
                       false;

        setAuthState({
          user,
          session,
          loading: false,
          isAdmin
        });

        // При выходе перенаправляем на страницу входа
        if (event === 'SIGNED_OUT') {
          router.push('/admin/login');
        }
      }
    );

    return () => {
      // Отписываемся от слушателя при размонтировании
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Функция для входа с email и паролем
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error };
      }

      // Проверяем, является ли пользователь администратором
      const user = data.user;
      const isAdmin = user?.app_metadata?.role === 'admin' || 
                     user?.email?.endsWith('@spanish-estate.com') || 
                     false;
      
      if (!isAdmin) {
        // Если пользователь не админ, выходим и возвращаем ошибку
        await signOut();
        return { error: new Error('У вас нет прав администратора') };
      }

      return { data };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { error };
    }
  };

  // Функция для выхода
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Ошибка выхода:', error);
        return { error };
      }
      
      localStorage.removeItem('adminLoggedIn'); // Удаляем старую информацию о входе
      return { data: true };
    } catch (error) {
      console.error('Ошибка выхода:', error);
      return { error };
    }
  };

  return {
    ...authState,
    signIn,
    signOut
  };
}; 