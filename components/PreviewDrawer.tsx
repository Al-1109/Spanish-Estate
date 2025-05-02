import React, { useState } from 'react';
import { FiArrowLeft, FiEdit, FiMaximize, FiMinimize } from 'react-icons/fi';
import { Property } from '@/types/property';
import PropertyPreview from '@/components/PropertyPreview';
import Link from 'next/link';

interface PreviewDrawerProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  // Источник открытия предпросмотра: 'edit' - из формы редактирования, 'statistics' или другие - из других мест
  source?: 'edit' | 'statistics' | string;
}

const PreviewDrawer: React.FC<PreviewDrawerProps> = ({
  property,
  isOpen,
  onClose,
  source = 'statistics' // По умолчанию считаем, что открыли не из редактирования
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'compact' | 'full'>('both');
  
  if (!isOpen) return null;

  // Формируем корректную ссылку на страницу редактирования с учетом lastEditStep
  const editUrl = `/admin/properties/create?id=${property.id}${
    property.lastEditStep !== undefined ? `&step=${property.lastEditStep}` : ''
  }`;

  // Показываем кнопку "Редактировать" только если мы не из формы редактирования
  const showEditButton = source !== 'edit';
  
  // Функция для переключения режима просмотра
  const toggleViewMode = () => {
    if (viewMode === 'both') setViewMode('compact');
    else if (viewMode === 'compact') setViewMode('full');
    else setViewMode('both');
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Контент с отступом слева для сохранения видимости меню админки */}
      <div className="absolute top-0 bottom-0 right-0 left-64 bg-gray-100 overflow-auto">
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Предпросмотр: {property.title?.ru}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={toggleViewMode}
                className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                aria-label="Переключить режим"
                title="Переключить режим отображения"
              >
                {viewMode === 'both' ? (
                  <>
                    <FiMaximize className="mr-2" size={18} />
                    <span>Оба режима</span>
                  </>
                ) : viewMode === 'compact' ? (
                  <>
                    <FiMinimize className="mr-2" size={18} />
                    <span>Краткая карточка</span>
                  </>
                ) : (
                  <>
                    <FiMaximize className="mr-2" size={18} />
                    <span>Полная карточка</span>
                  </>
                )}
              </button>
              
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Назад"
              >
                <FiArrowLeft className="mr-2" size={18} />
                <span>Назад</span>
              </button>
              
              {showEditButton && (
                <Link
                  href={editUrl}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition-colors"
                >
                  <FiEdit className="mr-2" size={18} />
                  <span>Редактировать</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Показываем оба вида карточек или только один выбранный */}
          {(viewMode === 'both' || viewMode === 'compact') && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">Предпросмотр краткой карточки</span>
                <span className="text-sm text-gray-500">(как на главной странице)</span>
              </h3>
              <div className="max-w-md mx-auto">
                <PropertyPreview property={property} mode="compact" />
              </div>
            </div>
          )}
          
          {viewMode === 'both' && (
            <div className="border-t border-gray-300 my-8 pt-8"></div>
          )}
          
          {(viewMode === 'both' || viewMode === 'full') && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">Предпросмотр полной карточки</span>
                <span className="text-sm text-gray-500">(детальная страница объекта)</span>
              </h3>
              <PropertyPreview property={property} mode="full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewDrawer; 