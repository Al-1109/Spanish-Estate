'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiCheck, FiX, FiEye, FiBarChart2, FiShuffle } from 'react-icons/fi';
import Link from 'next/link';
import { Property, HomepageDisplayMode, HomepagePropertiesSettings } from '@/types/property';

// Временные данные для тестирования
const mockProperties: Property[] = [
  {
    id: '1',
    title: {
      ru: 'Вилла с видом на море',
      en: 'Villa with sea view',
      es: 'Villa con vista al mar'
    },
    // ... (другие поля опущены для краткости)
    homepageDisplay: {
      showOnHomepage: true,
      homepagePriority: 10
    },
    viewsStats: {
      totalViews: 150,
      lastWeekViews: 45,
      lastMonthViews: 120,
      viewsHistory: []
    },
    // ... другие обязательные поля
    description: { ru: '', en: '', es: '' },
    type: 'villa',
    location: { 
      region: 'Costa Blanca', 
      city: 'Alicante', 
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    price: { value: 450000, currency: 'EUR' },
    status: 'active',
    features: {
      bedrooms: 4,
      bathrooms: 3,
      totalArea: 250,
      customFeatures: []
    },
    images: [],
    seo: {
      title: { ru: '', en: '', es: '' },
      description: { ru: '', en: '', es: '' },
      keywords: { ru: '', en: '', es: '' }
    },
    createdAt: '',
    updatedAt: '',
    changeHistory: []
  },
  {
    id: '2',
    title: {
      ru: 'Апартаменты в центре города',
      en: 'City center apartment',
      es: 'Apartamento en el centro de la ciudad'
    },
    // ... (другие поля опущены для краткости)
    homepageDisplay: {
      showOnHomepage: false,
      homepagePriority: 0
    },
    viewsStats: {
      totalViews: 98,
      lastWeekViews: 22,
      lastMonthViews: 76,
      viewsHistory: []
    },
    // ... другие обязательные поля
    description: { ru: '', en: '', es: '' },
    type: 'apartment',
    location: { 
      region: 'Costa Blanca', 
      city: 'Benidorm', 
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    price: { value: 180000, currency: 'EUR' },
    status: 'active',
    features: {
      bedrooms: 2,
      bathrooms: 1,
      totalArea: 75,
      customFeatures: []
    },
    images: [],
    seo: {
      title: { ru: '', en: '', es: '' },
      description: { ru: '', en: '', es: '' },
      keywords: { ru: '', en: '', es: '' }
    },
    createdAt: '',
    updatedAt: '',
    changeHistory: []
  },
  {
    id: '3',
    title: {
      ru: 'Дом с бассейном',
      en: 'House with pool',
      es: 'Casa con piscina'
    },
    // ... (другие поля опущены для краткости)
    homepageDisplay: {
      showOnHomepage: true,
      homepagePriority: 5
    },
    viewsStats: {
      totalViews: 210,
      lastWeekViews: 65,
      lastMonthViews: 145,
      viewsHistory: []
    },
    // ... другие обязательные поля
    description: { ru: '', en: '', es: '' },
    type: 'house',
    location: { 
      region: 'Costa del Sol', 
      city: 'Marbella', 
      address: '',
      coordinates: { lat: 0, lng: 0 }
    },
    price: { value: 650000, currency: 'EUR' },
    status: 'active',
    features: {
      bedrooms: 5,
      bathrooms: 4,
      totalArea: 350,
      customFeatures: []
    },
    images: [],
    seo: {
      title: { ru: '', en: '', es: '' },
      description: { ru: '', en: '', es: '' },
      keywords: { ru: '', en: '', es: '' }
    },
    createdAt: '',
    updatedAt: '',
    changeHistory: []
  },
];

// Настройки по умолчанию
const defaultSettings: HomepagePropertiesSettings = {
  displayMode: 'manual',
  numberOfProperties: 6,
  manuallySelectedIds: ['1', '3'],
  popularityPeriod: 'month',
  filters: {
    types: ['apartment', 'house', 'villa'],
    onlyActive: true
  },
  lastUpdated: new Date().toISOString(),
  lastUpdatedBy: 'Admin'
};

export default function HomepagePropertiesSettingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [settings, setSettings] = useState<HomepagePropertiesSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Имитация загрузки данных
  useEffect(() => {
    // В реальном приложении здесь будут запросы к API
    setTimeout(() => {
      setProperties(mockProperties);
      setSelectedProperties(defaultSettings.manuallySelectedIds || []);
      setLoading(false);
    }, 1000);
  }, []);

  // Функция для изменения режима отображения
  const handleDisplayModeChange = (mode: HomepageDisplayMode) => {
    setSettings({ ...settings, displayMode: mode });
    setIsDirty(true);
  };

  // Функция для изменения количества объектов
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings({ ...settings, numberOfProperties: value });
      setIsDirty(true);
    }
  };

  // Функция для выбора/отмены выбора объекта (для ручного режима)
  const togglePropertySelection = (propertyId: string) => {
    if (selectedProperties.includes(propertyId)) {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    } else {
      setSelectedProperties([...selectedProperties, propertyId]);
    }
    setIsDirty(true);
  };

  // Функция для сохранения настроек
  const saveSettings = () => {
    const updatedSettings = {
      ...settings,
      manuallySelectedIds: selectedProperties,
      lastUpdated: new Date().toISOString(),
      lastUpdatedBy: 'Admin' // В реальном приложении здесь будет имя текущего администратора
    };
    
    // В реальном приложении здесь будет запрос к API для сохранения настроек
    console.log('Сохранение настроек:', updatedSettings);
    setSettings(updatedSettings);
    setIsDirty(false);
    
    // Имитация успешного сохранения
    alert('Настройки успешно сохранены');
  };

  // Функция для предпросмотра текущих настроек
  const previewSettings = () => {
    // В реальном приложении здесь будет открытие превью или редирект на главную страницу
    window.open('/', '_blank');
  };

  // Определяем, какие объекты будут показаны на главной странице в соответствии с текущими настройками
  const getDisplayedProperties = () => {
    let displayedProps: Property[] = [];
    
    // Фильтрация по активным, если включено
    let filteredProps = settings.filters?.onlyActive 
      ? properties.filter(p => p.status === 'active') 
      : [...properties];
    
    // Фильтрация по типам, если указаны
    if (settings.filters?.types && settings.filters.types.length > 0) {
      filteredProps = filteredProps.filter(p => settings.filters?.types?.includes(p.type));
    }
    
    switch (settings.displayMode) {
      case 'manual':
        // Для ручного режима берем объекты с выбранными ID
        displayedProps = filteredProps.filter(p => selectedProperties.includes(p.id))
          .sort((a, b) => b.homepageDisplay.homepagePriority - a.homepageDisplay.homepagePriority);
        break;
        
      case 'most_viewed':
        // Для режима "наиболее просматриваемые" сортируем по просмотрам
        displayedProps = [...filteredProps].sort((a, b) => {
          if (settings.popularityPeriod === 'week') {
            return b.viewsStats.lastWeekViews - a.viewsStats.lastWeekViews;
          } else if (settings.popularityPeriod === 'month') {
            return b.viewsStats.lastMonthViews - a.viewsStats.lastMonthViews;
          } else {
            return b.viewsStats.totalViews - a.viewsStats.totalViews;
          }
        });
        break;
        
      case 'random':
        // Для случайного режима просто берем любые объекты
        displayedProps = filteredProps;
        // В реальном приложении здесь будет случайная сортировка
        break;
    }
    
    // Ограничиваем количество
    return displayedProps.slice(0, settings.numberOfProperties);
  };

  const displayedProperties = getDisplayedProperties();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Настройка объектов на главной странице</h1>
        <div className="flex gap-2">
          <button 
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2"
            onClick={previewSettings}
          >
            <FiEye /> Предпросмотр
          </button>
          <button 
            className={`${isDirty ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} px-4 py-2 rounded flex items-center gap-2`}
            onClick={isDirty ? saveSettings : undefined}
            disabled={!isDirty}
          >
            <FiSave /> Сохранить изменения
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка настроек...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Настройки отображения */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Параметры отображения</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Режим отображения объектов</label>
              
              <div className="grid grid-cols-1 gap-2">
                <button 
                  className={`flex items-center justify-between p-3 rounded border ${settings.displayMode === 'manual' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleDisplayModeChange('manual')}
                >
                  <div className="flex items-center">
                    <FiCheck className="mr-2" />
                    <span>Ручной выбор</span>
                  </div>
                  {settings.displayMode === 'manual' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Активно</span>
                  )}
                </button>
                
                <button 
                  className={`flex items-center justify-between p-3 rounded border ${settings.displayMode === 'most_viewed' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleDisplayModeChange('most_viewed')}
                >
                  <div className="flex items-center">
                    <FiBarChart2 className="mr-2" />
                    <span>Наиболее просматриваемые</span>
                  </div>
                  {settings.displayMode === 'most_viewed' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Активно</span>
                  )}
                </button>
                
                <button 
                  className={`flex items-center justify-between p-3 rounded border ${settings.displayMode === 'random' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
                  onClick={() => handleDisplayModeChange('random')}
                >
                  <div className="flex items-center">
                    <FiShuffle className="mr-2" />
                    <span>Случайный выбор</span>
                  </div>
                  {settings.displayMode === 'random' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Активно</span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="numberOfProperties" className="block text-sm font-medium text-gray-700 mb-2">
                Количество объектов на главной
              </label>
              <input
                type="number"
                id="numberOfProperties"
                value={settings.numberOfProperties}
                onChange={handleNumberChange}
                min="1"
                max="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Рекомендуемое количество: 6-9 объектов.
              </p>
            </div>
            
            {settings.displayMode === 'most_viewed' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Период для расчета популярности
                </label>
                <select 
                  value={settings.popularityPeriod}
                  onChange={(e) => {
                    setSettings({ ...settings, popularityPeriod: e.target.value as 'week' | 'month' | 'all_time' });
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="week">За последнюю неделю</option>
                  <option value="month">За последний месяц</option>
                  <option value="all_time">За все время</option>
                </select>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Дополнительные фильтры</h3>
              
              <div className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.filters?.onlyActive || false}
                    onChange={(e) => {
                      setSettings({
                        ...settings, 
                        filters: { 
                          ...settings.filters,
                          onlyActive: e.target.checked
                        }
                      });
                      setIsDirty(true);
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Показывать только активные объекты</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Типы объектов:</label>
                <div className="space-y-1">
                  {['apartment', 'house', 'villa', 'commercial', 'land'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.filters?.types?.includes(type as any) || false}
                        onChange={(e) => {
                          const currentTypes = settings.filters?.types || [];
                          const newTypes = e.target.checked
                            ? [...currentTypes, type]
                            : currentTypes.filter(t => t !== type);
                            
                          setSettings({
                            ...settings,
                            filters: {
                              ...settings.filters,
                              types: newTypes as any
                            }
                          });
                          setIsDirty(true);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {type === 'apartment' && 'Квартира'}
                        {type === 'house' && 'Дом'}
                        {type === 'villa' && 'Вилла'}
                        {type === 'commercial' && 'Коммерческая'}
                        {type === 'land' && 'Земля'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <p>Последнее обновление: {new Date(settings.lastUpdated).toLocaleString()}</p>
              <p>Обновил: {settings.lastUpdatedBy}</p>
            </div>
          </div>
          
          {/* Список объектов и предпросмотр */}
          <div className="md:col-span-2 space-y-6">
            {/* Результат текущих настроек */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Предпросмотр выбора</h2>
              
              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">Текущие настройки:</p>
                  <span className="text-gray-500">Отображается {displayedProperties.length} из {settings.numberOfProperties} объектов</span>
                </div>
                
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Режим: {
                    settings.displayMode === 'manual' ? 'Ручной выбор' :
                    settings.displayMode === 'most_viewed' ? 'Наиболее просматриваемые' :
                    'Случайный выбор'
                  }</li>
                  {settings.displayMode === 'most_viewed' && (
                    <li>Период популярности: {
                      settings.popularityPeriod === 'week' ? 'Последняя неделя' :
                      settings.popularityPeriod === 'month' ? 'Последний месяц' :
                      'Все время'
                    }</li>
                  )}
                  <li>Только активные объекты: {settings.filters?.onlyActive ? 'Да' : 'Нет'}</li>
                </ul>
              </div>
              
              {displayedProperties.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedProperties.map(property => (
                    <div key={property.id} className="border rounded p-3 bg-gray-50">
                      <div className="font-medium mb-1 truncate">{property.title.ru}</div>
                      <div className="text-sm text-gray-600 mb-2">{property.type}, {property.location.city}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600">€{property.price.value.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">👁️ {property.viewsStats.totalViews}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded">
                  <p className="text-gray-500">Нет объектов для отображения с текущими настройками</p>
                </div>
              )}
            </div>
            
            {/* Список всех объектов для ручного выбора */}
            {settings.displayMode === 'manual' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Выбор объектов вручную</h2>
                
                <p className="text-sm text-gray-600 mb-4">
                  Выберите объекты, которые будут отображаться на главной странице. Выбрано {selectedProperties.length} из {settings.numberOfProperties}.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Выбрать
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Название
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Тип
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Цена
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Просмотры
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.map(property => (
                        <tr key={property.id} className={selectedProperties.includes(property.id) ? 'bg-blue-50' : ''}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedProperties.includes(property.id)}
                                onChange={() => togglePropertySelection(property.id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </label>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{property.title.ru}</div>
                            <div className="text-xs text-gray-500">{property.location.city}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.type === 'apartment' && 'Квартира'}
                            {property.type === 'house' && 'Дом'}
                            {property.type === 'villa' && 'Вилла'}
                            {property.type === 'commercial' && 'Коммерческая'}
                            {property.type === 'land' && 'Земля'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            €{property.price.value.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
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
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.viewsStats.totalViews}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {selectedProperties.length > settings.numberOfProperties && (
                  <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                    <FiX className="inline mr-1" />
                    Вы выбрали {selectedProperties.length} объектов, но на главной будет показано только {settings.numberOfProperties}. 
                    Уменьшите количество выбранных объектов или увеличьте лимит.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 