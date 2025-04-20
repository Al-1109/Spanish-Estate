'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-alternative';

export default function TestSupabaseAlt() {
  const [status, setStatus] = useState('Проверка подключения...');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Не указан',
    hasKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Да' : 'Нет'
  });

  useEffect(() => {
    async function checkProjectStatus() {
      try {
        // Проверяем статус проекта через самый простой запрос
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setStatus('Успешное подключение к Supabase!');
        console.log('Session data:', data);
      } catch (err: any) {
        setError(err.message || 'Неизвестная ошибка');
        console.error('Ошибка при проверке статуса проекта:', err);
      }
    }

    checkProjectStatus();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Альтернативный тест Supabase</h1>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Отладочная информация:</h2>
        <p>URL: {debugInfo.url}</p>
        <p>API ключ: {debugInfo.hasKey}</p>
      </div>
      
      {error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded">
          <p className="font-bold">Ошибка:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="text-green-500 p-4 border border-green-300 rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
} 