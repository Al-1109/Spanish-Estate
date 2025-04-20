'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск недвижимости по местоположению, цене или характеристикам..."
          className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          onClick={() => console.log('Search:', searchQuery)}
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}; 