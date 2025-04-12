'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
}

export default function TestSupabase() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*');

        if (error) throw error;
        
        setProperties(data || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        console.error('Ошибка при получении данных:', err);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="p-4">Загрузка данных...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Тест подключения к Supabase</h1>
        <div className="text-red-500">
          <p>Ошибка: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Тест подключения к Supabase</h1>
      <div className="mb-4">
        <p className="text-green-500">Подключение успешно!</p>
        <p>Найдено объектов: {properties.length}</p>
      </div>
      <div className="grid gap-4">
        {properties.map((property) => (
          <div key={property.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{property.title}</h2>
            <p className="text-gray-600">{property.description}</p>
            <p className="mt-2">
              <span className="font-bold">Цена:</span> {property.price.toLocaleString()} €
            </p>
            <p>
              <span className="font-bold">Город:</span> {property.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 