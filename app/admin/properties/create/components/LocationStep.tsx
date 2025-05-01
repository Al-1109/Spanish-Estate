import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiMapPin, FiInfo, FiSearch, FiLoader } from 'react-icons/fi';
import { Property } from '@/types/property';
import LeafletMap from './map/LeafletMap';
import type { AddressDetails } from './map/LeafletMap';
import SimpleAddressSearch from './SimpleAddressSearch';
import AddressAutocomplete from './address-autocomplete/index';
import debounce from 'lodash/debounce';
import Script from 'next/script';

interface LocationStepProps {
  property?: Partial<Property>;
  setProperty?: (property: Partial<Property>) => void;
  errors?: Record<string, any>;
}

interface RegionCityMapping {
  [region: string]: string[];
}

// Геокодированный результат для автозаполнения
interface GeocodeSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    region?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
    country?: string;
  };
}

// Маппинг кодов регионов в системе к их отображаемым названиям
const REGION_DISPLAY_TO_CODE: Record<string, string> = {
  'Коста Бланка': 'costa-blanca',
  'Alicante': 'costa-blanca', // Английские названия для обратного геокодирования
  'Аликанте': 'costa-blanca',
  'Коста дель Соль': 'costa-del-sol',
  'Costa del Sol': 'costa-del-sol',
  'Malaga': 'costa-del-sol',
  'Малага': 'costa-del-sol',
  'Майорка': 'mallorca',
  'Mallorca': 'mallorca',
  'Тенерифе': 'tenerife',
  'Tenerife': 'tenerife',
  'Санта-Крус-де-Тенерифе': 'tenerife',
  'Santa Cruz de Tenerife': 'tenerife',
  'Канарские острова': 'tenerife',
  'Canary Islands': 'tenerife',
  'Ибица': 'ibiza',
  'Ibiza': 'ibiza'
};

// Маппинг кодов городов к их отображаемым названиям
const CITY_DISPLAY_TO_CODE: Record<string, string> = {
  'Аликанте': 'alicante',
  'Alicante': 'alicante',
  'Бенидорм': 'benidorm',
  'Benidorm': 'benidorm',
  'Торревьеха': 'torrevieja',
  'Torrevieja': 'torrevieja',
  'Альтеа': 'altea',
  'Altea': 'altea',
  'Кальпе': 'calpe',
  'Calpe': 'calpe',
  'Хавеа': 'javea',
  'Javea': 'javea',
  'Морайра': 'moraira',
  'Moraira': 'moraira',
  'Дения': 'denia',
  'Denia': 'denia',
  'Малага': 'malaga',
  'Malaga': 'malaga',
  'Марбелья': 'marbella',
  'Marbella': 'marbella',
  'Эстепона': 'estepona',
  'Estepona': 'estepona',
  'Фуэнхирола': 'fuengirola',
  'Fuengirola': 'fuengirola',
  'Беналмадена': 'benalmadena',
  'Benalmadena': 'benalmadena',
  'Пальма': 'palma',
  'Palma': 'palma',
  'Palma de Mallorca': 'palma',
  'Алькудия': 'alcudia',
  'Alcudia': 'alcudia',
  'Польенса': 'pollenca',
  'Pollenca': 'pollenca',
  'Андрач': 'andratx',
  'Andratx': 'andratx',
  'Кальвия': 'calvia',
  'Calvia': 'calvia',
  'Санта-Крус-де-Тенерифе': 'santa-cruz',
  'Santa Cruz de Tenerife': 'santa-cruz',
  'Пуэрто-де-ла-Крус': 'puerto-de-la-cruz',
  'Puerto de la Cruz': 'puerto-de-la-cruz',
  'Адехе': 'adeje',
  'Adeje': 'adeje',
  'Арона': 'arona',
  'Arona': 'arona',
  'Лос-Кристианос': 'los-cristianos',
  'Los Cristianos': 'los-cristianos',
  'Ибица': 'ibiza-town',
  'Ibiza Town': 'ibiza-town',
  'Санта-Эулалия': 'santa-eulalia',
  'Santa Eulalia': 'santa-eulalia',
  'Сан-Антонио': 'san-antonio',
  'San Antonio': 'san-antonio',
  'Сан-Хосе': 'san-jose',
  'San Jose': 'san-jose'
};

const LocationStep: React.FC<LocationStepProps> = () => {
  const { register, formState: { errors }, watch, setValue, clearErrors } = useFormContext<Partial<Property>>();
  
  const locationErrors = errors.location || {};
  
  // Получаем текущие координаты из формы
  const lat = watch('location.coordinates.lat');
  const lng = watch('location.coordinates.lng');
  
  // Получаем текущий адрес, город и регион
  const address = watch('location.address');
  const city = watch('location.city');
  const region = watch('location.region');
  
  // Состояние для хранения координат маркера
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    lat && lng ? [Number(lat), Number(lng)] : null
  );
  
  // Состояние для адреса поиска
  const [searchAddress, setSearchAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Состояние для автозаполнения
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Таймер для дебаунса запросов
  const debounceTimerRef = useRef<number | null>(null);
  
  // Флаг для отслеживания деталей выбора адреса
  const [addressWasSelected, setAddressWasSelected] = useState(false);
  const [shouldUseDetailedZoom, setShouldUseDetailedZoom] = useState(false);
  
  // Реф для контейнера автозаполнения
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Состояние для хранения доступных городов в зависимости от выбранного региона
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  // Реф для хранения инстанса карты
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  // Маппинг регионов и городов
  const regionCityMapping: RegionCityMapping = {
    'costa-blanca': ['alicante', 'benidorm', 'torrevieja', 'altea', 'calpe', 'javea', 'moraira', 'denia'],
    'costa-del-sol': ['malaga', 'marbella', 'estepona', 'fuengirola', 'benalmadena'],
    'mallorca': ['palma', 'alcudia', 'pollenca', 'andratx', 'calvia'],
    'tenerife': ['santa-cruz', 'puerto-de-la-cruz', 'adeje', 'arona', 'los-cristianos'],
    'ibiza': ['ibiza-town', 'santa-eulalia', 'san-antonio', 'san-jose']
  };
  
  // Читаемые названия городов для отображения
  const cityDisplayNames: Record<string, string> = {
    'alicante': 'Аликанте',
    'benidorm': 'Бенидорм',
    'torrevieja': 'Торревьеха',
    'altea': 'Альтеа',
    'calpe': 'Кальпе',
    'javea': 'Хавеа',
    'moraira': 'Морайра',
    'denia': 'Дения',
    'malaga': 'Малага',
    'marbella': 'Марбелья',
    'estepona': 'Эстепона',
    'fuengirola': 'Фуэнхирола',
    'benalmadena': 'Беналмадена',
    'palma': 'Пальма',
    'alcudia': 'Алькудия',
    'pollenca': 'Польенса',
    'andratx': 'Андрач',
    'calvia': 'Кальвия',
    'santa-cruz': 'Санта-Крус-де-Тенерифе',
    'puerto-de-la-cruz': 'Пуэрто-де-ла-Крус',
    'adeje': 'Адехе',
    'arona': 'Арона',
    'los-cristianos': 'Лос-Кристианос',
    'ibiza-town': 'Ибица (город)',
    'santa-eulalia': 'Санта-Эулалия',
    'san-antonio': 'Сан-Антонио',
    'san-jose': 'Сан-Хосе'
  };
  
  // Читаемые названия регионов
  const regionDisplayNames: Record<string, string> = {
    'costa-blanca': 'Коста Бланка',
    'costa-del-sol': 'Коста дель Соль',
    'mallorca': 'Майорка',
    'tenerife': 'Тенерифе',
    'ibiza': 'Ибица'
  };
  
  // Объявление для контроля принудительного зума
  const [addressJustSelected, setAddressJustSelected] = useState(false);
  
  // Обрабатываем клик вне автозаполнения
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Обновляем список доступных городов при изменении региона
  useEffect(() => {
    if (region && regionCityMapping[region]) {
      setAvailableCities(regionCityMapping[region]);
      
      // Если выбранный город не соответствует региону, сбрасываем его
      if (city && !regionCityMapping[region].includes(city)) {
        setValue('location.city', '');
      }
    } else {
      setAvailableCities([]);
    }
  }, [region, city, setValue]);
  
  // Регистрируем поле адреса для валидации
  useEffect(() => {
    register('location.address', { required: 'Введите адрес или выберите на карте' });
  }, [register]);
  
  // Обработчик результатов геокодирования
  const handleAddressFound = useCallback((addressDetails: AddressDetails) => {
    console.log('Найден адрес:', addressDetails);
    
    // Устанавливаем адрес
    if (addressDetails.streetAddress || addressDetails.fullAddress) {
      const formattedAddress = addressDetails.streetAddress || addressDetails.fullAddress;
      setValue('location.address', formattedAddress, { shouldValidate: true });
    }
    
    // Устанавливаем координаты
    setValue('location.coordinates.lat', addressDetails.lat, { shouldValidate: true });
    setValue('location.coordinates.lng', addressDetails.lng, { shouldValidate: true });
    
    // Обрабатываем город и регион, если они есть
    if (addressDetails.city) {
      const cityCode = CITY_DISPLAY_TO_CODE[addressDetails.city];
      if (cityCode) {
        // Найден известный город
        setValue('location.city', cityCode, { shouldValidate: true });
        
        // Определяем регион на основе города
        for (const [regionCode, cities] of Object.entries(regionCityMapping)) {
          if (cities.includes(cityCode)) {
            setValue('location.region', regionCode, { shouldValidate: true });
            break;
          }
        }
      }
    }
    
    if (addressDetails.region && !city) {
      const regionCode = REGION_DISPLAY_TO_CODE[addressDetails.region];
      if (regionCode) {
        setValue('location.region', regionCode, { shouldValidate: true });
      }
    }
    
    // Очищаем ошибки валидации
    clearErrors('location.address');
    clearErrors('location.coordinates.lat');
    clearErrors('location.coordinates.lng');
    
    // Устанавливаем флаг, что адрес был выбран - для зума карты
    setAddressWasSelected(true);
    setShouldUseDetailedZoom(true);
    
    // Устанавливаем флаг только что выбранного адреса
    setAddressJustSelected(true);
    // Сбрасываем флаг через небольшое время
    setTimeout(() => {
      setAddressJustSelected(false);
    }, 1000);
  }, [setValue, city, clearErrors, regionCityMapping]);
  
  // Обработчик выбора позиции на карте
  const handleMapPositionChange = useCallback((pos: [number, number]) => {
    console.log(`Выбрана позиция: ${pos[0]}, ${pos[1]}`);
    setValue('location.coordinates.lat', pos[0], { shouldValidate: true });
    setValue('location.coordinates.lng', pos[1], { shouldValidate: true });
    setMarkerPosition(pos);
    
    // При выборе позиции на карте уже будет установлен правильный зум
    setShouldUseDetailedZoom(false);
  }, [setValue]);
  
  // Обновляем маркер при изменении координат в полях ввода
  useEffect(() => {
    if (lat && lng) {
      const numLat = Number(lat);
      const numLng = Number(lng);
      
      if (!isNaN(numLat) && !isNaN(numLng)) {
        console.log(`Обновление координат из полей ввода: ${numLat}, ${numLng}`);
        setMarkerPosition([numLat, numLng]);
      }
    }
  }, [lat, lng]);
  
  // Обработчик ручного ввода координат
  const handleManualCoordinatesInput = (axis: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      setValue(`location.coordinates.${axis}`, numValue, { shouldValidate: true });
      
      // Если оба значения заполнены, обновляем маркер
      const otherAxis = axis === 'lat' ? 'lng' : 'lat';
      const otherValueRaw = watch(`location.coordinates.${otherAxis}`);
      
      // Проверяем и обрабатываем другую координату
      if (otherValueRaw !== undefined && otherValueRaw !== null) {
        let otherValueNum: number;
        
        // Преобразуем в число, в зависимости от типа
        if (typeof otherValueRaw === 'number') {
          otherValueNum = otherValueRaw;
        } else {
          otherValueNum = parseFloat(String(otherValueRaw));
        }
        
        // Обновляем маркер, если обе координаты валидны
        if (!isNaN(otherValueNum)) {
          const newCoords: [number, number] = axis === 'lat' 
            ? [numValue, otherValueNum] 
            : [otherValueNum, numValue];
          
          setMarkerPosition(newCoords);
        }
      }
    }
  };
  
  // Получаем начальную позицию для карты в зависимости от выбранного региона
  const getInitialMapPosition = (): [number, number] => {
    if (region) {
      switch (region) {
        case 'costa-blanca':
          return [38.3452, -0.4815]; // Аликанте
        case 'costa-del-sol':
          return [36.7213, -4.4213]; // Малага
        case 'mallorca':
          return [39.5696, 2.6502]; // Пальма
        case 'tenerife':
          return [28.4636, -16.2518]; // Санта-Крус
        case 'ibiza':
          return [38.9067, 1.4206]; // Ибица
        default:
          return [40.4168, -3.7038]; // Мадрид, центр Испании
      }
    }
    return [40.4168, -3.7038]; // Мадрид по умолчанию
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Расположение объекта</h2>
        <p className="text-gray-600 mb-2">
          Укажите где находится объект недвижимости
        </p>
        <div className="flex items-start mb-4">
          <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            Начните вводить адрес и выберите подходящий вариант из выпадающего списка или кликните на карте, 
            чтобы указать местоположение. Координаты и адрес будут заполнены автоматически.
          </p>
        </div>
      </div>
      
      {/* Форма поиска адреса с автозаполнением */}
      <div className="space-y-4">
        <div className="mb-4">
          <div className="flex flex-col space-y-1">
            <label className="block text-sm font-medium mb-1">
              Адрес объекта
            </label>
            
            {/* Компонент автозаполнения адресов */}
            <div className="mb-2">
              <div className="bg-white p-4 rounded-lg shadow">
                <Script src="/clearCache.js" />
                <AddressAutocomplete
                  onSelectAddress={(address, lat, lon) => {
                    // Обновляем данные формы
                    setValue('location.address', address, { shouldValidate: true });
                    setValue('location.coordinates.lat', lat, { shouldValidate: true });
                    setValue('location.coordinates.lng', lon, { shouldValidate: true });
                    
                    // Обновляем позицию маркера
                    setMarkerPosition([lat, lon]);
                    
                    // Устанавливаем статус валидации вручную
                    clearErrors('location.address');
                    clearErrors('location.coordinates.lat');
                    clearErrors('location.coordinates.lng');
                    
                    // Устанавливаем флаг для детального зума карты
                    setAddressWasSelected(true);
                    setShouldUseDetailedZoom(true);
                    
                    // Устанавливаем флаг только что выбранного адреса
                    setAddressJustSelected(true);
                    // Сбрасываем флаг через небольшое время
                    setTimeout(() => {
                      setAddressJustSelected(false);
                    }, 1000);
                    
                    // Информация для отладки
                    console.log('LocationStep: Выбран адрес', { address, lat, lon });
                  }}
                  placeholder="Введите адрес объекта недвижимости (например, Торревьеха, Аликанте)"
                />
                
                <div className="mt-4 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined' && 'clearBrowserCache' in window) {
                        // @ts-ignore
                        window.clearBrowserCache();
                      } else {
                        alert('Функция очистки кэша недоступна');
                      }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Очистить кэш браузера
                  </button>
                </div>
              </div>
            </div>
            
            {locationErrors.address && (
              <p className="text-red-500 text-sm mt-1">{locationErrors.address.message?.toString()}</p>
            )}
          </div>
        </div>
        
        {/* Карта для выбора местоположения */}
        <div className="rounded-md overflow-hidden border border-gray-300" ref={mapRef}>
          {markerPosition ? (
            <LeafletMap 
              position={markerPosition} 
              setPosition={handleMapPositionChange}
              initialZoom={addressJustSelected ? 18 : (shouldUseDetailedZoom ? 18 : 15)}
              onAddressFound={handleAddressFound}
            />
          ) : (
            <LeafletMap 
              position={getInitialMapPosition()} 
              setPosition={handleMapPositionChange}
              initialZoom={10}
              onAddressFound={handleAddressFound}
            />
          )}
        </div>
        
        {/* Скрытые поля выбора региона и города, которые заполняются автоматически */}
        <div className="hidden">
          <select {...register('location.region')}>
            <option value="">Выберите регион</option>
            <option value="costa-blanca">Коста Бланка</option>
            <option value="costa-del-sol">Коста дель Соль</option>
            <option value="mallorca">Майорка</option>
            <option value="tenerife">Тенерифе</option>
            <option value="ibiza">Ибица</option>
          </select>
          
          <select {...register('location.city')}>
            <option value="">Выберите город</option>
            {availableCities.map((cityCode) => (
              <option key={cityCode} value={cityCode}>
                {cityDisplayNames[cityCode] || cityCode}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            {...register('location.address')}
          />
        </div>
        
        {/* Отображение выбранных региона и города */}
        {(region || city || address) && (
          <div className="bg-blue-50 p-3 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Определенное местоположение:</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {region && (
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-1">Регион:</span>
                  <span>{regionDisplayNames[region] || region}</span>
                </div>
              )}
              {city && (
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-1">Город:</span>
                  <span>{cityDisplayNames[city] || city}</span>
                </div>
              )}
              {address && (
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-1">Адрес:</span>
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Координаты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Широта (Latitude)
            </label>
            <input
              type="text"
              {...register('location.coordinates.lat')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Например: 38.3452"
              onChange={(e) => handleManualCoordinatesInput('lat', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Долгота (Longitude)
            </label>
            <input
              type="text"
              {...register('location.coordinates.lng')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Например: -0.4815"
              onChange={(e) => handleManualCoordinatesInput('lng', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationStep;
