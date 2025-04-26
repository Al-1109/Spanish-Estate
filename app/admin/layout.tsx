'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Проверка авторизации - будет заменена на более надежный механизм
    const checkAuth = () => {
      // Простая имитация проверки авторизации на клиенте
      const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
      
      setIsAuthorized(isLoggedIn);
      
      // Не редиректим со страницы логина
      if (!isLoggedIn && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  // Пока проверяем авторизацию, показываем загрузку
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // На странице логина не применяем макет админки
  if (pathname === '/admin/login') {
    return children;
  }

  // Если не авторизован и не на странице логина, не рендерим контент
  if (!isAuthorized) {
    return null;
  }

  // Если авторизован, показываем админку с навигацией
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Сайдбар */}
      <div className="w-64 bg-white shadow-md pt-5 pb-8 px-4 flex flex-col fixed h-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold">SpainEstates Admin</h1>
        </div>
        
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <a 
                href="/admin/dashboard" 
                className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${pathname === '/admin/dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">📊</span>
                Дашборд
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="/admin/properties" 
                className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${pathname.startsWith('/admin/properties') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">🏠</span>
                Объекты
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="/admin/users" 
                className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${pathname.startsWith('/admin/users') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">👥</span>
                Пользователи
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="/admin/inquiries" 
                className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${pathname.startsWith('/admin/inquiries') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">✉️</span>
                Запросы
              </a>
            </li>
            <li className="mb-2">
              <a 
                href="/admin/settings" 
                className={`flex items-center px-4 py-3 text-gray-700 rounded-md ${pathname.startsWith('/admin/settings') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              >
                <span className="mr-3">⚙️</span>
                Настройки
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="pt-8 border-t border-gray-200">
          <button 
            className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md w-full"
            onClick={() => {
              localStorage.removeItem('adminLoggedIn');
              router.push('/admin/login');
            }}
          >
            <span className="mr-3">🚪</span>
            Выйти
          </button>
        </div>
      </div>
      
      {/* Основной контент */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
} 