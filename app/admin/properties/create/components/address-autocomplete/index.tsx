import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import debounce from 'lodash/debounce';

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
    neighbourhood?: string;
  };
  osm_type?: string;
  osm_id?: number;
  class?: string;
  type?: string;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  onSelectAddress: (address: string, lat: number, lon: number) => void;
  disabled?: boolean;
  initialValue?: string;
  region?: string;
  city?: string;
  includeRegionCity?: boolean;
  readOnly?: boolean;
  version?: number;
  showActiveIndicator?: boolean;
  showVersionBanner?: boolean;
  showHouseNumberIndicator?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder = 'Введите адрес',
  onSelectAddress,
  disabled = false,
  initialValue = '',
  region,
  city,
  includeRegionCity = true,
  readOnly = false,
  version = 1,
  showActiveIndicator = true,
  showVersionBanner = false,
  showHouseNumberIndicator = true
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [houseNumber, setHouseNumber] = useState<string>('');

  // Ищем номер дома в строке запроса
  const extractHouseNumber = (query: string): string | null => {
    // Регулярное выражение для поиска номера дома после названия улицы
    // Ищем числа, которые могут содержать буквы (например 12A, 233-1, 45B)
    const match = query.match(/(\d+\s*[a-zA-Z\-]?)(?:\s|$)/);
    if (match && match[1]) {
      console.log(`[AddressAutocomplete] Извлечен номер дома: ${match[1]}`);
      return match[1].trim();
    }
    return null;
  };

  // Формируем полный адрес включая номер дома
  const formatFullAddress = (suggestion: Suggestion, extractedHouseNumber: string | null): string => {
    let address = suggestion.display_name;
    
    // Если есть номер дома в ответе API, используем его
    if (suggestion.address?.house_number) {
      console.log(`[AddressAutocomplete] API вернул номер дома: ${suggestion.address.house_number}`);
      return address;
    }
    
    // Если API не вернул номер дома, но пользователь ввел его, добавляем его к адресу
    if (extractedHouseNumber && suggestion.address?.road) {
      console.log(`[AddressAutocomplete] Добавляем номер дома из запроса: ${extractedHouseNumber}`);
      
      // Заменяем в адресе название улицы на "улица номер"
      const roadName = suggestion.address.road;
      if (address.includes(roadName)) {
        address = address.replace(roadName, `${roadName}, ${extractedHouseNumber}`);
      } else {
        // Если не удалось найти точное соответствие, просто добавляем номер
        address = `${address} (${extractedHouseNumber})`;
      }
    }
    
    return address;
  };

  // Функция для получения предложений адресов
  const fetchSuggestions = useCallback(
    debounce(async (searchText: string) => {
      if (!searchText || searchText.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        console.log(`[AddressAutocomplete] Поиск адреса: "${searchText}"`);
        
        // Ищем номер дома в запросе
        const extractedHouseNumber = extractHouseNumber(searchText);
        if (extractedHouseNumber) {
          setHouseNumber(extractedHouseNumber);
        } else {
          setHouseNumber('');
        }

        let searchQuery = searchText;
        if (includeRegionCity && (region || city)) {
          if (city && !searchText.toLowerCase().includes(city.toLowerCase())) {
            searchQuery += `, ${city}`;
          }
          if (region && !searchText.toLowerCase().includes(region.toLowerCase())) {
            searchQuery += `, ${region}`;
          }
          if (!searchText.toLowerCase().includes('spain') && !searchText.toLowerCase().includes('españa')) {
            searchQuery += ', Spain';
          }
        }

        console.log(`[AddressAutocomplete] Итоговый поисковый запрос: "${searchQuery}"`);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=5&addressdetails=1&countrycodes=es`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'SpainEstates/1.0',
              'Referer': 'https://spainestates.com/'
            }
          }
        );

        console.log(`[AddressAutocomplete] Статус ответа API: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          throw new Error(`Ошибка при получении данных: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`[AddressAutocomplete] Получено ${data.length} результатов:`, data);
        
        // Если нет результатов, попробуем другой вариант запроса
        if (data.length === 0 && searchText.length > 5) {
          console.log(`[AddressAutocomplete] Нет результатов, пробуем упрощенный запрос`);
          
          // Пробуем поиск с более коротким запросом (только первое слово)
          const simplifiedQuery = searchText.split(' ')[0] + ', Spain';
          
          console.log(`[AddressAutocomplete] Упрощенный запрос: "${simplifiedQuery}"`);
          
          const fallbackResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              simplifiedQuery
            )}&limit=5&addressdetails=1&countrycodes=es`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'SpainEstates/1.0',
                'Referer': 'https://spainestates.com/'
              }
            }
          );
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log(`[AddressAutocomplete] Упрощенный запрос вернул ${fallbackData.length} результатов:`, fallbackData);
            
            if (fallbackData.length > 0) {
              setSuggestions(fallbackData);
              setShowSuggestions(true);
              setIsLoading(false);
              return;
            }
          }
        }
        
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('[AddressAutocomplete] Error fetching suggestions:', err);
        setError('Не удалось загрузить предложения. Пожалуйста, попробуйте снова.');
      } finally {
        setIsLoading(false);
      }
    }, 600), // Увеличиваем debounce до 600мс для лучшего UX
    [city, region, includeRegionCity]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length >= 3) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    console.log(`[AddressAutocomplete] Выбран адрес:`, suggestion);
    
    // Форматируем адрес с учетом номера дома
    const formattedAddress = formatFullAddress(suggestion, houseNumber);
    
    setInputValue(formattedAddress);
    setShowSuggestions(false);
    onSelectAddress(
      formattedAddress,
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon)
    );
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleClearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHouseNumber('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Логирование при монтировании компонента для отладки
  useEffect(() => {
    console.log('[AddressAutocomplete] Компонент смонтирован');
    console.log('[AddressAutocomplete] Параметры:', { 
      city, 
      region, 
      includeRegionCity, 
      initialValue,
      version, 
      showActiveIndicator, 
      showVersionBanner 
    });

    // Выполняем тестовый запрос при монтировании для проверки доступности API
    const testApi = async () => {
      try {
        console.log('[AddressAutocomplete] Выполняем тестовый запрос при монтировании');
        const response = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&q=Madrid&limit=1&countrycodes=es',
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'SpainEstates/1.0',
              'Referer': 'https://spainestates.com/'
            }
          }
        );
        const data = await response.json();
        console.log('[AddressAutocomplete] Тестовый запрос успешен:', data);
      } catch (error) {
        console.error('[AddressAutocomplete] Ошибка тестового запроса:', error);
      }
    };

    testApi();
    
    return () => {
      console.log('[AddressAutocomplete] Компонент размонтирован');
    };
  }, [city, region, includeRegionCity, initialValue, version, showActiveIndicator, showVersionBanner]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Скрытый маркер компонента с версией */}
      <div className="hidden" data-testid="address-autocomplete-component" data-version={version}>
        AddressAutocomplete-Marker-V{version}
      </div>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          data-testid="address-input"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        {inputValue && !readOnly && (
          <button
            onClick={handleClearInput}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            data-testid="clear-button"
          >
            <FiX className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Маркер активности компонента (условный) */}
      {showActiveIndicator && (
        <div className="text-xs text-right text-gray-400 mt-1">
          AddressAutocomplete активен
        </div>
      )}

      {/* Плашка с версией компонента (условная) */}
      {showVersionBanner && (
        <div className="bg-blue-100 text-blue-800 p-2 text-sm rounded mt-1 border-2 border-blue-400 font-semibold">
          Используется новый компонент AddressAutocomplete v{version} — компонент доступен для тестирования на странице /test
        </div>
      )}
      
      {/* Индикатор найденного номера дома (условный) */}
      {showHouseNumberIndicator && houseNumber && (
        <div className="text-xs text-left text-green-600 mt-1">
          Найден номер дома: {houseNumber}
        </div>
      )}

      {isLoading && (
        <div className="absolute bg-white w-full border border-gray-300 rounded-md mt-1 p-2 shadow-lg z-10">
          <div className="flex items-center justify-center p-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500">Загрузка предложений...</span>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute bg-white w-full border border-red-300 rounded-md mt-1 p-2 shadow-lg z-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <ul className="absolute bg-white w-full border border-gray-300 rounded-md mt-1 shadow-lg z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
              data-testid="suggestion-item"
            >
              <div className="text-gray-800">{suggestion.display_name}</div>
              {houseNumber && suggestion.address?.road && !suggestion.address?.house_number && (
                <div className="text-xs text-green-600">
                  + номер дома {houseNumber}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete; 