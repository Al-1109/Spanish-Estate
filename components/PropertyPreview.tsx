import React from 'react';
import Image from 'next/image';
import { FiHome, FiMap, FiDollarSign, FiMaximize } from 'react-icons/fi';
import { IoBed, IoWater } from 'react-icons/io5';
import { Property } from '@/types/property';
import dynamic from 'next/dynamic';

// Добавляем стили для правильного отображения маркера Leaflet (если их нет в глобальных стилях)
const MapStyles = () => (
  <style jsx global>{`
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
  `}</style>
);

// Динамический импорт компонента карты для предотвращения ошибок SSR
const DynamicMapComponent = dynamic(() => import('@/app/admin/properties/create/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Загрузка карты...</p>
    </div>
  )
});

interface PropertyPreviewProps {
  property: Partial<Property>;
  mode?: 'compact' | 'full'; // compact - для карточки, full - для полного предпросмотра
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({ property, mode = 'compact' }) => {
  // Добавим глобальные стили вне зависимости от режима
  React.useEffect(() => {
    // Принудительно добавляем стили для маркеров при монтировании компонента
    if (typeof window !== 'undefined') {
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
      
      return () => {
        // Удаляем стили при размонтировании
        document.head.removeChild(style);
      };
    }
  }, []);

  // Значения по умолчанию для случаев, когда данные не заполнены
  const title = property.title?.ru || 'Без названия';
  const description = property.description?.ru || 'Без описания';
  const price = property.price?.value ? `${property.price.value.toLocaleString()} €` : 'Цена не указана';
  const type = property.type || 'apartment';
  
  // Построение строки адреса
  let addressString = '';
  
  if (property.location) {
    if (property.location.address) {
      addressString = property.location.address;
    } else {
      const cityPart = property.location.city ? getCityDisplayName(property.location.city) : '';
      const regionPart = property.location.region ? getRegionDisplayName(property.location.region) : '';
      
      if (cityPart && regionPart) {
        addressString = `${cityPart}, ${regionPart}`;
      } else if (cityPart) {
        addressString = cityPart;
      } else if (regionPart) {
        addressString = regionPart;
      } else {
        addressString = 'Адрес не указан';
      }
    }
  } else {
    addressString = 'Адрес не указан';
  }
  
  // Функции для получения человекочитаемых названий городов и регионов
  function getCityDisplayName(cityCode: string): string {
    const cityNames: Record<string, string> = {
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
      'benalmadena': 'Беналмадена'
    };
    
    return cityNames[cityCode] || cityCode;
  }
  
  function getRegionDisplayName(regionCode: string): string {
    const regionNames: Record<string, string> = {
      'costa-blanca': 'Коста Бланка',
      'costa-del-sol': 'Коста дель Соль',
      'mallorca': 'Майорка',
      'tenerife': 'Тенерифе',
      'ibiza': 'Ибица'
    };
    
    return regionNames[regionCode] || regionCode;
  }
  
  // Получаем тип жилья в читаемом виде
  const getPropertyTypeName = (type: string): string => {
    const typeMap: Record<string, string> = {
      'apartment': 'Квартира',
      'house': 'Дом',
      'villa': 'Вилла',
      'commercial': 'Коммерческая недвижимость',
      'land': 'Земельный участок'
    };
    
    return typeMap[type] || 'Недвижимость';
  };
  
  // Компактный вид (для карточки)
  if (mode === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48 w-full">
          {property.images && property.images.length > 0 ? (
            <img 
              src={property.images[0].url} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FiHome size={48} className="text-gray-400" />
              <p className="text-gray-500 ml-2">Нет фото</p>
            </div>
          )}
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1">
            {getPropertyTypeName(type)}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FiMap className="mr-1" />
            <span className="text-sm line-clamp-1">{addressString}</span>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4">
              {property.features && (
                <>
                  {property.features.bedrooms > 0 && (
                    <div className="flex items-center text-gray-700">
                      <IoBed className="mr-1" />
                      <span>{property.features.bedrooms}</span>
                    </div>
                  )}
                  
                  {property.features.bathrooms > 0 && (
                    <div className="flex items-center text-gray-700">
                      <IoWater className="mr-1" />
                      <span>{property.features.bathrooms}</span>
                    </div>
                  )}
                  
                  {property.features.totalArea > 0 && (
                    <div className="flex items-center text-gray-700">
                      <FiMaximize className="mr-1" />
                      <span>{property.features.totalArea} м²</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="text-lg font-bold text-blue-600">
              {price}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Полный вид (детальная карточка)
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <MapStyles />
      <div className="relative h-96 w-full">
        {property.images && property.images.length > 0 ? (
          <img 
            src={property.images[0].url} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <FiHome size={64} className="text-gray-400" />
            <p className="text-gray-500 ml-3 text-xl">Нет фото</p>
          </div>
        )}
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-4 py-2 text-lg">
          {getPropertyTypeName(type)}
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-3">{title}</h1>
        
        <div className="flex items-center text-gray-700 mb-4 text-lg">
          <FiMap className="mr-2" />
          <span>{addressString}</span>
        </div>
        
        {/* Добавляем блок с картой если есть координаты */}
        {property.location?.coordinates && 
         property.location.coordinates.lat && 
         property.location.coordinates.lng && (
          <div className="mb-6 mt-4 relative">
            <h2 className="text-lg font-semibold mb-3">Расположение</h2>
            <div className="h-[400px] w-full rounded-md overflow-hidden border border-gray-200 relative z-10">
              <div id="map-preview-container" className="w-full h-full relative">
                <DynamicMapComponent
                  position={[property.location.coordinates.lat, property.location.coordinates.lng]}
                  setPosition={() => {}}
                  addressWasSelected={true}
                  addressJustSelected={false}
                  shouldUseDetailedZoom={true}
                  initialZoom={17}
                  onAddressFound={() => {}}
                  fullscreen={false}
                />
              </div>
              
              {/* Скрипт для гарантированного отображения маркера */}
              <script dangerouslySetInnerHTML={{ __html: `
                setTimeout(() => {
                  const markers = document.querySelectorAll('.leaflet-marker-icon, .leaflet-marker-shadow');
                  markers.forEach(marker => {
                    marker.style.display = 'block';
                    marker.style.visibility = 'visible';
                    marker.style.zIndex = '999';
                  });
                }, 500);
              `}} />
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 my-4">
          <div className="flex space-x-6">
            {property.features && (
              <>
                {property.features.bedrooms > 0 && (
                  <div className="flex flex-col items-center text-gray-700">
                    <IoBed size={24} className="mb-1" />
                    <span className="text-lg font-medium">{property.features.bedrooms}</span>
                    <span className="text-sm text-gray-500">Спальни</span>
                  </div>
                )}
                
                {property.features.bathrooms > 0 && (
                  <div className="flex flex-col items-center text-gray-700">
                    <IoWater size={24} className="mb-1" />
                    <span className="text-lg font-medium">{property.features.bathrooms}</span>
                    <span className="text-sm text-gray-500">Ванные</span>
                  </div>
                )}
                
                {property.features.totalArea > 0 && (
                  <div className="flex flex-col items-center text-gray-700">
                    <FiMaximize size={24} className="mb-1" />
                    <span className="text-lg font-medium">{property.features.totalArea} м²</span>
                    <span className="text-sm text-gray-500">Площадь</span>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="text-2xl font-bold text-blue-600">
            <FiDollarSign className="inline-block mr-1" />
            {price}
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Описание</h2>
          <p className="text-gray-700">{description}</p>
        </div>
        
        {/* Дополнительные характеристики */}
        {property.features && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Характеристики</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.features.hasPool && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Бассейн</span>
                </div>
              )}
              {property.features.hasGarage && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Гараж</span>
                </div>
              )}
              {property.features.hasTerrace && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Терраса</span>
                </div>
              )}
              {property.features.hasGarden && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Сад</span>
                </div>
              )}
              {property.features.hasSeaView && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Вид на море</span>
                </div>
              )}
              {property.features.distanceToSea !== undefined && property.features.distanceToSea > 0 && (
                <div className="flex items-center text-gray-700">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Расстояние до моря: {property.features.distanceToSea} м</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPreview; 