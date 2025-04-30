"use client";

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import AddressAutocomplete from '../admin/properties/create/components/address-autocomplete/index';

// Примеры тестовых адресов для Испании
const TEST_ADDRESSES = [
  { name: 'Торревьеха', query: 'Torrevieja' },
  { name: 'Улица в Мадриде', query: 'Calle Gran Via, Madrid' },
  { name: 'Дом в Барселоне', query: 'Carrer de Mallorca 401, Barcelona' },
  { name: 'Пляж в Аликанте', query: 'Playa Postiguet, Alicante' }
];

export default function TestPage() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [timestamp, setTimestamp] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [apiStatus, setApiStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  const handleClearCache = () => {
    if (typeof window !== 'undefined' && 'clearBrowserCache' in window) {
      // @ts-ignore
      window.clearBrowserCache();
    } else {
      alert('Функция очистки кэша недоступна');
    }
  };

  const handleSelectAddress = (address: string, lat: number, lng: number) => {
    setAddress(address);
    setCoordinates({ lat, lng });
    setSearchHistory(prev => [
      `${new Date().toLocaleTimeString()}: "${address}" (${lat}, ${lng})`,
      ...prev.slice(0, 9) // Ограничиваем историю 10 последними записями
    ]);
    
    // Логируем в консоль для отладки
    console.log('Выбран адрес:', { address, lat, lng });
    
    // Прокручиваем к логам
    if (logRef.current) {
      setTimeout(() => {
        logRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Тестовый запрос к Nominatim API для проверки доступности
  const testNominatimAPI = async (testQuery = 'Madrid') => {
    try {
      setApiStatus('pending');
      setSearchHistory(prev => [
        `${new Date().toLocaleTimeString()}: Тестовый запрос к API для "${testQuery}"...`,
        ...prev
      ]);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(testQuery)}&limit=1&addressdetails=1&countrycodes=es`
      );

      if (!response.ok) {
        throw new Error(`Ошибка при запросе: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setApiStatus('success');
      setSearchHistory(prev => [
        `${new Date().toLocaleTimeString()}: Тестовый запрос успешен. Получено ${data.length} результатов.`,
        ...prev
      ]);
      
      console.log('Тестовый запрос успешен:', data);
    } catch (error) {
      setApiStatus('error');
      console.error('Ошибка при тестовом запросе:', error);
      setSearchHistory(prev => [
        `${new Date().toLocaleTimeString()}: Ошибка API - ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        ...prev
      ]);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-green-100 border-4 border-green-500 m-4 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-green-600">Тестовая страница работает!</h1>
        <p className="mt-2">Время загрузки: {timestamp}</p>
        
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => testNominatimAPI()}
            className={`px-4 py-2 ${
              apiStatus === 'pending' ? 'bg-yellow-500' :
              apiStatus === 'success' ? 'bg-green-500' :
              apiStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white rounded-md hover:opacity-90`}
          >
            {
              apiStatus === 'pending' ? 'Проверка API...' :
              apiStatus === 'success' ? 'API работает ✓' :
              apiStatus === 'error' ? 'API ошибка ✗' : 'Проверить API'
            }
          </button>
          
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-yellow-400 text-yellow-800 rounded-md hover:bg-yellow-500"
          >
            Очистить кэш браузера
          </button>
          
          <button
            onClick={() => setIsDebugMode(!isDebugMode)}
            className={`px-4 py-2 ${isDebugMode ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'} rounded-md hover:bg-purple-600`}
          >
            {isDebugMode ? 'Режим отладки ВКЛ' : 'Режим отладки ВЫКЛ'}
          </button>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Тест компонента AddressAutocomplete</h2>
          <AddressAutocomplete
            onSelectAddress={handleSelectAddress}
            placeholder="Введите адрес (например, Торревьеха, Аликанте)"
          />
          
          {address && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h3 className="font-bold">Выбранный адрес:</h3>
              <p>{address}</p>
              <p className="text-sm text-gray-600">
                Координаты: {coordinates.lat}, {coordinates.lng}
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Готовые примеры адресов:</h3>
            <div className="grid grid-cols-2 gap-2">
              {TEST_ADDRESSES.map((testAddress) => (
                <button 
                  key={testAddress.query}
                  onClick={() => testNominatimAPI(testAddress.query)}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-sm text-left"
                >
                  {testAddress.name}: <span className="text-gray-600">{testAddress.query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {(isDebugMode || searchHistory.length > 0) && (
          <div className="mt-6 bg-gray-800 text-white p-4 rounded-lg shadow overflow-auto max-h-80" ref={logRef}>
            <h2 className="text-xl font-bold mb-2 flex items-center justify-between">
              Лог запросов
              <button 
                onClick={() => setSearchHistory([])} 
                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Очистить лог
              </button>
            </h2>
            <ul className="list-none space-y-1 font-mono text-sm">
              {searchHistory.length > 0 ? 
                searchHistory.map((entry, index) => (
                  <li key={index} className="border-b border-gray-700 pb-1">{entry}</li>
                )) : 
                <li className="text-gray-400">Нет записей</li>
              }
            </ul>
          </div>
        )}
      </div>
      <Script src="/clearCache.js" />
    </div>
  );
} 