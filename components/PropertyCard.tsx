import React from 'react';
import { Property, PropertyStatus } from '@/types/property';
import Link from 'next/link';
import { FiMapPin, FiMaximize2 } from 'react-icons/fi';
import { IoBed, IoWaterOutline } from 'react-icons/io5';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
  showLink?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  showLink = true,
  className = '' 
}) => {
  // Находим главное изображение
  const mainImage = property.images?.find(img => img.isMain) || property.images?.[0];
  
  // Форматирование цены
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const cardContent = (
    <div className={`overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg ${className}`}>
      {/* Изображение */}
      <div className="relative h-48 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || property.title.ru}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">Нет изображения</span>
          </div>
        )}
        
        {/* Статус объекта */}
        {property.status === PropertyStatus.SOLD && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">
            Продано
          </div>
        )}
        {property.status === PropertyStatus.PUBLISHED && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 text-xs font-bold rounded">
            Активен
          </div>
        )}
      </div>
      
      {/* Информация */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-lg text-gray-900 line-clamp-1">{property.title.ru}</h3>
        
        <div className="mb-2 flex items-center text-sm text-gray-500">
          <FiMapPin className="mr-1" />
          <span>{property.location.address ? `${property.location.address}, ` : ''}{property.location.city}, {property.location.region}</span>
        </div>
        
        <p className="mb-3 text-sm text-gray-600 line-clamp-2">{property.description.ru}</p>
        
        {/* Характеристики */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center text-gray-600">
            <IoBed className="mr-1" />
            <span className="text-sm">{property.features.bedrooms} спал.</span>
          </div>
          <div className="flex items-center text-gray-600">
            <IoWaterOutline className="mr-1" />
            <span className="text-sm">{property.features.bathrooms} ван.</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiMaximize2 className="mr-1" />
            <span className="text-sm">{property.features.totalArea} м²</span>
          </div>
        </div>
        
        {/* Цена */}
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg text-blue-600">
            {formatPrice(property.price.value)}
          </p>
        </div>
      </div>
    </div>
  );
  
  // Если нужна ссылка на страницу объекта
  if (showLink) {
    return (
      <Link href={`/properties/${property.id}`} className="block">
        {cardContent}
      </Link>
    );
  }
  
  return cardContent;
};

export default PropertyCard; 