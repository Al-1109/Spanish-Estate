import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-playfair font-bold text-[#1A365D]">Spanish Estate</span>
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-600 hover:text-[#1A365D] transition-colors">
              Объекты
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#1A365D] transition-colors">
              О нас
            </Link>
            <Link href="/contacts" className="text-gray-600 hover:text-[#1A365D] transition-colors">
              Контакты
            </Link>
          </nav>

          {/* Кнопки действий */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-4 py-2 text-[#1A365D] hover:text-[#C4A77D] transition-colors">
              RU
            </button>
            <button className="px-6 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#C4A77D] transition-colors">
              ИИ-консультант
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 