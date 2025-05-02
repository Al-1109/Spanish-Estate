'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { Property } from '@/types/property';
import { createProperty, updateProperty, getPropertyById } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import LocationStep from './components/LocationStep';
import PreviewDrawer from '@/components/PreviewDrawer';

// Компонент-заглушка для всех шагов
const PlaceholderStep = ({ title }: { title: string }) => (
  <div className="p-6 bg-gray-100 rounded-lg">
    <h2 className="text-xl font-semibold">{title}</h2>
    <p className="mt-4">Раздел в разработке.</p>
  </div>
);

type PropertyFormData = Omit<Partial<Property>, 'status'> & {
  status: 'active' | 'draft' | 'sold' | 'archived';
};

export default function CreatePropertyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  // Состояние для отображения предпросмотра
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Используем react-hook-form для управления формой
  const methods = useForm<PropertyFormData>({
    defaultValues: {
      title: { ru: '', en: '', es: '' },
      description: { ru: '', en: '', es: '' },
      type: 'apartment',
      location: {
        region: '',
        city: '',
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      price: { value: 0, currency: 'EUR' },
      status: 'draft' as const
    }
  });
  
  // Смотрим, есть ли адрес для возможности показа предпросмотра
  const hasAddress = !!methods.watch('location.address');

  // Функция для обновления данных объекта
  const updatePropertyData = (newData: Partial<PropertyFormData>) => {
    // Обновляем данные через react-hook-form
    Object.entries(newData).forEach(([key, value]) => {
      methods.setValue(key as any, value);
    });
  };
  
  // Определяем шаги формы
  const formSteps = [
    {
      id: 'basic-info',
      title: 'Основная информация',
      component: <PlaceholderStep title="Основная информация" />
    },
    {
      id: 'location',
      title: 'Расположение',
      component: <LocationStep />
    },
    {
      id: 'features',
      title: 'Характеристики',
      component: <PlaceholderStep title="Характеристики" />
    },
    {
      id: 'images',
      title: 'Изображения',
      component: <PlaceholderStep title="Изображения" />
    },
    {
      id: 'homepage-settings',
      title: 'Настройки главной',
      component: <PlaceholderStep title="Настройки главной" />
    },
    {
      id: 'seo',
      title: 'SEO и мета-данные',
      component: <PlaceholderStep title="SEO и мета-данные" />
    }
  ];

  // Переход на предыдущий шаг
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Переход на следующий шаг
  const handleNextStep = () => {
    // Проверяем, указан ли адрес
    const address = methods.getValues('location.address');
    const city = methods.getValues('location.city');
    const region = methods.getValues('location.region');
    
    console.log('[CreatePropertyPage] Проверка перед переходом:', { address, city, region });
    
    // Если адрес указан, но город или регион не установлены
    if (address) {
      console.log('[CreatePropertyPage] Адрес указан - проверим, нужно ли установить город и регион');
      
      // Проверка на Торревьеху (любое написание)
      const lowerAddress = address.toLowerCase();
      if (
        lowerAddress.includes('torrevieja') || 
        lowerAddress.includes('торревьеха') || 
        lowerAddress.includes('торрев') || 
        lowerAddress.includes('toppeв') ||
        /т[о0]рр[еe]в[ьb]?[еe]х[аa]/i.test(address)
      ) {
        console.log('[CreatePropertyPage] Найдена Торревьеха в адресе');
        methods.setValue('location.city', 'torrevieja');
        methods.setValue('location.region', 'costa-blanca');
      } 
      // Проверка на Аликанте
      else if (
        lowerAddress.includes('alicante') || 
        lowerAddress.includes('аликанте')
      ) {
        console.log('[CreatePropertyPage] Найден Аликанте в адресе');
        methods.setValue('location.city', 'alicante');
        methods.setValue('location.region', 'costa-blanca');
      }
      
      // Если адрес указан, но город и регион нет, разрешаем продолжить в любом случае
      if (!city || !region) {
        console.log('[CreatePropertyPage] Пропускаем проверку города и региона, так как указан адрес');
        // Очищаем ошибки валидации для города и региона
        methods.clearErrors('location.city');
        methods.clearErrors('location.region');
      }
    }
    
    // Стандартная проверка валидации формы, но с учётом того, что адрес может быть важнее города и региона
    methods.trigger().then(isValid => {
      // Если форма валидна или у нас есть адрес (даже без города и региона)
      if (isValid || address) {
        if (currentStep < formSteps.length - 1) {
          setCurrentStep(currentStep + 1);
          window.scrollTo(0, 0);
        }
      } else {
        console.log('Форма содержит ошибки валидации');
      }
    });
  };

  return (
    <div className="min-h-full bg-gray-50">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900">Добавление нового объекта</h1>
            </div>
          </div>
          
          <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Link href="/admin/properties">
                  <button className="text-gray-600 hover:text-gray-900">
                    <FiArrowLeft size={20} />
                  </button>
                </Link>
                <h1 className="text-2xl font-bold">
                  Редактирование объекта: ппп
                </h1>
              </div>
            </div>
            
            <FormProvider {...methods}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Боковая навигация по шагам */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">Шаги заполнения</h2>
                    
                    <nav className="steps-nav space-y-1">
                      {formSteps.map((step, index) => {
                        // Определяем класс для активного шага
                        let stepClass = '';
                        if (index === currentStep) {
                          stepClass = 'bg-blue-100 text-blue-800 font-medium';
                        } else {
                          stepClass = 'hover:bg-gray-100 text-gray-800';
                        }
                        
                        return (
                          <button
                            key={step.id}
                            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center ${stepClass}`}
                            onClick={() => setCurrentStep(index)}
                          >
                            <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-xs border border-current mr-2 bg-white">
                              {index + 1}
                            </span>
                            <span>{step.title}</span>
                          </button>
                        );
                      })}
                    </nav>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">
                        Текущий статус: <span className="font-medium text-gray-800">
                          Черновик
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Заполните все этапы последовательно, чтобы опубликовать объект.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Текущий шаг: {formSteps[currentStep].title}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Основная область с формой */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-lg shadow p-6">
                    {/* Содержимое текущего шага */}
                    <div className="step-content mb-8">
                      {formSteps[currentStep].component}
                    </div>
                    
                    {/* Кнопки навигации по шагам */}
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <button
                        className={`px-4 py-2 rounded ${
                          currentStep === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                      >
                        <FiArrowLeft className="inline mr-1" /> Назад
                      </button>

                      <div className="flex gap-2">
                        {/* Кнопка предпросмотра - показывается только если есть адрес */}
                        {hasAddress && (
                          <button
                            onClick={() => setPreviewOpen(true)}
                            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors"
                          >
                            <FiEye className="inline" />
                            Предпросмотр
                          </button>
                        )}
                        
                        {currentStep < formSteps.length - 1 ? (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                            onClick={handleNextStep}
                          >
                            Продолжить <FiArrowRight className="inline" />
                          </button>
                        ) : (
                          <button 
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                            onClick={() => alert('Демо-режим: объект не будет сохранен')}
                          >
                            Завершить (демо)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormProvider>
          </div>
          
          {/* Компонент предпросмотра */}
          {previewOpen && (
            <PreviewDrawer
              property={methods.getValues() as Property}
              isOpen={previewOpen}
              onClose={() => setPreviewOpen(false)}
              source="edit"
            />
          )}
        </div>
      </main>
    </div>
  );
} 