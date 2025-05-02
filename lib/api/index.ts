import { Property } from '@/types/property';

// Создание нового объекта недвижимости
export async function createProperty(property: Partial<Property>): Promise<Property> {
  // Демо-реализация без реального API
  console.log('API: Создание объекта недвижимости', property);
  return { id: 'property-' + Date.now(), ...property } as Property;
}

// Обновление объекта недвижимости
export async function updateProperty(id: string, property: Partial<Property>): Promise<Property> {
  // Демо-реализация без реального API
  console.log('API: Обновление объекта недвижимости', { id, property });
  return { id, ...property } as Property;
}

// Получение объекта недвижимости по ID
export async function getPropertyById(id: string): Promise<Property | null> {
  // Демо-реализация без реального API
  console.log('API: Получение объекта недвижимости по ID', id);
  return { id, title: { ru: 'Тестовый объект', en: 'Test property', es: 'Propiedad de prueba' } } as Property;
} 