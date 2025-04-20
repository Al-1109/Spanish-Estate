'use client';

import React, { useEffect, useRef } from 'react';
import { SearchBar } from '../ui/SearchBar';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Фоновое видео */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/videos/aerial-coast.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Контент */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl space-y-8">
            {/* Заголовок */}
            <div className="space-y-4">
              <h1 className="font-playfair text-7xl md:text-8xl font-light text-white leading-tight tracking-tight">
                Роскошная
                <br />
                недвижимость
                <br />
                <span className="font-normal">в Испании</span>
              </h1>
            </div>

            {/* Описание */}
            <p className="text-xl text-white/80 font-light tracking-wide max-w-xl">
              Откройте для себя уникальные объекты на побережье Средиземного моря. Персональный подход и полное сопровождение сделки.
            </p>

            {/* Поиск */}
            <div className="pt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Индикатор скролла */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="h-[1px] w-[120px] bg-white/20">
          <div className="h-full w-1/3 bg-white/80 animate-scroll" />
        </div>
      </div>
    </section>
  );
}; 