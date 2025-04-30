import React, { useEffect, useRef, useState } from 'react';
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

interface AddressDetails {
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

// Делаем обратное геокодирование для получения адреса по координатам
const reverseGeocode = async (lat: number, lng: number): Promise<AddressDetails | null> => {
  try {
    // Используем Nominatim для обратного геокодирования
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ru`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpainEstates/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка обратного геокодирования: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Данные обратного геокодирования:', data);
    
    if (data) {
      return extractAddressDetails(data);
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка при обратном геокодировании:', error);
    return null;
  }
};

// Компонент для принудительной установки зума
const ForcedZoomController = ({ 
  zoomLevel, 
  position, 
  active = false 
}: { 
  zoomLevel: number,
  position: [number, number],
  active: boolean
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (active) {
      console.log(`ПРИНУДИТЕЛЬНЫЙ ЗУМ: Устанавливаем зум ${zoomLevel} для позиции ${position}`);
      setTimeout(() => {
        map.setView(position, zoomLevel, { animate: true });
      }, 300); // Небольшая задержка для гарантированной перерисовки
    }
  }, [active, map, position, zoomLevel]);
  
  return null;
};

// Компонент для управления картой и зумом
const MapController = ({ 
  position, 
  setPosition, 
  onAddressFound,
  detailedZoom = 18 // Зум-уровень для детального просмотра адреса
}: { 
  position: [number, number], 
  setPosition: (pos: [number, number]) => void,
  onAddressFound?: (addressDetails: AddressDetails) => void,
  detailedZoom?: number
}) => {
  const map = useMap();
  const [addressSelected, setAddressSelected] = useState(false);
  
  // Обновляем центр карты при изменении позиции с оптимальным зумом
  useEffect(() => {
    if (addressSelected) {
      // Если адрес был выбран, используем детальный зум
      console.log(`Адрес выбран, меняем зум на ${detailedZoom}`);
      map.setView(position, detailedZoom, { animate: true });
    } else {
      // Иначе просто обновляем позицию с текущим зумом
      map.setView(position, map.getZoom());
    }
  }, [map, position, addressSelected, detailedZoom]);
  
  // Добавляем обработчик клика по карте
  useEffect(() => {
    const handleMapClick = async (e: L.LeafletMouseEvent) => {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      
      // Выполняем обратное геокодирование для получения адреса
      if (onAddressFound) {
        try {
          const addressDetails = await reverseGeocode(e.latlng.lat, e.latlng.lng);
          if (addressDetails) {
            onAddressFound(addressDetails);
            // Устанавливаем флаг, что адрес был выбран
            setAddressSelected(true);
            // Увеличиваем масштаб для лучшего просмотра локации
            console.log(`Клик на карте, устанавливаем зум ${detailedZoom}`);
            map.setView(newPosition, detailedZoom, { animate: true });
          }
        } catch (error) {
          console.error('Ошибка при обновлении адреса:', error);
        }
      }
    };
    
    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, setPosition, onAddressFound, detailedZoom]);
  
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  position, 
  setPosition, 
  initialZoom = 13,
  onAddressFound,
  fullscreen = false
}) => {
  // Референс на карту для управления зумом извне
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Флаг, указывающий, что позиция была намеренно выбрана пользователем
  const [addressWasSelected, setAddressWasSelected] = useState(false);
  
  // Флаг для принудительного зума
  const [forceZoom, setForceZoom] = useState(false);

  // Фикс для иконок маркеров в Leaflet
  useEffect(() => {
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
  }, []);
  
  // Обработчик события перетаскивания маркера
  const handleMarkerDragEnd = async (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();
    const newPosition: [number, number] = [position.lat, position.lng];
    console.log(`Маркер перетащен на позицию: ${newPosition[0]}, ${newPosition[1]}`);
    setPosition(newPosition);
    
    // Устанавливаем флаг, что адрес был выбран пользователем
    setAddressWasSelected(true);
    
    // Активируем принудительный зум
    setForceZoom(true);
    
    // Устанавливаем детальный зум после перетаскивания для лучшей видимости
    if (mapRef.current) {
      mapRef.current.setView(newPosition, 18, { animate: true });
    }
    
    // Выполняем обратное геокодирование при перетаскивании маркера
    if (onAddressFound) {
      try {
        console.log('Перетаскивание маркера: выполняем обратное геокодирование');
        const addressDetails = await reverseGeocode(position.lat, position.lng);
        if (addressDetails) {
          console.log('Получены данные геокодирования после перетаскивания:', addressDetails);
          // Принудительно вызываем обработчик onAddressFound для обновления значений формы
          onAddressFound(addressDetails);
        }
      } catch (error) {
        console.error('Ошибка при обновлении адреса после перетаскивания:', error);
      }
    }
  };

  // Сохраняем референс на карту при её создании
  const handleMapCreated = (map: L.Map) => {
    mapRef.current = map;
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
  
  // При монтировании, если initialZoom высокий, значит нужен детальный вид
  useEffect(() => {
    if (initialZoom >= 17) {
      console.log(`Высокий начальный зум ${initialZoom}, активируем режим выбранного адреса`);
      setAddressWasSelected(true);
      setForceZoom(true);
    }
  }, [initialZoom]);
  
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
        <Marker 
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: handleMarkerDragEnd
          }}
        />
        <MapController 
          position={position} 
          setPosition={setPosition} 
          onAddressFound={onAddressFound}
          detailedZoom={18} // Детальный уровень зума для просмотра улицы
        />
        <MapReference />
        <ForcedZoomController 
          zoomLevel={18} 
          position={position}
          active={forceZoom || addressWasSelected} 
        />
      </MapContainer>
      <div className="bg-gray-100 text-xs text-gray-500 p-1 border-t border-gray-300">
        <span className="block text-center">Кликните на карте или перетащите маркер, чтобы указать точное местоположение</span>
      </div>
    </div>
  );
};

export type { AddressDetails };
export default LeafletMap; 