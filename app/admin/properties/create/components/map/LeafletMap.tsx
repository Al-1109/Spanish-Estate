import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Базовый компонент карты
interface LeafletMapProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  initialZoom?: number;
  onAddressFound?: (addressDetails: AddressDetails) => void;
  fullscreen?: boolean;
}

// Структура данных адреса
export interface AddressDetails {
  fullAddress: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  lat: number;
  lng: number;
}

// Извлекаем адресные данные из результатов геокодирования
const extractAddressDetails = (geocodeResult: any): AddressDetails => {
  let details: AddressDetails = {
    fullAddress: geocodeResult.name || geocodeResult.display_name || '',
    lat: geocodeResult.center ? geocodeResult.center.lat : parseFloat(geocodeResult.lat || '0'),
    lng: geocodeResult.center ? geocodeResult.center.lng : parseFloat(geocodeResult.lon || '0')
  };
  
  // Извлекаем дополнительные данные, если они есть
  if (geocodeResult.properties) {
    details.streetAddress = [geocodeResult.properties.address?.road, geocodeResult.properties.address?.house_number]
      .filter(Boolean)
      .join(' ');
    details.city = geocodeResult.properties.address?.city || 
                  geocodeResult.properties.address?.town || 
                  geocodeResult.properties.address?.village;
    details.region = geocodeResult.properties.address?.state || 
                    geocodeResult.properties.address?.region;
    details.country = geocodeResult.properties.address?.country;
    details.postalCode = geocodeResult.properties.address?.postcode;
  } else if (geocodeResult.address) {
    details.streetAddress = [geocodeResult.address.road, geocodeResult.address.house_number]
      .filter(Boolean)
      .join(' ');
    details.city = geocodeResult.address.city || 
                  geocodeResult.address.town || 
                  geocodeResult.address.village;
    details.region = geocodeResult.address.state || 
                    geocodeResult.address.region;
    details.country = geocodeResult.address.country;
    details.postalCode = geocodeResult.address.postcode;
  }
  
  return details;
};

// Обратное геокодирование (получение адреса по координатам)
const reverseGeocode = async (lat: number, lng: number): Promise<AddressDetails | null> => {
  try {
    console.log(`Обратное геокодирование для координат: ${lat}, ${lng}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`
    );
    
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Результаты обратного геокодирования:', data);
    
    if (data) {
      return extractAddressDetails(data);
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при обратном геокодировании:', error);
    return null;
  }
};

// Компонент принудительного зума
const ForcedZoomController = ({ 
  zoomLevel, 
  position, 
  active = false,
  markerRef
}: { 
  zoomLevel: number,
  position: [number, number],
  active: boolean,
  markerRef: React.RefObject<L.Marker>
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (active) {
      console.log(`ПРИНУДИТЕЛЬНЫЙ ЗУМ: Устанавливаем зум ${zoomLevel} для позиции ${position}`);
      
      // Установка зума с небольшой задержкой
      setTimeout(() => {
        map.setView(position, zoomLevel, { animate: true });
        // Обновляем позицию маркера
        if (markerRef.current) {
          markerRef.current.setLatLng(position);
        }
      }, 300); // Небольшая задержка для гарантированной перерисовки
      
      // Повторная попытка через 500мс
      setTimeout(() => {
        console.log(`ПРИНУДИТЕЛЬНЫЙ ЗУМ: Повторная попытка зума ${zoomLevel}`);
        map.setView(position, zoomLevel, { animate: true });
        if (markerRef.current) {
          markerRef.current.setLatLng(position);
        }
      }, 800);
      
      // Финальная попытка через 1.5 секунды
      setTimeout(() => {
        console.log(`ПРИНУДИТЕЛЬНЫЙ ЗУМ: Финальная попытка зума ${zoomLevel}`);
        map.setView(position, zoomLevel, { animate: true });
        if (markerRef.current) {
          markerRef.current.setLatLng(position);
        }
      }, 1500);
    }
  }, [active, map, position, zoomLevel, markerRef]);
  
  return null;
};

// Компонент для управления картой и синхронизации маркера
const MapController = ({ 
  position, 
  setPosition, 
  onAddressFound,
  markerRef,
  detailedZoom = 18, // Зум-уровень для детального просмотра адреса
  forceZoom = false  // Флаг принудительного зума
}: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  onAddressFound?: (addressDetails: AddressDetails) => void,
  markerRef: React.RefObject<L.Marker>,
  detailedZoom?: number,
  forceZoom?: boolean
}) => {
  const map = useMap();
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [addressSelected, setAddressSelected] = useState(false);
  
  // Сохраняем ссылку на карту
  useEffect(() => {
    mapInstanceRef.current = map;
    
    // Фикс для иконок Leaflet
    try {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/images/marker-icon-2x.png',
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
      });
    } catch (error) {
      console.error('Ошибка при исправлении иконок Leaflet:', error);
    }
  }, [map]);
  
  // Обновляем центр карты при изменении позиции с оптимальным зумом
  useEffect(() => {
    if (forceZoom) {
      // При принудительном зуме устанавливаем детальный вид
      console.log(`Принудительный зум активирован: ${detailedZoom}`);
      map.setView(position, detailedZoom, { animate: true });
    } else if (addressSelected) {
      // Если адрес был выбран, используем детальный зум
      console.log(`Адрес выбран, меняем зум на ${detailedZoom}`);
      map.setView(position, detailedZoom, { animate: true });
    } else {
      // Иначе просто обновляем позицию с текущим зумом
      map.setView(position, map.getZoom());
    }
    
    // Синхронизируем маркер
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    }
  }, [map, position, addressSelected, detailedZoom, forceZoom, markerRef]);
  
  // Обработчик события изменения масштаба
  useEffect(() => {
    const handleZoomEnd = () => {
      console.log('Обработка события zoomend, синхронизация маркера');
      // Принудительно обновляем позицию маркера после изменения масштаба
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      }
    };
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.on('zoomend', handleZoomEnd);
    }
    
    // Отписываемся от событий при размонтировании
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('zoomend', handleZoomEnd);
      }
    };
  }, [mapInstanceRef.current, position, markerRef]);
  
  // Обработчик клика по карте
  useEffect(() => {
    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      console.log(`Клик на карте: ${newPosition[0]}, ${newPosition[1]}`);
      setPosition(newPosition);
      
      // Устанавливаем флаг, что адрес был выбран
      setAddressSelected(true);
      
      // Масштабируем карту до детального просмотра
      map.setView(newPosition, detailedZoom, { animate: true });
      
      // Синхронизируем маркер
      if (markerRef.current) {
        markerRef.current.setLatLng(newPosition);
      }
      
      // Выполняем обратное геокодирование
      if (onAddressFound) {
        try {
          const addressDetails = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          if (addressDetails) {
            console.log('Получен адрес по клику:', addressDetails);
            onAddressFound(addressDetails);
          }
        } catch (error) {
          console.error('Ошибка геокодирования:', error);
        }
      }
    };
    
    if (mapInstanceRef.current) {
      mapInstanceRef.current.on('click', handleMapClick);
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', handleMapClick);
      }
    };
  }, [mapInstanceRef.current, setPosition, onAddressFound, map, markerRef, detailedZoom]);
  
  return null;
};

// Основной компонент карты
const LeafletMap: React.FC<LeafletMapProps> = ({ 
  position, 
  setPosition, 
  initialZoom = 13,
  onAddressFound,
  fullscreen = false
}) => {
  // Выводим значение initialZoom для отладки
  console.log(`LeafletMap: initialZoom = ${initialZoom}, установка addressWasSelected = ${initialZoom >= 17}`);
  
  // Refs для доступа к элементам Leaflet
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  // Состояние компонента
  const [mapReady, setMapReady] = useState(false);
  const [addressWasSelected, setAddressWasSelected] = useState(initialZoom >= 17);
  const [forceZoom, setForceZoom] = useState(false);
  
  // При монтировании, если initialZoom высокий, значит нужен детальный вид
  useEffect(() => {
    if (initialZoom >= 17) {
      console.log(`Высокий начальный зум ${initialZoom}, активируем режим выбранного адреса и принудительный зум`);
      setAddressWasSelected(true);
      setForceZoom(true);
      
      // Удостоверимся, что карта проинициализирована и зум установлен
      if (mapRef.current) {
        console.log(`Принудительная установка зума ${initialZoom} при инициализации`);
        mapRef.current.setView(position, initialZoom, { animate: true });
        
        // Дополнительная попытка через таймаут для гарантии
        setTimeout(() => {
          if (mapRef.current) {
            console.log(`Повторная попытка установки зума ${initialZoom} через таймаут`);
            mapRef.current.setView(position, initialZoom, { animate: true });
          }
        }, 300);
      }
    }
  }, [initialZoom, position, mapRef.current]);
  
  // Обработчик перетаскивания маркера
  const handleMarkerDragEnd = useCallback((e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    const newPosition: [number, number] = [position.lat, position.lng];
    console.log(`Маркер перетащен на позицию: ${newPosition[0]}, ${newPosition[1]}`);
    
    // Обновляем позицию в состоянии React
    setPosition(newPosition);
    
    // Устанавливаем флаг, что адрес был выбран
    setAddressWasSelected(true);
    
    // Активируем принудительный зум
    setForceZoom(true);
    
    // Выполняем обратное геокодирование при перетаскивании маркера
    if (onAddressFound) {
      reverseGeocode(position.lat, position.lng).then(addressDetails => {
        if (addressDetails) {
          console.log('Получены данные геокодирования после перетаскивания:', addressDetails);
          onAddressFound(addressDetails);
        }
      }).catch(error => {
        console.error('Ошибка при обновлении адреса после перетаскивания:', error);
      });
    }
  }, [setPosition, onAddressFound]);
  
  // Получение ссылки на карту
  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
    console.log('Карта инициализирована');
    setMapReady(true);
    
    // Если уже выбран адрес, сразу активируем принудительный зум
    if (addressWasSelected) {
      console.log('Карта создана, активируем принудительный зум из-за выбранного адреса');
      setForceZoom(true);
    }
  };
  
  // Обновляем зум карты когда все компоненты готовы
  useEffect(() => {
    if (mapRef.current && mapReady && addressWasSelected) {
      console.log('Все компоненты готовы и адрес выбран, принудительно устанавливаем зум 18');
      mapRef.current.setView(position, 18, { animate: true });
      
      // Делаем двойную проверку через таймаут для гарантии
      setTimeout(() => {
        if (mapRef.current) {
          console.log('Повторная попытка установки зума через таймаут');
          mapRef.current.setView(position, 18, { animate: true });
        }
      }, 500);
    }
  }, [position, mapReady, addressWasSelected]);
  
  // При изменении позиции активируем принудительный зум, если адрес был выбран
  useEffect(() => {
    if (addressWasSelected && mapReady) {
      console.log('Позиция изменилась, активируем принудительный зум');
      setForceZoom(true);
    }
  }, [position, addressWasSelected, mapReady]);
  
  // Компонент для получения ссылки на карту
  const MapReference = () => {
    const map = useMap();
    
    useEffect(() => {
      handleMapCreated(map);
    }, [map]);
    
    return null;
  };
  
  return (
    <div style={{ height: fullscreen ? '100vh' : '400px', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={position} 
        zoom={initialZoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Маркер с ref для прямого доступа к DOM-элементу */}
        <Marker 
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd
          }}
          ref={markerRef}
        />
        
        {/* Контроллер для синхронизации карты и маркера */}
        <MapController 
          position={position} 
          setPosition={setPosition} 
          onAddressFound={onAddressFound}
          markerRef={markerRef}
          forceZoom={forceZoom}
        />
        
        {/* Принудительный зум при необходимости */}
        <ForcedZoomController 
          zoomLevel={18} 
          position={position}
          active={forceZoom} 
          markerRef={markerRef}
        />
        
        <MapReference />
      </MapContainer>
      <div className="bg-gray-100 text-xs text-gray-500 p-1 border-t border-gray-300">
        <span className="block text-center">Кликните на карте или перетащите маркер, чтобы указать точное местоположение</span>
      </div>
    </div>
  );
};

export default LeafletMap; 