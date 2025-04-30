import React from 'react';
import Image from 'next/image';
import { Property, PropertyStatus } from '@/types/property';
import PropertyFeatures from './PropertyFeatures';
import MapContainer from './MapContainer';

interface PropertyDetailViewProps {
  property: Property;
}

type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';

const propertyTypeNames: Record<PropertyType, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  villa: 'Вилла',
  commercial: 'Коммерческая недвижимость',
  land: 'Земельный участок',
};

const statusClasses: Record<PropertyStatus, string> = {
  [PropertyStatus.PUBLISHED]: 'bg-green-100 text-green-800',
  [PropertyStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [PropertyStatus.SOLD]: 'bg-red-100 text-red-800',
  [PropertyStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
};

const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({ property }) => {
  // Находим главное изображение
  const mainImage = property.images?.find(img => img.isMain) || property.images?.[0] || '/placeholder-property.jpg';
  
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(property.price.value);

  // Получаем URL и alt текст изображения
  const imageUrl = typeof mainImage === 'string' ? mainImage : mainImage.url;
  const imageAlt = typeof mainImage === 'string' ? property.title.ru : (mainImage.alt || property.title.ru);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Изображение */}
      <div className="relative h-80 w-full">
        <Image 
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
        />
        
        {/* Статус */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[property.status]}`}>
            {property.status === PropertyStatus.PUBLISHED && 'Активный'}
            {property.status === PropertyStatus.DRAFT && 'Черновик'}
            {property.status === PropertyStatus.SOLD && 'Продан'}
            {property.status === PropertyStatus.ARCHIVED && 'Архивный'}
          </span>
        </div>
      </div>
      
      {/* Информация */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{property.title.ru}</h2>
            <p className="text-gray-600 mb-2">{property.location.address}</p>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {propertyTypeNames[property.type]}
              </span>
              <span className="text-2xl font-bold text-blue-600 ml-4">{formattedPrice}</span>
            </div>
          </div>
        </div>
        
        {/* Характеристики */}
        <div className="mb-6">
          <PropertyFeatures property={property} variant="detailed" className="mb-4" />
        </div>
        
        {/* Описание */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Описание</h3>
          <p className="text-gray-700">{property.description.ru}</p>
        </div>
        
        {/* Расположение */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Расположение</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-3">
              <strong>Адрес:</strong> {property.location.address}, {property.location.city}, {property.location.region}
            </p>
            
            {/* Карта с местоположением */}
            {property.location.coordinates && property.location.coordinates.lat && property.location.coordinates.lng && (
              <div className="h-52 w-full rounded overflow-hidden border border-gray-200">
                <MapContainer 
                  initialPosition={[property.location.coordinates.lat, property.location.coordinates.lng]} 
                  initialZoom={16}
                  height="100%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView; 