import Image from 'next/image';
import { Euro } from 'lucide-react';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
}

export function PropertiesSection() {
  const properties: Property[] = [
    {
      id: 1,
      title: "Роскошная вилла с видом на море",
      location: "Марбелья, Коста-дель-Соль",
      price: 2500000,
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      imageUrl: "/images/property-1.jpg"
    },
    {
      id: 2,
      title: "Современные апартаменты в центре",
      location: "Барселона, Каталония",
      price: 850000,
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      imageUrl: "/images/property-2.jpg"
    },
    {
      id: 3,
      title: "Пентхаус с террасой",
      location: "Валенсия",
      price: 1200000,
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      imageUrl: "/images/property-3.jpg"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <section className="properties">
      <div className="container">
        <h2>Избранные объекты</h2>
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <Image
                  src={property.imageUrl}
                  alt={property.title}
                  width={400}
                  height={300}
                  objectFit="cover"
                />
              </div>
              <div className="property-content">
                <h3>{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <div className="property-details">
                  <span>{property.bedrooms} спален</span>
                  <span>{property.bathrooms} ванных</span>
                  <span>{property.area} м²</span>
                </div>
                <div className="property-price">
                  <Euro size={20} />
                  <span>{formatPrice(property.price)}</span>
                </div>
                <button className="property-button">Подробнее</button>
              </div>
            </div>
          ))}
        </div>
        <div className="properties-more">
          <button className="view-all-button">Смотреть все объекты</button>
        </div>
      </div>
    </section>
  );
} 