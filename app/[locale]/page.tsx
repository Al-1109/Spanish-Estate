'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const t = useTranslations();
  const [chatMessage, setChatMessage] = useState('');

  return (
    <div className="font-sans site-container">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-3xl">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition font-medium">
              {t('hero.buttonText')}
            </button>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">300+</div>
                <div className="text-gray-600">{t('hero.stats.objects')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">18</div>
                <div className="text-gray-600">{t('hero.stats.regions')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-900">10</div>
                <div className="text-gray-600">{t('hero.stats.experience')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Properties Section Placeholder */}
      <section id="properties" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('properties.title')}</h2>
          {/* Property listings would go here */}
          <div className="text-center mt-8">
            <button className="bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition font-medium">
              {t('properties.showMore')}
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section Placeholder */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('features.title')}</h2>
          {/* Feature cards would go here */}
        </div>
      </section>
      
      {/* Articles Section Placeholder */}
      <section id="articles" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('articles.title')}</h2>
          {/* Article cards would go here */}
        </div>
      </section>
      
      {/* AI Consultant Section Placeholder */}
      <section id="ai-consultant" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">{t('aiConsultant.title')}</h2>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            {t('aiConsultant.subtitle')}
          </p>
          
          {/* AI Chat interface would go here */}
          <div className="bg-white p-4 rounded-lg shadow-md max-w-2xl mx-auto">
            <div className="flex">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={t('aiConsultant.placeholder')}
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-900 text-white px-4 py-2 rounded-r-md hover:bg-blue-800">
                {t('aiConsultant.send')}
              </button>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">{t('aiConsultant.quickQuestions')}</h3>
              <div className="space-y-2">
                <button className="block w-full text-left bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 text-sm">
                  Какую недвижимость я могу купить с бюджетом 300 000€?
                </button>
                <button className="block w-full text-left bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 text-sm">
                  Какие документы нужны для покупки?
                </button>
                <button className="block w-full text-left bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 text-sm">
                  Как получить ВНЖ при покупке недвижимости?
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 