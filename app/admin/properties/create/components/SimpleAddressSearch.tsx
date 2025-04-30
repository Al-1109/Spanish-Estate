"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import debounce from 'lodash/debounce';

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
}

interface SimpleAddressSearchProps {
  onSelectAddress: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
}

const SimpleAddressSearch: React.FC<SimpleAddressSearchProps> = ({
  onSelectAddress,
  placeholder = 'Введите адрес'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [testApiStatus, setTestApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Функция для выполнения поиска
  const searchAddress = useCallback(
    debounce(async (searchText: string) => {
      if (searchText.length < 3) return;

      setIsLoading(true);
      console.log(`[SimpleAddressSearch] Начинаю поиск адреса: "${searchText}"`);
      
      try {
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}, Spain&limit=5&addressdetails=1&countrycodes=es`;
        
        console.log(`[SimpleAddressSearch] Запрос к API: ${apiUrl}`);
        
        const response = await fetch(
          apiUrl,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'SpainEstates/1.0',
              'Referer': 'https://spainestates.com/'
            }
          }
        );

        console.log(`[SimpleAddressSearch] Статус ответа: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`[SimpleAddressSearch] Получено результатов: ${data.length}`, data);
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        } else {
          console.error(`[SimpleAddressSearch] Ошибка при запросе к API: ${response.status}`, await response.text());
        }
      } catch (error) {
        console.error('[SimpleAddressSearch] Ошибка при поиске адреса:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Функция для тестового запроса к API
  const testNominatimApi = async () => {
    try {
      console.log('[SimpleAddressSearch] Тестовый запрос к Nominatim API...');
      setTestApiStatus('idle');
      setIsLoading(true);
      
      const testQuery = 'Madrid';
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(testQuery)}&limit=1&countrycodes=es`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SpainEstates/1.0',
            'Referer': 'https://spainestates.com/'
          }
        }
      );
      
      console.log(`[SimpleAddressSearch] Тестовый запрос, статус: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[SimpleAddressSearch] Тестовый запрос успешен:', data);
        
        if (data && data.length > 0) {
          setTestApiStatus('success');
          // Показываем тестовый результат
          setSuggestions(data);
          setShowSuggestions(true);
          return true;
        } else {
          console.error('[SimpleAddressSearch] Тестовый запрос вернул пустой результат');
          setTestApiStatus('error');
          return false;
        }
      } else {
        console.error(`[SimpleAddressSearch] Ошибка тестового запроса: ${response.status}`);
        setTestApiStatus('error');
        return false;
      }
    } catch (error) {
      console.error('[SimpleAddressSearch] Исключение при тестовом запросе:', error);
      setTestApiStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 3) {
      searchAddress(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Обработчик выбора предложения
  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const address = suggestion.display_name;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    setQuery(address);
    setShowSuggestions(false);
    
    console.log('Выбран адрес:', address, lat, lng);
    onSelectAddress(address, lat, lng);
  };

  // Обработчик клика вне компонента
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  }, []);

  // Добавляем обработчик при монтировании
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="bg-blue-50 p-2 mb-2 rounded border border-blue-200">
        <div className="font-medium text-blue-800 text-sm mb-1">Поиск адресов в Испании (SimpleAddressSearch)</div>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full p-2 pl-10 border-2 border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-blue-500" />
            </div>
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <FiX className="text-blue-500 hover:text-blue-700" />
              </button>
            )}
          </div>
          
          <button 
            onClick={testNominatimApi}
            className={`px-3 py-2 rounded text-white text-sm ${
              testApiStatus === 'success' ? 'bg-green-500' : 
              testApiStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {testApiStatus === 'success' ? 'API ✓' : 
             testApiStatus === 'error' ? 'API ✗' : 'Тест API'}
          </button>
        </div>
        
        <div className="text-xs text-blue-700 mt-1">
          Начните вводить адрес (минимум 3 символа) или нажмите "Тест API" для проверки соединения
        </div>
      </div>

      {isLoading && (
        <div className="absolute bg-white w-full border-2 border-blue-300 rounded-md mt-1 p-2 shadow-lg z-10">
          <div className="flex items-center justify-center p-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-blue-600 font-medium">Загрузка предложений...</span>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <ul className="absolute bg-white w-full border-2 border-blue-300 rounded-md mt-1 shadow-lg z-10 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <div className="text-gray-800">{suggestion.display_name}</div>
            </li>
          ))}
        </ul>
      )}
      
      {!isLoading && suggestions.length === 0 && query.length >= 3 && (
        <div className="absolute bg-white w-full border-2 border-orange-300 rounded-md mt-1 p-2 shadow-lg z-10">
          <div className="text-orange-600">
            Адреса не найдены. Попробуйте изменить запрос или нажмите "Тест API".
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAddressSearch; 