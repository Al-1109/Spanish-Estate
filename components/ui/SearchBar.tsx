'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div 
        className={`
          relative 
          transition-all 
          duration-300
          ${isFocused ? 'bg-white shadow-2xl' : 'bg-white/10 backdrop-blur'}
          rounded-xl 
          overflow-hidden
        `}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Поиск недвижимости..."
          className={`
            w-full 
            px-6 
            py-5 
            pl-12
            bg-transparent
            text-lg
            placeholder-white/60
            ${isFocused ? 'text-gray-900' : 'text-white'}
            focus:outline-none
          `}
        />
        <Search 
          className={`
            absolute 
            left-4 
            top-1/2 
            -translate-y-1/2 
            h-5 
            w-5
            ${isFocused ? 'text-gray-400' : 'text-white/60'}
          `}
        />
      </div>

      {/* Живой предпросмотр результатов */}
      {isFocused && searchQuery && (
        <div className="
          absolute 
          top-full 
          left-0 
          right-0 
          mt-2 
          bg-white 
          rounded-xl 
          shadow-2xl 
          overflow-hidden
          divide-y 
          divide-gray-100
        ">
          <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-sm text-gray-600">Вилла</div>
            <div className="text-base text-gray-900">Современная вилла с видом на море в Марбелье</div>
          </div>
          <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-sm text-gray-600">Пентхаус</div>
            <div className="text-base text-gray-900">Двухуровневый пентхаус в центре Барселоны</div>
          </div>
        </div>
      )}
    </div>
  );
}; 