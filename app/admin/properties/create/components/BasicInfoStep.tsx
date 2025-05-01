import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Property } from '@/types/property';

interface BasicInfoStepProps {
  property?: Partial<Property>;
  setProperty?: (property: Partial<Property>) => void;
  errors?: Record<string, any>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ errors = {} }) => {
  const { register, formState: { errors: formErrors }, setValue, watch } = useFormContext<Partial<Property>>();
  
  const propertyType = watch('type');
  
  return (
    <div className="space-y-6">
      {/* Заголовок и описание шага */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Основная информация</h2>
        <p className="text-gray-600 mb-4">
          Укажите основные характеристики объекта недвижимости, такие как название,
          тип, цена и статус.
        </p>
      </div>
      
      {/* Название объекта */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название (RU) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title.ru')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Например: Уютная вилла с видом на море"
          />
          {formErrors.title?.ru && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title.ru.message?.toString()}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название (EN)
          </label>
          <input
            type="text"
            {...register('title.en')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Например: Cozy villa with sea view"
          />
        </div>
      </div>
      
      {/* Тип объекта и статус */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип объекта <span className="text-red-500">*</span>
          </label>
          <select
            {...register('type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите тип объекта</option>
            <option value="apartment">Квартира</option>
            <option value="house">Дом</option>
            <option value="villa">Вилла</option>
            <option value="commercial">Коммерческая недвижимость</option>
            <option value="land">Земельный участок</option>
          </select>
          {formErrors.type && (
            <p className="text-red-500 text-sm mt-1">{formErrors.type.message?.toString()}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Статус объекта <span className="text-red-500">*</span>
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Выберите статус</option>
            <option value="active">Активен</option>
            <option value="sold">Продан</option>
            <option value="reserved">Зарезервирован</option>
            <option value="draft">Черновик</option>
          </select>
          {formErrors.status && (
            <p className="text-red-500 text-sm mt-1">{formErrors.status.message?.toString()}</p>
          )}
        </div>
      </div>
      
      {/* Цена */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена (EUR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register('price.value')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Например: 250000"
            min="0"
            step="1000"
          />
          {formErrors.price?.value && (
            <p className="text-red-500 text-sm mt-1">{formErrors.price.value.message?.toString()}</p>
          )}
        </div>
      </div>
      
      {/* Описание объекта */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание (RU)
        </label>
        <textarea
          {...register('description.ru')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Подробное описание объекта недвижимости..."
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание (EN)
        </label>
        <textarea
          {...register('description.en')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Detailed property description..."
        ></textarea>
      </div>
    </div>
  );
};

export default BasicInfoStep; 