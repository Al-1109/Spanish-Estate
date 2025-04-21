'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ChevronLeft, MessageSquare, Wallet, Globe, Home, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';
import { AIConsultantSection } from './components/sections/AIConsultantSection';

const MainPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  const properties = [
    {
      id: 1,
      title: 'Роскошная вилла на побережье',
      location: 'Коста Брава, Бланес',
      price: '850 000 €',
      area: '450 м²',
      bedrooms: 5,
      bathrooms: 3,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400']
    },
    {
      id: 2,
      title: 'Современные апартаменты в центре',
      location: 'Барселона',
      price: '350 000 €',
      area: '85 м²',
      bedrooms: 2,
      bathrooms: 2,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400']
    },
    {
      id: 3,
      title: 'Загородный дом с садом',
      location: 'Мадрид',
      price: '450 000 €',
      area: '320 м²',
      bedrooms: 4,
      bathrooms: 3,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400']
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Как получить ВНЖ в Испании при покупке недвижимости',
      excerpt: 'Подробное руководство о процессе получения вида на жительство через покупку недвижимости в Испании.',
      date: '15 апреля 2025',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Топ-10 регионов Испании для инвестиций в недвижимость',
      excerpt: 'Анализ лучших регионов Испании с точки зрения рентабельности инвестиций в недвижимость.',
      date: '2 апреля 2025',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Процесс оформления купли-продажи в Испании',
      excerpt: 'Пошаговое руководство по юридическим аспектам приобретения недвижимости в Испании.',
      date: '27 марта 2025',
      image: '/api/placeholder/400/250'
    }
  ];

  const advantages = [
    {
      icon: <MessageSquare className="w-10 h-10 text-blue-800" />,
      title: 'ИИ-консультант',
      description: <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-blue-900">24/7</span>
        <span>Мгновенные ответы на все вопросы в любое время суток по вопросам покупки недвижимости в Испании</span>
      </div>
    },
    {
      icon: <Home className="w-10 h-10 text-blue-800" />,
      title: 'Проверенные объекты',
      description: 'Полный пакет документов на объект недвижимости и отсутствие обременений. Все необходимые сертификаты'
    },
    {
      icon: <Wallet className="w-10 h-10 text-blue-800" />,
      title: 'Экономическая выгода',
      description: 'Мы продаем наши аппартаменты без агентских комиссий. Поэтому наши цены ниже рынка'
    },
    {
      icon: <Mail className="w-10 h-10 text-blue-800" />,
      title: 'Полное сопровождение',
      description: 'Юридическая поддержка на всех этапах сделки, помощь в получении налогового номера в Испании, открытие счета, ипотека'
    }
  ];

  const quickQuestions = [
    'Какую недвижимость я могу купить с бюджетом 300 000€?',
    'Какие документы нужны для покупки?',
    'Как получить ВНЖ при покупке недвижимости?',
    'Сколько стоит содержание недвижимости?'
  ];

  return (
    <div className="font-sans site-container" style={{ position: 'relative' }}>
      {/* Шапка */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md" style={{ marginBottom: 0, paddingBottom: 0 }}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-900">Mirasol Estate</div>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a href="#properties" onClick={(e) => scrollToSection(e, 'properties')} className="text-gray-700 hover:text-blue-900">Каталог</a>
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">FAQ</a>
              <a href="#articles" onClick={(e) => scrollToSection(e, 'articles')} className="text-gray-700 hover:text-blue-900">Статьи</a>
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">Контакты</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-full px-3 py-1">
                <Globe className="w-4 h-4 text-gray-500" />
                <select className="ml-1 bg-transparent border-none focus:outline-none text-sm">
                  <option>RU</option>
                  <option>EN</option>
                  <option>ES</option>
                </select>
              </div>
              
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
                ИИ-консультант
              </a>
            </div>
          </div>
          
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <nav className="flex flex-col space-y-3">
              <a href="#properties" onClick={(e) => scrollToSection(e, 'properties')} className="text-gray-700 hover:text-blue-900">Каталог</a>
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">FAQ</a>
              <a href="#articles" onClick={(e) => scrollToSection(e, 'articles')} className="text-gray-700 hover:text-blue-900">Статьи</a>
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="text-gray-700 hover:text-blue-900">Контакты</a>
            </nav>
            
            <div className="mt-4 flex justify-between">
              <div className="flex items-center border rounded-full px-3 py-1">
                <Globe className="w-4 h-4 text-gray-500" />
                <select className="ml-1 bg-transparent border-none focus:outline-none text-sm">
                  <option>RU</option>
                  <option>EN</option>
                  <option>ES</option>
                </select>
              </div>
              
              <a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition">
                ИИ-консультант
              </a>
            </div>
          </div>
        )}
      </header>
      
      <div style={{ height: '60px' }}></div> {/* Высота шапки */}
      
      {/* Баннер с минимальным вертикальным отступом */}
      <section 
        style={{ 
          height: '400px',
          marginTop: '-5px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/images/banner.jpg')`,
            filter: 'brightness(0.85)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-40" />
      </section>
      
      {/* Основной контент */}
      <main>
        {/* Блок презентации */}
        <section className="py-4 bg-white" style={{ marginTop: '-40px' }}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-blue-900 mb-1">Продажа аппартаментов от собственника</h2>
              <h3 className="text-2xl font-semibold text-blue-800">в быстро развивающемся курортном городе Торревьеха, Испания</h3>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-gray-800 font-medium leading-relaxed mb-3">
                Mirasol Estate это семейный бизнес, мы продаем свои квартиры, которые были приобретены после тщательного отбора и содержатся в хорошем состоянии.
              </p>
              <p className="text-xl text-gray-800 font-medium leading-relaxed">
                Наши квартиры - это лучшее сочетание принципа "цена-качество" для потенциального покупателя. Аппартаменты отлично подходят как для постоянного проживания, так и для арендного бизнеса.
              </p>
            </div>
          </div>
        </section>
        
        {/* Блок преимуществ */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Наши преимущества</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
                >
                  <div className="mb-4 flex justify-center">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-900">{advantage.title}</h3>
                  <div className="text-gray-600">{advantage.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Блок предложений недвижимости */}
        <section id="properties" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Наши лучшие предложения</h2>
            
            <div className="relative">
              <div className="flex overflow-x-hidden">
                <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${activePropertyIndex * 100}%)` }}>
                  {properties.map((property, index) => (
                    <div key={property.id} className="w-full flex-shrink-0 px-4">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative h-64 bg-gray-200">
                          <img src={`https://placehold.co/600x400`} alt={property.title} className="w-full h-full object-cover" />
                          <div className="absolute bottom-4 right-4 flex space-x-2">
                            <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            <span className="w-2 h-2 rounded-full bg-white opacity-50"></span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 text-blue-900">{property.title}</h3>
                          <p className="text-gray-500 mb-4">{property.location}</p>
                          <div className="flex justify-between mb-6">
                            <span className="text-2xl font-bold text-blue-900">{property.price}</span>
                            <div className="flex space-x-4 text-gray-600">
                              <span>{property.area}</span>
                              <span>{property.bedrooms} спален</span>
                              <span>{property.bathrooms} ванных</span>
                            </div>
                          </div>
                          <button className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-800 transition">
                            Подробнее
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                onClick={() => setActivePropertyIndex(Math.max(0, activePropertyIndex - 1))}
                disabled={activePropertyIndex === 0}
              >
                <ChevronLeft className={`w-6 h-6 ${activePropertyIndex === 0 ? 'text-gray-300' : 'text-blue-900'}`} />
              </button>
              
              <button 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
                onClick={() => setActivePropertyIndex(Math.min(properties.length - 1, activePropertyIndex + 1))}
                disabled={activePropertyIndex === properties.length - 1}
              >
                <ChevronRight className={`w-6 h-6 ${activePropertyIndex === properties.length - 1 ? 'text-gray-300' : 'text-blue-900'}`} />
              </button>
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition">
                Смотреть все предложения
              </button>
            </div>
          </div>
        </section>
        
        {/* Блок ИИ-консультанта */}
        <AIConsultantSection />
        
        {/* Блок статей/вики */}
        <section id="articles" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">Полезная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={`https://placehold.co/400x250`} alt={article.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-blue-900">{article.title}</h3>
                    <p className="text-gray-500 text-sm mb-3">{article.date}</p>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <button className="text-blue-900 font-semibold hover:underline flex items-center">
                      Читать полностью <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition">
                Все статьи
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mirasol Estate</h3>
              <p className="text-blue-100 mb-4">
                Продажа недвижимости в Испании от прямых собственников с полным сопровождением и поддержкой на всех этапах на вашем языке.
              </p>
              <div className="flex space-x-4 text-blue-100">
                <a href="#" className="hover:text-white"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-white"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Навигация</h3>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#properties" onClick={(e) => scrollToSection(e, 'properties')} className="hover:text-white">Каталог недвижимости</a></li>
                <li><a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="hover:text-white">Часто задаваемые вопросы</a></li>
                <li><a href="#articles" onClick={(e) => scrollToSection(e, 'articles')} className="hover:text-white">Статьи</a></li>
                <li><a href="#ai-consultant" onClick={(e) => scrollToSection(e, 'ai-consultant')} className="hover:text-white">Отправить сообщение</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Подписка на новости</h3>
              <p className="text-blue-100 mb-4">
                Получайте информацию о новых объектах и полезные статьи
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="flex-grow px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
                />
                <button className="bg-blue-800 px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
                  Подписаться
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-blue-800 text-center text-blue-200">
            <p>© 2024 Mirasol Estate. Все права защищены.</p>
            <div className="mt-2 flex justify-center space-x-4 text-sm">
              <a href="#" className="hover:text-white">Политика конфиденциальности</a>
              <a href="#" className="hover:text-white">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage; 