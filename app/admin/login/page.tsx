'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, user } = useSupabaseAuth();

  // Проверяем, есть ли параметр ошибки в URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'insufficient_permissions') {
      setError('У вас недостаточно прав для доступа к админ-панели.');
    }

    // Отображаем текущего пользователя для отладки
    if (user) {
      setDebugInfo(`Текущий пользователь: ${user.email} 
        Роль: ${user.app_metadata?.role || 'не установлена'}
        ID: ${user.id}`);
    }
  }, [searchParams, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log(`Попытка входа для: ${email}`);
      
      // Проверка на тестовый режим (временно пока не настроена БД)
      if (email === 'admin' && password === 'password') {
        console.log('Вход с тестовыми учетными данными');
        // Сохраняем статус авторизации (для обратной совместимости)
        localStorage.setItem('adminLoggedIn', 'true');
        router.push('/admin/dashboard');
        return;
      }
      
      // Реальная авторизация через Supabase
      console.log('Выполняем вход через Supabase...');
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        console.error('Ошибка входа:', signInError);
        setError(signInError instanceof Error ? signInError.message : 'Ошибка при входе');
        setDebugInfo(`Ошибка: ${JSON.stringify(signInError)}`);
        return;
      }
      
      console.log('Вход успешен, перенаправление...');
      setDebugInfo(`Успешный вход: ${JSON.stringify(data)}`);
      
      // Сохраняем статус авторизации (для обратной совместимости)
      localStorage.setItem('adminLoggedIn', 'true');
      
      // Перенаправляем на страницу, с которой пришел пользователь, или на дашборд
      const fromPath = searchParams.get('from');
      router.push(fromPath || '/admin/dashboard');
    } catch (err) {
      console.error('Непредвиденная ошибка:', err);
      setError('Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
      setDebugInfo(`Непредвиденная ошибка: ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="w-20 h-20 mx-auto relative">
            <Image 
              src="/logo.svg" 
              alt="SpainEstates Logo" 
              layout="fill"
              className="mx-auto"
              priority
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход в панель администратора
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <a href="/" className="font-medium text-blue-600 hover:text-blue-500">
              Вернуться на главную страницу
            </a>
          </div>
        </form>
        
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>Для тестового доступа:</p>
          <p>Логин: admin</p>
          <p>Пароль: password</p>
          <p className="mt-1 pt-1 border-t border-gray-100">
            Или используйте учетные данные Supabase
          </p>
        </div>
        
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
            <p className="font-medium mb-1">Отладочная информация:</p>
            {debugInfo}
          </div>
        )}
      </div>
    </div>
  );
} 