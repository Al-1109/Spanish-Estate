import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Важно: исправление для иконок Leaflet (должно быть в начале файла)
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  // Создаем собственную иконку маркера для гарантированного отображения
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  
  // Устанавливаем иконку по умолчанию
  L.Marker.prototype.options.icon = DefaultIcon;
  
  // Дополнительно явно задаём стили для иконок маркеров
  const style = document.createElement('style');
  style.textContent = `
    .leaflet-marker-icon {
      width: 25px !important;
      height: 41px !important;
      display: block !important;
      visibility: visible !important;
      z-index: 999 !important;
      pointer-events: auto !important;
    }
    .leaflet-marker-shadow {
      width: 41px !important;
      height: 41px !important;
      display: block !important;
      visibility: visible !important;
      z-index: 998 !important;
      pointer-events: none !important;
    }
    .leaflet-container {
      z-index: 1;
    }
    .leaflet-pane {
      z-index: 10 !important;
    }
    .leaflet-marker-pane {
      z-index: 600 !important;
    }
    .leaflet-shadow-pane {
      z-index: 500 !important;
    }
  `;
  document.head.appendChild(style);
}

// Стили для исправления отображения карты
const mapContainerStyle = {
  position: 'relative' as 'relative',
  width: '100%',
  height: '100%',
  zIndex: 5
};

// Стили для контейнера карты
const mapWrapperStyle = {
  position: 'relative' as 'relative',
  width: '100%',
  height: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column' as 'column'
};

// Базовый компонент карты
interface LeafletMapProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
  initialZoom?: number;
  onAddressFound?: (addressDetails: AddressDetails) => void;
  fullscreen?: boolean;
  // Новые пропсы для контроля зума и отображения
  addressWasSelected?: boolean;
  addressJustSelected?: boolean;
  shouldUseDetailedZoom?: boolean;
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

// Функция для принудительного отображения маркеров
const forceMarkersVisible = () => {
  if (typeof window === 'undefined') return;
  
  // Находим все маркеры на странице
  const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-marker-shadow');
  
  // Устанавливаем стили напрямую
  markers.forEach(marker => {
    const element = marker as HTMLElement;
    element.style.display = 'block';
    element.style.visibility = 'visible';
    
    // Для иконок маркера устанавливаем высокий z-index
    if (marker.classList.contains('leaflet-marker-icon')) {
      element.style.zIndex = '999';
      element.style.pointerEvents = 'auto';
    } else {
      // Для теней
      element.style.zIndex = '998';
      element.style.pointerEvents = 'none';
    }
  });
};

// Маркер Leaflet с принудительным отображением
const StableMarker = ({ position, draggable, eventHandlers, markerRef }: { 
  position: [number, number], 
  draggable: boolean, 
  eventHandlers: any,
  markerRef: React.MutableRefObject<L.Marker | null>
}) => {
  const map = useMap();
  
  // Создаем маркер при монтировании компонента
  useEffect(() => {
    // Создаем иконку специально для этого маркера
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Создаем маркер
    const marker = L.marker(position, {
      icon,
      draggable
    });
    
    // Добавляем маркер на карту
    marker.addTo(map);
    
    // Сохраняем ссылку на маркер
    markerRef.current = marker;
    
    // Добавляем обработчики событий
    if (eventHandlers.dragend) {
      marker.on('dragend', eventHandlers.dragend);
    }
    
    if (eventHandlers.add) {
      // Вызываем обработчик события добавления маркера
      eventHandlers.add();
    }
    
    // Принудительно обновляем стили маркера
    setTimeout(() => {
      const markerElement = marker.getElement();
      if (markerElement) {
        markerElement.style.display = 'block';
        markerElement.style.visibility = 'visible';
        markerElement.style.zIndex = '999';
      }
      
      const shadowElement = marker.getElement()?.nextSibling as HTMLElement;
      if (shadowElement) {
        shadowElement.style.display = 'block';
        shadowElement.style.visibility = 'visible';
        shadowElement.style.zIndex = '998';
      }
    }, 100);
    
    // Очищаем при размонтировании
    return () => {
      marker.off('dragend', eventHandlers.dragend);
      map.removeLayer(marker);
    };
  }, [map, position, draggable, eventHandlers, markerRef]);
  
  return null;
};

// Основной компонент карты
const LeafletMap: React.FC<LeafletMapProps> = ({ 
  position, 
  setPosition, 
  initialZoom = 13,
  onAddressFound,
  fullscreen = false,
  addressWasSelected = false,
  addressJustSelected = false,
  shouldUseDetailedZoom = false
}) => {
  // Выводим значение initialZoom для отладки
  console.log(`LeafletMap initialZoom: ${initialZoom}`);
  
  // Реф для маркера
  const markerRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  // Состояние компонента
  const [mapReady, setMapReady] = useState(false);
  const [forceZoom, setForceZoom] = useState(false);
  
  // В режиме принудительного зума используем специфический начальный зум
  const effectiveInitialZoom = initialZoom;
  
  // Вычисляем зум-уровень для детального просмотра
  const detailedZoom = shouldUseDetailedZoom ? 18 : initialZoom;
  
  // Гарантируем, что маркер будет доступен после монтирования компонента
  useEffect(() => {
    // Принудительно обновляем стили маркера
    if (typeof window !== 'undefined') {
      try {
        const style = document.createElement('style');
        style.textContent = `
          .leaflet-marker-icon {
            width: 25px !important;
            height: 41px !important;
            display: block !important;
            visibility: visible !important;
            z-index: 999 !important;
          }
          .leaflet-marker-shadow {
            width: 41px !important;
            height: 41px !important;
            display: block !important;
            visibility: visible !important;
            z-index: 998 !important;
          }
        `;
        document.head.appendChild(style);
      } catch (e) {
        console.error('Ошибка добавления стилей маркера:', e);
      }
    }

    // Обрабатываем случай, когда компонент используется в предпросмотре
    if (shouldUseDetailedZoom) {
      console.log('Карта в режиме предпросмотра, активируем детальный зум и принудительное отображение маркера');
      setForceZoom(true);
    }
  }, [shouldUseDetailedZoom]);
  
  // Установка начальных значений
  useEffect(() => {
    console.log(`Инициализация LeafletMap с position=${position}, zoom=${effectiveInitialZoom}`);
    
    // Если карта обновляется с высоким начальным зумом, активируем режим детализации
    if (initialZoom >= 17) {
      console.log(`Высокий начальный зум ${initialZoom}, активируем режим выбранного адреса и принудительный зум`);
      setForceZoom(true);
      
      // Для корректной работы принудительного зума с высоким начальным значением
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setView(position, initialZoom, { animate: true });
        }
      }, 100);
    }
  }, [initialZoom, position, mapRef.current]);
  
  // Создаем таймер для периодической проверки и принудительного отображения маркеров
  useEffect(() => {
    // Запускаем принудительное отображение маркеров сразу
    forceMarkersVisible();
    
    // Создаем интервал для периодической проверки маркеров
    const markerCheckInterval = setInterval(() => {
      forceMarkersVisible();
    }, 500); // Проверяем каждые 500 мс
    
    // Очищаем интервал при размонтировании компонента
    return () => {
      clearInterval(markerCheckInterval);
    };
  }, []);
  
  // Обработчик клика на карте
  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    console.log(`Клик на карте: ${e.latlng.lat}, ${e.latlng.lng}`);
    
    // Обновляем позицию
    const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
    setPosition(newPosition);
    
    // Активируем принудительный зум
    setForceZoom(true);
    
    // Выполняем обратное геокодирование, если нужно
    if (onAddressFound) {
      try {
        console.log('Выполняем обратное геокодирование для координат...');
        const addressDetails = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        
        if (addressDetails) {
          console.log('Получены данные адреса:', addressDetails);
          onAddressFound(addressDetails);
          
          // Устанавливаем специальный зум-уровень для лучшего отображения здания
          if (mapRef.current) {
            mapRef.current.setView(newPosition, detailedZoom, { animate: true });
          }
        } else {
          console.warn('Не удалось получить данные адреса');
        }
      } catch (error) {
        console.error('Ошибка при получении адреса:', error);
      }
    }
  };
  
  // Функция инициализации карты
  const handleMapCreated = (map: L.Map) => {
    console.log('Карта создана, сохраняем ссылку');
    mapRef.current = map;
    
    console.log('Карта инициализирована');
    setMapReady(true);
  };
  
  // Эффект для управления принудительным зумом при выборе адреса
  useEffect(() => {
    console.log(`Изменение флагов: addressWasSelected=${addressWasSelected}, shouldUseDetailedZoom=${shouldUseDetailedZoom}`);
    
    if (shouldUseDetailedZoom && addressWasSelected) {
      console.log('Активация принудительного зума для адреса');
      setForceZoom(true);
    }
  }, [position, addressWasSelected, shouldUseDetailedZoom]);
  
  // Эффект для сброса форсированного зума
  useEffect(() => {
    if (addressJustSelected && mapReady) {
      console.log('Адрес только что выбран, устанавливаем принудительный зум');
      setForceZoom(true);
      
      // Если карта готова, устанавливаем вид напрямую
      if (mapRef.current) {
        console.log(`Установка прямого зума на ${detailedZoom} для позиции ${position}`);
        mapRef.current.setView(position, 18, { animate: true });
        
        // Принудительно отображаем маркеры после установки вида
        setTimeout(forceMarkersVisible, 100);
        setTimeout(forceMarkersVisible, 500);
      }
    }
  }, [position, addressJustSelected, mapReady]);
  
  // Автоматический сброс принудительного зума после задержки
  useEffect(() => {
    if (forceZoom) {
      const timer = setTimeout(() => {
        console.log('Сброс принудительного зума после задержки');
        setForceZoom(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [forceZoom]);
  
  // Компонент для доступа к экземпляру карты
  const MapReference = () => {
    const map = useMap();
    
    useEffect(() => {
      console.log('Сохраняем ссылку на карту из MapReference');
      handleMapCreated(map);
    }, [map]);
    
    return (
      <>
        <ForcedZoomController 
          zoomLevel={detailedZoom} 
          position={position} 
          active={forceZoom}
          markerRef={markerRef}
        />
        
        <MapController 
          position={position} 
          setPosition={setPosition}
          markerRef={markerRef}
          onAddressFound={onAddressFound}
          detailedZoom={detailedZoom}
          forceZoom={forceZoom}
        />
      </>
    );
  }
  
  // Вычисляем стили для контейнера карты
  const mapStyle = fullscreen 
    ? { height: '100vh', width: '100%' }
    : { height: '400px', width: '100%' };
  
  return (
    <div className="relative w-full h-full" style={mapWrapperStyle}>
      <MapContainer
        center={position}
        zoom={initialZoom}
        style={mapContainerStyle}
        className="leaflet-container-fixed"
        whenCreated={(map) => {
          handleMapCreated(map);
          // Принудительно отображаем маркеры после создания карты
          setTimeout(forceMarkersVisible, 100);
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Используем собственную реализацию маркера для стабильности */}
        <StableMarker
          position={position}
          draggable={true}
          eventHandlers={{
            dragend: (e: any) => {
              const marker = e.target;
              const position = marker.getLatLng();
              const newPosition: [number, number] = [position.lat, position.lng];
              console.log(`Маркер перемещен: ${newPosition}`);
              setPosition(newPosition);
              
              // Принудительно отображаем маркеры после перемещения
              setTimeout(forceMarkersVisible, 100);
            },
            add: () => {
              // Принудительно отображаем маркеры при добавлении на карту
              setTimeout(forceMarkersVisible, 100);
            }
          }}
          markerRef={markerRef}
        />
        
        <MapReference />
      </MapContainer>
      
      <style jsx global>{`
        .leaflet-container-fixed {
          position: relative !important;
          width: 100%;
          height: 100%;
          z-index: 5;
          min-height: 400px;
        }
        .leaflet-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          z-index: 1;
        }
        .leaflet-pane {
          z-index: 10 !important;
        }
        .leaflet-tile, 
        .leaflet-marker-icon, 
        .leaflet-marker-shadow, 
        .leaflet-tile-container, 
        .leaflet-pane > svg, 
        .leaflet-pane > canvas, 
        .leaflet-control {
          position: absolute;
          pointer-events: auto;
        }
        .leaflet-marker-icon {
          pointer-events: auto !important;
          width: 25px !important;
          height: 41px !important;
          display: block !important;
          visibility: visible !important;
          z-index: 999 !important;
        }
        .leaflet-marker-shadow {
          width: 41px !important;
          height: 41px !important;
          display: block !important;
          visibility: visible !important;
          z-index: 998 !important;
        }
        .leaflet-tile-container {
          display: block !important;
          visibility: visible !important;
        }
      `}</style>
      
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          // Принудительное обновление размера карты после загрузки
          function updateMaps() {
            var maps = document.querySelectorAll('.leaflet-container');
            for (var i = 0; i < maps.length; i++) {
              var map = maps[i];
              try {
                var event = new Event('resize');
                window.dispatchEvent(event);
                
                // Принудительный перерендер карты
                if (map && map._leaflet_id) {
                  var leafletInstance = map._leaflet;
                  if (leafletInstance && leafletInstance.invalidateSize) {
                    leafletInstance.invalidateSize(true);
                  }
                }
                
                // Принудительно отображаем маркеры
                var markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-marker-shadow');
                markers.forEach(function(marker) {
                  marker.style.display = 'block';
                  marker.style.visibility = 'visible';
                  if (marker.classList.contains('leaflet-marker-icon')) {
                    marker.style.zIndex = '999';
                    marker.style.pointerEvents = 'auto';
                  } else {
                    marker.style.zIndex = '998';
                    marker.style.pointerEvents = 'none';
                  }
                });
              } catch (e) {
                console.error('Ошибка при обновлении карты:', e);
              }
            }
          }
          
          // Вызываем функцию несколько раз с разными интервалами
          setTimeout(updateMaps, 100);
          setTimeout(updateMaps, 500);
          setTimeout(updateMaps, 1000);
          setTimeout(updateMaps, 2000);
          
          // Создаем интервал для периодической проверки
          var interval = setInterval(updateMaps, 3000);
          
          // Очищаем интервал через 30 секунд
          setTimeout(function() {
            clearInterval(interval);
          }, 30000);
        })();
      `}} />
      
      <div className="bg-gray-100 text-xs text-gray-500 p-1 border-t border-gray-300">
        <span className="block text-center">Кликните на карте или перетащите маркер, чтобы указать точное местоположение</span>
      </div>
    </div>
  );
};

export default LeafletMap; 