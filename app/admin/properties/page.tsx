'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiFilter, FiSearch, FiGrid, FiList, FiSliders, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import { Property } from '@/types/property';

// Временные данные для тестирования
const mockProperties: Property[] = [
  {
    id: '1',
    title: {
      ru: 'Вилла с видом на море',
      en: 'Villa with sea view',
      es: 'Villa con vista al mar'
    },
    description: {
      ru: 'Прекрасная вилла с видом на море...',
      en: 'Beautiful villa with sea view...',
      es: 'Hermosa villa con vista al mar...'
    },
    type: 'villa',
    location: {
      region: 'Costa Blanca',
      city: 'Alicante',
      address: 'Calle del Mar, 123',
      coordinates: {
        lat: 38.3452,
        lng: -0.4815
      }
    },
    price: {
      value: 450000,
      currency: 'EUR'
    },
    status: 'active',
    features: {
      bedrooms: 4,
      bathrooms: 3,
      totalArea: 250,
      landArea: 800,
      hasPool: true,
      hasGarage: true,
      customFeatures: ['Терраса', 'Сад']
    },
    images: [
      {
        id: 'img1',
        url: 'https://example.com/img1.jpg',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        isMain: true,
        order: 1
      }
    ],
    homepageDisplay: {
      showOnHomepage: true,
      homepagePriority: 10
    },
    viewsStats: {
      totalViews: 150,
      lastWeekViews: 45,
      lastMonthViews: 120,
      viewsHistory: [
        { date: '2024-04-25', count: 10 },
        { date: '2024-04-26', count: 15 }
      ]
    },
    seo: {
      title: {
        ru: 'Вилла в Аликанте с видом на море',
        en: 'Villa in Alicante with sea view',
        es: 'Villa en Alicante con vista al mar'
      },
      description: {
        ru: 'Описание для SEO...',
        en: 'SEO description...',
        es: 'Descripción para SEO...'
      },
      keywords: {
        ru: 'вилла, аликанте, море',
        en: 'villa, alicante, sea',
        es: 'villa, alicante, mar'
      }
    },
    createdAt: '2024-04-20T10:00:00Z',
    updatedAt: '2024-04-25T15:30:00Z',
    changeHistory: [
      {
        timestamp: '2024-04-25T15:30:00Z',
        userId: 'user1',
        userName: 'Admin',
        changes: { price: { from: 420000, to: 450000 } }
      }
    ]
  },
  // Можно добавить больше тестовых объектов по аналогии
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  // Состояние для фильтров
  const [filters, setFilters] = useState({
    search: '',
    propertyType: '',
    status: '',
    priceMin: '',
    priceMax: '',
  });

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    setTimeout(() => {
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление объектами недвижимости</h1>
        <Link href="/admin/properties/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <FiPlus /> Добавить объект
          </button>
        </Link>
      </div>

      {/* Панель фильтров */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter />
          <h2 className="text-lg font-semibold">Фильтры</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Поиск</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Название, ID, адрес..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип объекта</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Все типы</option>
              <option value="apartment">Квартира</option>
              <option value="house">Дом</option>
              <option value="villa">Вилла</option>
              <option value="commercial">Коммерческая</option>
              <option value="land">Земельный участок</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Все статусы</option>
              <option value="active">Активен</option>
              <option value="sold">Продан</option>
              <option value="reserved">Зарезервирован</option>
              <option value="draft">Черновик</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (€)</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                placeholder="От"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                placeholder="До"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <button className="text-blue-600 flex items-center gap-1">
            <FiSliders /> Расширенные фильтры
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center gap-1">
            <FiRefreshCw /> Сбросить
          </button>
        </div>
      </div>

      {/* Переключатель вида и результаты */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <span className="text-gray-600">Найдено объектов: {properties.length}</span>
          </div>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </button>
            <button 
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
              onClick={() => setViewMode('table')}
            >
              <FiList />
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Загрузка объектов недвижимости...</p>
          </div>
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Изображение
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Название
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тип
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Цена
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Статус
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        На главной
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Просмотры
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {properties.map((property) => (
                      <tr key={property.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden">
                            {property.images && property.images.length > 0 ? (
                              <img 
                                src={property.images[0].thumbnailUrl} 
                                alt={property.title.ru} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full text-gray-400">
                                Нет фото
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{property.title.ru}</div>
                          <div className="text-sm text-gray-500">{property.location.city}, {property.location.region}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.type === 'apartment' && 'Квартира'}
                          {property.type === 'house' && 'Дом'}
                          {property.type === 'villa' && 'Вилла'}
                          {property.type === 'commercial' && 'Коммерческая'}
                          {property.type === 'land' && 'Земля'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{property.price.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${property.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                            ${property.status === 'sold' ? 'bg-gray-100 text-gray-800' : ''}
                            ${property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${property.status === 'draft' ? 'bg-gray-100 text-gray-500' : ''}
                          `}>
                            {property.status === 'active' && 'Активен'}
                            {property.status === 'sold' && 'Продан'}
                            {property.status === 'reserved' && 'Зарезервирован'}
                            {property.status === 'draft' && 'Черновик'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.homepageDisplay.showOnHomepage ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              Да (Приоритет: {property.homepageDisplay.homepagePriority})
                            </span>
                          ) : 'Нет'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {property.viewsStats.totalViews} ({property.viewsStats.lastWeekViews} за неделю)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link href={`/admin/properties/${property.id}`}>
                              <button className="text-indigo-600 hover:text-indigo-900">Просмотр</button>
                            </Link>
                            <Link href={`/admin/properties/${property.id}/edit`}>
                              <button className="text-blue-600 hover:text-blue-900">Редактировать</button>
                            </Link>
                            <button className="text-red-600 hover:text-red-900">Удалить</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {property.images && property.images.length > 0 ? (
                        <img 
                          src={property.images[0].url} 
                          alt={property.title.ru} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          Нет фото
                        </div>
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full 
                        ${property.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${property.status === 'sold' ? 'bg-gray-100 text-gray-800' : ''}
                        ${property.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${property.status === 'draft' ? 'bg-gray-100 text-gray-500' : ''}
                      `}>
                        {property.status === 'active' && 'Активен'}
                        {property.status === 'sold' && 'Продан'}
                        {property.status === 'reserved' && 'Зарезервирован'}
                        {property.status === 'draft' && 'Черновик'}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{property.title.ru}</h3>
                      <p className="text-gray-600 mb-2">{property.location.city}, {property.location.region}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold">€{property.price.value.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">
                          {property.features.bedrooms} спален • {property.features.bathrooms} ванных
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          {property.homepageDisplay.showOnHomepage && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-2">
                              На главной
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            👁️ {property.viewsStats.totalViews}
                          </span>
                        </div>
                        <div className="space-x-2">
                          <Link href={`/admin/properties/${property.id}`}>
                            <button className="text-indigo-600 hover:text-indigo-900 text-sm">Просмотр</button>
                          </Link>
                          <Link href={`/admin/properties/${property.id}/edit`}>
                            <button className="text-blue-600 hover:text-blue-900 text-sm">Редактировать</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 