import React from 'react';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { Property } from '@/types/property';
import PropertyPreview from './PropertyPreview';
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
  if (!isOpen) return null;

  // Формируем корректную ссылку на страницу редактирования с учетом lastEditStep
  const editUrl = `/admin/properties/create?id=${property.id}${
    property.lastEditStep !== undefined ? `&step=${property.lastEditStep}` : ''
  }`;

  // Показываем кнопку "Редактировать" только если мы не из формы редактирования
  const showEditButton = source !== 'edit';

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
          <PropertyPreview property={property} mode="full" />
        </div>
      </div>
    </div>
  );
};

export default PreviewDrawer; 