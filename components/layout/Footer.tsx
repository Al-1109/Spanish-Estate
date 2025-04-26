import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-bold text-xl mb-4">Spanish Estate</h3>
            <p className="text-gray-300 mb-4">
              Элитная недвижимость в Испании. Мы помогаем найти идеальный дом вашей мечты на
              побережье Средиземного моря.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Контакты</h3>
            <p className="text-gray-300 mb-2">Email: info@spanishestate.com</p>
            <p className="text-gray-300 mb-4">Телефон: +34 XXX XXX XXX</p>
            
            <h3 className="font-bold text-xl mb-4">Навигация</h3>
            <div className="flex flex-col space-y-2">
              <span onClick={scrollToTop} className="text-gray-300 hover:text-white cursor-pointer">Главная</span>
              <a href="#properties" className="text-gray-300 hover:text-white">Объекты</a>
              <a href="#about" className="text-gray-300 hover:text-white">О нас</a>
              <a href="#contacts" className="text-gray-300 hover:text-white">Контакты</a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xl mb-4">Мы в соцсетях</h3>
            {/* Иконки соцсетей будут добавлены позже */}
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Spanish Estate. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}; 