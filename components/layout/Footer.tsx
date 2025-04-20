import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Spanish Estate</h3>
            <p className="text-gray-400">Элитная недвижимость в Испании</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <p className="text-gray-400">Email: info@spanish-estate.com</p>
            <p className="text-gray-400">Телефон: +34 XXX XXX XXX</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Социальные сети</h3>
            <div className="flex space-x-4">
              {/* Здесь будут иконки социальных сетей */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Spanish Estate. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}; 