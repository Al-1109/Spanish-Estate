import React, { useState, useEffect } from 'react';
import { FiInfo, FiFlag, FiAlertCircle, FiHome, FiBriefcase, FiMapPin, FiEye, FiPlus } from 'react-icons/fi';
import { useFormContext } from 'react-hook-form';

const BasicInfoStep = () => {
  const { register, formState: { errors }, watch, setValue, getValues, trigger } = useFormContext();
  const [showPreview, setShowPreview] = useState(false);
  const [customPropertyType, setCustomPropertyType] = useState(false);
  
  const propertyType = watch('type');
  const titleRu = watch('title.ru');
  const descriptionRu = watch('description.ru');
  const price = watch('price.value');
  
  // Проверяем, заполнены ли все обязательные поля
  useEffect(() => {
    const checkRequiredFields = async () => {
      const isValid = await trigger(['title.ru', 'price.value', 'type', 'description.ru']);
      setShowPreview(isValid);
    };
    
    checkRequiredFields();
  }, [titleRu, descriptionRu, price, propertyType, trigger]);
  
  // Функция для изменения типа объекта
  const handleTypeChange = (type: string) => {
    setValue('type', type, { shouldValidate: true });
    setCustomPropertyType(type === 'custom');
  };
  
  // Функция для обработки выбора произвольного типа
  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('type', e.target.value, { shouldValidate: true });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-2">
        <FiInfo className="mr-2" />
        <h2 className="text-xl font-semibold">Основная информация</h2>
      </div>
      
      {/* Блок с названием объекта */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Название объекта</h3>
        
        {/* Только русский язык */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название (RU)</label>
          <input 
            type="text"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors?.title?.ru ? 'border-red-500' : ''}`}
            {...register('title.ru', { required: 'Название на русском обязательно' })}
            placeholder="Введите название объекта на русском"
          />
          {errors?.title?.ru && (
            <p className="mt-1 text-sm text-red-600">
              <span className="flex items-center">
                <FiAlertCircle className="mr-1" />
                {String(errors.title.ru.message)}
              </span>
            </p>
          )}
        </div>
      </div>
      
      {/* Блок с типом объекта */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Тип объекта</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              propertyType === 'apartment' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTypeChange('apartment')}
          >
            <FiHome className="mr-1.5" /> Квартира
          </button>
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              propertyType === 'house' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTypeChange('house')}
          >
            <FiHome className="mr-1.5" /> Дом
          </button>
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              propertyType === 'villa' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTypeChange('villa')}
          >
            <FiHome className="mr-1.5" /> Вилла
          </button>
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              propertyType === 'commercial' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTypeChange('commercial')}
          >
            <FiBriefcase className="mr-1.5" /> Коммерческая
          </button>
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              propertyType === 'land' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTypeChange('land')}
          >
            <FiMapPin className="mr-1.5" /> Земля
          </button>
          <button 
            type="button"
            className={`flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              customPropertyType 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => {
              setCustomPropertyType(true);
              setValue('type', '', { shouldValidate: true });
            }}
          >
            <FiPlus className="mr-1.5" /> Другое
          </button>
        </div>
        
        {/* Произвольный тип объекта */}
        {customPropertyType && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Укажите свой тип объекта</label>
            <input 
              type="text"
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors?.type ? 'border-red-500' : ''}`}
              onChange={handleCustomTypeChange}
              placeholder="Например: Таунхаус, Бунгало, Пентхаус и т.д."
            />
          </div>
        )}
        
        {errors?.type && (
          <p className="mt-2 text-sm text-red-600">
            <span className="flex items-center">
              <FiAlertCircle className="mr-1" />
              {String(errors.type.message)}
            </span>
          </p>
        )}
      </div>
      
      {/* Блок с ценой и статусом */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Цена и статус</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена, €</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input 
                type="number" 
                className={`block w-full pl-7 pr-12 border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 ${errors?.price?.value ? 'border-red-500' : ''}`}
                placeholder="0"
                {...register('price.value', { 
                  required: 'Укажите цену',
                  min: { value: 0, message: 'Цена должна быть положительным числом' } 
                })}
              />
            </div>
            {errors?.price?.value && (
              <p className="mt-1 text-sm text-red-600">
                <span className="flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {String(errors.price.value.message)}
                </span>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select 
              className={`block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors?.status ? 'border-red-500' : ''}`}
              {...register('status', { required: 'Выберите статус' })}
            >
              <option value="active">Активен</option>
              <option value="reserved">Зарезервирован</option>
              <option value="sold">Продан</option>
              <option value="draft">Черновик</option>
            </select>
            {errors?.status && (
              <p className="mt-1 text-sm text-red-600">
                <span className="flex items-center">
                  <FiAlertCircle className="mr-1" />
                  {String(errors.status.message)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Блок с описанием объекта */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">Описание объекта</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание (RU)</label>
          <textarea 
            rows={6}
            className={`block w-full rounded-md border-gray-300 shadow-sm ${errors?.description?.ru ? 'border-red-500' : ''}`}
            {...register('description.ru', { required: 'Описание на русском обязательно' })}
            placeholder="Введите описание объекта на русском"
          />
          {errors?.description?.ru && (
            <p className="mt-1 text-sm text-red-600">
              <span className="flex items-center">
                <FiAlertCircle className="mr-1" />
                {String(errors.description.ru.message)}
              </span>
            </p>
          )}
        </div>
      </div>
      
      {/* Кнопка предпросмотра - появляется только после заполнения всех обязательных полей */}
      {showPreview && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              // Здесь будет логика открытия предпросмотра
              // Предполагается, что родительский компонент создаст Drawer с предпросмотром
              const parentPreviewBtn = document.querySelector('button[aria-label="Предпросмотр"]');
              if (parentPreviewBtn) {
                (parentPreviewBtn as HTMLButtonElement).click();
              }
            }}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors"
          >
            <FiEye className="inline" />
            Предпросмотр
          </button>
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep; 