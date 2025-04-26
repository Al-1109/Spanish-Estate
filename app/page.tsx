'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ChevronLeft, MessageSquare, Wallet, Globe, Home, Mail, Phone, Instagram, Facebook, Twitter, ArrowRight, MapPin, BedDouble, Bath } from 'lucide-react';
import { AIConsultantSection } from './components/sections/AIConsultantSection';

const MainPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);
  const [expandedPropertyId, setExpandedPropertyId] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  
  // Функция для обработки открытия карточки
  const handleExpandProperty = (propertyId: number) => {
    // Если эта карточка уже открыта - ничего не делаем
    if (expandedPropertyId === propertyId) return;
    
    // Устанавливаем ID новой открытой карточки
    setExpandedPropertyId(propertyId);
    
    // Прокручиваем к нужной позиции
    setTimeout(() => {
      // Получаем ссылку на карточку по ID
      const expandedCard = document.querySelector(`[data-property-id="${propertyId}"]`);
      if (expandedCard) {
        // Получаем позицию верхней части карточки
        const cardTop = expandedCard.getBoundingClientRect().top + window.pageYOffset;
        // Прокручиваем так, чтобы верх карточки был немного ниже верха экрана
        window.scrollTo({ top: cardTop - 100, behavior: 'smooth' });
      }
    }, 150); // Небольшая задержка для уверенности, что DOM обновился
  };
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    // Сбрасываем текущее сообщение во всех случаях для очистки строки ввода
    setChatMessage('');
    
    // При переходе по меню сворачиваем раскрытую карточку объекта
    setExpandedPropertyId(null);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };
  
  // Функция прокрутки страницы наверх
  const scrollToTop = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Сбрасываем текущее сообщение ИИ-консультанта и очищаем строку ввода
    setChatMessage('');
    
    // Сворачиваем раскрытую карточку объекта
    setExpandedPropertyId(null);
  };

  // Функция прокрутки к блоку ИИ-консультанта с заполнением поля ввода
  const scrollToAIConsultant = (propertyTitle: string, location: string) => {
    // Устанавливаем сообщение с информацией об объекте
    const message = `Меня заинтересовал объект по адресу: ${location}. Расскажите подробнее о нем.`;
    setChatMessage(message);
    
    // Прокручиваем страницу к ИИ-консультанту
    setTimeout(() => {
      const element = document.getElementById('ai-consultant');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  
  const properties = [
    {
      id: 1,
      title: 'Роскошная вилла на побережье',
      location: 'Коста Брава, Бланес',
      price: '850 000',
      area: '450',
      bedrooms: 5,
      bathrooms: 3,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
      description: 'Великолепная вилла с панорамным видом на море, расположенная в престижном районе Коста Брава. Просторные комнаты, современный дизайн и высококачественная отделка.',
      features: [
        'Панорамный вид на море',
        'Частный бассейн',
        'Гараж на 2 машины',
        'Садовник включен в обслуживание',
        'Система умный дом',
        'Полностью меблирована'
      ]
    },
    {
      id: 2,
      title: 'Современные апартаменты в центре',
      location: 'Торревьеха, район La Mata',
      price: '165 000',
      area: '85',
      bedrooms: 2,
      bathrooms: 2,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
      description: 'Светлые и просторные апартаменты в самом сердце города. В пешей доступности пляж, магазины, рестораны и вся необходимая инфраструктура.',
      features: [
        'Первая линия моря',
        'Закрытая территория',
        'Подземный паркинг',
        'Кондиционирование',
        'Общий бассейн',
        'Терраса'
      ]
    },
    {
      id: 3,
      title: 'Загородный дом с садом',
      location: 'Торревьеха, район Punta Prima',
      price: '450 000',
      area: '320',
      bedrooms: 4,
      bathrooms: 3,
      images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
      description: 'Уютный семейный дом в тихом районе с большим садом и зоной барбекю. Идеально подходит для постоянного проживания или сдачи в аренду.',
      features: [
        'Большой сад',
        'Зона барбекю',
        'Солярий на крыше',
        'Кладовая',
        'Теплые полы',
        'Автоматический полив'
      ]
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
          <div 
            className="text-2xl font-bold text-blue-900 cursor-pointer" 
            onClick={scrollToTop}
          >
            Mirasol Estate
          </div>
          
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
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center w-full h-full"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  data-property-id={property.id}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                    expandedPropertyId === property.id ? 'lg:col-span-3 md:col-span-2 order-last' : ''
                  }`}
                >
                  {expandedPropertyId === property.id ? (
                    <>
                      {/* Большой блок с фото/слайдером */}
                      <div className="relative h-[600px]">
                        <img 
                          src={property.images[0]} 
                          alt={property.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-6 right-6 flex space-x-3">
                          {property.images.map((_, index) => (
                            <span 
                              key={index}
                              className={`w-3 h-3 rounded-full bg-white ${
                                index === 0 ? '' : 'opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-2xl font-bold text-blue-900 mb-2">
                              {property.price} €
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">
                              {property.title}
                            </h3>
                            <div className="flex items-center text-gray-600">
                              <MapPin size={16} className="mr-1" />
                              <span>{property.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between text-gray-700 my-6">
                          <div className="flex items-center whitespace-nowrap">
                            <Home size={18} className="mr-2" />
                            <span>{property.area} м²</span>
                          </div>
                          <div className="flex items-center whitespace-nowrap">
                            <BedDouble size={18} className="mr-2" />
                            <span>{property.bedrooms} спальни</span>
                          </div>
                          <div className="flex items-center whitespace-nowrap">
                            <Bath size={18} className="mr-2" />
                            <span>{property.bathrooms} ванные</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{property.description}</p>
                        
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-blue-900 mb-3">Особенности:</h4>
                          <ul className="grid grid-cols-2 gap-3">
                            {property.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                <span className="w-2 h-2 bg-blue-900 rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t pt-6 flex justify-between items-center">
                          <button 
                            onClick={() => setExpandedPropertyId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-blue-900 px-6 py-3 rounded-md transition flex items-center"
                          >
                            Свернуть <ArrowRight size={16} className="ml-2" />
                          </button>
                          
                          <button 
                            onClick={() => scrollToAIConsultant(property.title, property.location)}
                            className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition flex items-center"
                          >
                            <MessageSquare size={16} className="mr-2" />
                            Задать вопрос об объекте
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative h-64">
                        <img 
                          src={property.images[0]} 
                          alt={property.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="p-6 flex flex-col" style={{ height: 'calc(100% - 16rem)' }}>
                        <div className="text-2xl font-bold text-blue-900 mb-2">
                          {property.price} €
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                          {property.title}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin size={16} className="mr-1" />
                          <span>{property.location}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {property.description}
                        </p>
                        
                        <div className="mt-auto">
                          <div className="flex justify-between text-gray-700 mb-6">
                            <div className="flex items-center whitespace-nowrap">
                              <Home size={18} className="mr-2" />
                              <span>{property.area} м²</span>
                            </div>
                            <div className="flex items-center whitespace-nowrap">
                              <BedDouble size={18} className="mr-2" />
                              <span>{property.bedrooms} спальни</span>
                            </div>
                            <div className="flex items-center whitespace-nowrap">
                              <Bath size={18} className="mr-2" />
                              <span>{property.bathrooms} ванные</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <button 
                              onClick={() => handleExpandProperty(property.id)}
                              className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition flex items-center"
                            >
                              Подробнее <ArrowRight size={16} className="ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Блок ИИ-консультанта */}
        <AIConsultantSection chatMessage={chatMessage} />
        
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
                <li><a href="#" onClick={scrollToTop} className="hover:text-white">Главная</a></li>
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