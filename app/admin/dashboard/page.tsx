'use client';

import { useEffect, useState } from 'react';
import { FiHome, FiUsers, FiMail, FiStar, FiCalendar } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    inquiries: 0,
    views: 0,
    newListings: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setStats({
        properties: 127,
        users: 456,
        inquiries: 38,
        views: 1243,
        newListings: 12
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    { title: 'Всего объектов', value: stats.properties, icon: <FiHome className="text-blue-600" size={24} /> },
    { title: 'Пользователей', value: stats.users, icon: <FiUsers className="text-green-600" size={24} /> },
    { title: 'Новых запросов', value: stats.inquiries, icon: <FiMail className="text-yellow-600" size={24} /> },
    { title: 'Просмотров за неделю', value: stats.views, icon: <FiStar className="text-purple-600" size={24} /> },
    { title: 'Новых объектов за месяц', value: stats.newListings, icon: <FiCalendar className="text-red-600" size={24} /> }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Панель управления</h1>
        <p className="text-gray-600">Обзор ключевых показателей вашего сайта</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                  <div className="p-2 rounded-full bg-gray-50">{card.icon}</div>
                </div>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-gray-800">{card.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Последние запросы от клиентов</h3>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Клиент {index + 1}</p>
                        <p className="text-sm text-gray-600">Запрос о недвижимости #{Math.floor(Math.random() * 1000)}</p>
                      </div>
                      <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button className="text-blue-600 text-sm hover:underline">
                  Смотреть все запросы
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Популярные объекты</h3>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="bg-gray-100 rounded-md h-12 w-12 flex items-center justify-center text-gray-500">
                      <FiHome />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Вилла Побережье #{index + 1}</p>
                      <p className="text-sm text-gray-600">{Math.floor(Math.random() * 1000)} просмотров</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <button className="text-blue-600 text-sm hover:underline">
                  Смотреть все объекты
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 