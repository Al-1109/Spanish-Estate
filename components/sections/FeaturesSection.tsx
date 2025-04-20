'use client';

import React from 'react';
import { 
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  IdentificationIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: 'ИИ-консультант 24/7',
    description: 'Мгновенные ответы на ваши вопросы в любое время суток'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Проверенные объекты',
    description: 'Тщательная проверка каждого объекта недвижимости'
  },
  {
    icon: DocumentCheckIcon,
    title: 'Юридическое сопровождение',
    description: 'Полная поддержка при оформлении документов'
  },
  {
    icon: UserGroupIcon,
    title: 'Индивидуальный подход',
    description: 'Персональный менеджер для каждого клиента'
  },
  {
    icon: IdentificationIcon,
    title: 'Помощь с ВНЖ',
    description: 'Содействие в получении вида на жительство'
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Послепродажный сервис',
    description: 'Поддержка после завершения сделки'
  }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-xl text-gray-600">
            Мы предоставляем полный спектр услуг по подбору и приобретению элитной недвижимости в Испании
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <Icon className="h-12 w-12 text-primary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 