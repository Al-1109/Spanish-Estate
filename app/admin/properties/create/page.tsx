'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiSave, FiEye, FiX, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/types/property';
import { FormProvider, useForm } from 'react-hook-form';
import { createProperty, updateProperty, getPropertyById } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import BasicInfoStep from './components/BasicInfoStep';
import LocationStep from './components/LocationStep';
import FeaturesStep from './components/FeaturesStep';
import ImagesStep from './components/ImagesStep';
import HomepageSettingsStep from './components/HomepageSettingsStep';
import SEOStep from './components/SEOStep';
import { useRouter, useSearchParams } from 'next/navigation';
import PreviewDrawer from '@/components/PreviewDrawer';
import PropertyPreview from '@/components/PropertyPreview';
import Script from 'next/script';

// Интерфейс шага формы
interface FormStep {
  id: string;
  title: string;
  component: React.ReactNode;
}

// Начальное состояние объекта недвижимости
const initialProperty: Partial<Property> = {
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
  status: 'draft',
  features: {
    bedrooms: 0,
    bathrooms: 0,
    totalArea: 0,
    customFeatures: []
  },
  images: [],
  homepageDisplay: {
    showOnHomepage: false,
    homepagePriority: 0
  },
  viewsStats: {
    totalViews: 0,
    lastWeekViews: 0,
    lastMonthViews: 0,
    viewsHistory: []
  },
  seo: {
    title: { ru: '', en: '', es: '' },
    description: { ru: '', en: '', es: '' },
    keywords: { ru: '', en: '', es: '' }
  }
};

// Индексы шагов для сохранения последнего шага в объекте
const STEP_INDICES = {
  'basic-info': 0,
  'location': 1,
  'features': 2,
  'images': 3,
  'homepage-settings': 4,
  'seo': 5
};

// Компонент для отображения ошибок валидации
const ErrorDisplay = ({ errors }: { errors: Record<string, any> }) => {
  if (Object.keys(errors).length === 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-6">
      <div className="flex items-center mb-2">
        <FiAlertCircle className="text-red-500 mr-2" />
        <h3 className="font-medium text-red-800">Пожалуйста, исправьте следующие ошибки:</h3>
      </div>
      <ul className="list-disc list-inside text-sm text-red-700 ml-2">
        {Object.entries(errors).map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default function CreatePropertyPage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [propertyData, setPropertyData] = useState<Partial<Property>>(initialProperty);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(6).fill(false));
  const [isStepSaving, setIsStepSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализация react-hook-form
  const methods = useForm<Partial<Property>>({
    defaultValues: initialProperty
  });

  // Проверяем, есть ли ID в параметрах запроса (для режима редактирования)
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setPropertyId(id);
      setIsEditMode(true);
      loadPropertyData(id);
    }
  }, [searchParams]);

  // Загрузка данных объекта для редактирования
  const loadPropertyData = async (id: string) => {
    try {
      setLoading(true);
      const result = await getPropertyById(id);
      
      if (result.success && result.data) {
        const property = result.data;
        console.log('Loaded property data:', property);
        console.log('lastEditStep в загруженном объекте:', property.lastEditStep);
        
        // Устанавливаем данные объекта
        methods.reset(property);
        setPropertyData(property);
        
        // Определяем заполненные шаги
        const newCompletedSteps = [...completedSteps];
        
        // Шаг 1: Основная информация
        if (property.title?.ru && property.title?.ru.trim() !== '' && 
            property.type && 
            property.price?.value && property.price.value > 0) {
          newCompletedSteps[0] = true;
        } else {
          newCompletedSteps[0] = false;
        }
        
        // Шаг 2: Расположение
        if (property.location?.region && property.location.region.trim() !== '' && 
            property.location?.city && property.location.city.trim() !== '' && 
            property.location?.address && property.location.address.trim() !== '') {
          newCompletedSteps[1] = true;
        } else {
          newCompletedSteps[1] = false;
        }
        
        // Шаг 3: Характеристики
        if (property.features?.totalArea && property.features.totalArea > 0) {
          newCompletedSteps[2] = true;
        } else {
          newCompletedSteps[2] = false;
        }
        
        // Шаг 4: Изображения
        if (property.images && property.images.length > 0) {
          newCompletedSteps[3] = true;
        } else {
          newCompletedSteps[3] = false;
        }
        
        // Шаг 5: Настройки главной
        if (property.homepageDisplay && 
            property.homepageDisplay.showOnHomepage === true && 
            typeof property.homepageDisplay.homepagePriority === 'number' && 
            property.homepageDisplay.homepagePriority > 0) {
          newCompletedSteps[4] = true;
        } else {
          // Шаг настроек главной не считаем заполненным по умолчанию
          newCompletedSteps[4] = false;
        }
        
        // Шаг 6: SEO
        if (property.seo?.title?.ru && property.seo.title.ru.trim() !== '' || 
            property.seo?.description?.ru && property.seo.description.ru.trim() !== '') {
          newCompletedSteps[5] = true;
        } else {
          newCompletedSteps[5] = false;
        }
        
        console.log('Completed steps after evaluation:', newCompletedSteps);
        
        // Устанавливаем новое состояние заполненных шагов
        setCompletedSteps(newCompletedSteps);
        
        // Устанавливаем шаг редактирования
        let startStep = 0;
        
        console.log('formSteps.length:', formSteps.length);
        
        const maxStepIndex = formSteps.length - 1;
        
        // 1. Приоритетно используем параметр step из URL
        if (searchParams.get('step')) {
          const stepParam = parseInt(searchParams.get('step') || '0');
          console.log('Параметр step в URL:', stepParam);
          if (!isNaN(stepParam) && stepParam >= 0 && stepParam <= maxStepIndex) {
            startStep = stepParam;
            console.log('Установка шага из URL параметра:', startStep);
          }
        }
        // 2. Если нет параметра в URL, используем lastEditStep из объекта
        else if ((property.lastEditStep !== undefined && property.lastEditStep >= 0) || property.lastEditStep === 0) {
          // Явно проверяем случай, когда lastEditStep = 0
          const step = property.lastEditStep;
          if (step >= 0 && step <= maxStepIndex) {
            console.log('Установка шага из сохраненного lastEditStep:', step);
            startStep = step;
          }
        }
        // 3. Иначе находим первый незаполненный шаг
        else {
          const firstIncompleteStep = newCompletedSteps.findIndex(step => !step);
          startStep = firstIncompleteStep === -1 ? 0 : firstIncompleteStep;
          console.log('Установка шага на первый незаполненный:', startStep);
        }
        
        setCurrentStep(startStep);
        
        showToast({
          type: 'success',
          message: 'Объект загружен для редактирования',
          duration: 2000
        });
      } else {
        console.error('Объект недвижимости не найден:', id);
        showToast({
          type: 'error',
          message: 'Объект недвижимости не найден. Пожалуйста, создайте новый объект.',
          duration: 5000
        });
        
        // Перенаправляем на страницу создания нового объекта
        setTimeout(() => {
          router.push('/admin/properties/create');
        }, 1000);
        
        // Сбрасываем формы и состояние
        methods.reset(initialProperty);
        setPropertyData(initialProperty);
        setIsEditMode(false);
        setPropertyId(null);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      showToast({
        type: 'error',
        message: 'Произошла ошибка при загрузке объекта. Создайте новый объект.',
        duration: 3000
      });
      
      // Перенаправляем на страницу создания нового объекта
      setTimeout(() => {
        router.push('/admin/properties/create');
      }, 1000);
      
      // Сбрасываем формы и состояние
      methods.reset(initialProperty);
      setPropertyData(initialProperty);
      setIsEditMode(false);
      setPropertyId(null);
      setCurrentStep(0);
    } finally {
      setLoading(false);
    }
  };

  // Синхронизация данных из react-hook-form с состоянием компонента
  useEffect(() => {
    const subscription = methods.watch((value) => {
      if (value) {
        // Не заменяем все данные, а только обновляем измененные поля
        setPropertyData((prevData: Partial<Property>) => {
          const updatedData = { ...prevData };
          // Проходим по всем ключам value и обновляем только измененные
          Object.entries(value).forEach(([key, val]) => {
            if (val !== undefined) {
              updatedData[key as keyof Property] = val as any;
            }
          });
          return updatedData;
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [methods]);

  // Функция для отображения типа объекта в читаемом виде
  const getPropertyTypeDisplayName = (type?: string) => {
    if (!type) return 'Не указан';
    
    const typeMap: Record<string, string> = {
      'apartment': 'Квартира',
      'house': 'Дом',
      'villa': 'Вилла',
      'commercial': 'Коммерческая недвижимость',
      'land': 'Земельный участок'
    };
    
    return typeMap[type] || type; // Если тип пользовательский, показываем его как есть
  };

  // Определяем шаги формы
  const formSteps: FormStep[] = [
    {
      id: 'basic-info',
      title: 'Основная информация',
      component: (
        <BasicInfoStep 
          property={propertyData} 
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    },
    {
      id: 'location',
      title: 'Расположение',
      component: (
        <LocationStep 
          property={propertyData}
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    },
    {
      id: 'features',
      title: 'Характеристики',
      component: (
        <FeaturesStep 
          property={propertyData} 
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    },
    {
      id: 'images',
      title: 'Изображения',
      component: (
        <ImagesStep 
          property={propertyData} 
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    },
    {
      id: 'homepage-settings',
      title: 'Настройки главной',
      component: (
        <HomepageSettingsStep 
          property={propertyData} 
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    },
    {
      id: 'seo',
      title: 'SEO и мета-данные',
      component: (
        <SEOStep 
          property={propertyData} 
          setProperty={(updateData) => {
            // Принудительно обновляем состояние
            setPropertyData(prev => ({ ...prev, ...updateData }));
            // Обновляем данные в форме
            methods.reset({ ...propertyData, ...updateData });
          }}
          errors={errors}
        />
      )
    }
  ];

  // Валидация текущего шага
  const validateCurrentStep = async (): Promise<boolean> => {
    const currentStepId = formSteps[currentStep].id;
    console.log('Validating step:', currentStepId, 'Current data:', propertyData);
    
    // Устанавливаем правила валидации для текущего шага
    let isValid = false;
    let newErrors: Record<string, any> = {};
    
    if (currentStepId === 'basic-info') {
      // Валидация основной информации
      if (!propertyData.title?.ru || propertyData.title.ru.trim() === '') {
        newErrors['title.ru'] = 'Название объекта на русском обязательно';
      }
      
      if (!propertyData.price?.value || propertyData.price.value <= 0) {
        newErrors['price.value'] = 'Укажите корректную цену';
      }
      
      // Дополнительно можно проверить другие языки и тип объекта
      isValid = Object.keys(newErrors).length === 0;
    }
    else if (currentStepId === 'location') {
      // Валидация местоположения
      if (!propertyData.location?.region || propertyData.location.region.trim() === '') {
        newErrors['location.region'] = 'Укажите регион';
      }
      
      if (!propertyData.location?.city || propertyData.location.city.trim() === '') {
        newErrors['location.city'] = 'Укажите город';
      }
      
      if (!propertyData.location?.address || propertyData.location.address.trim() === '') {
        newErrors['location.address'] = 'Укажите адрес';
      }
      
      isValid = Object.keys(newErrors).length === 0;
    }
    else if (currentStepId === 'features') {
      // Валидация характеристик
      if (!propertyData.features?.totalArea || propertyData.features.totalArea <= 0) {
        newErrors['features.totalArea'] = 'Укажите общую площадь';
      }
      
      isValid = Object.keys(newErrors).length === 0;
    }
    else {
      // Другие шаги пока без дополнительной валидации
      isValid = true;
    }
    
    // Устанавливаем ошибки для отображения
    setErrors(newErrors);
    
    // Также делаем валидацию через react-hook-form
    const hookFormValid = await methods.trigger();
    
    return isValid && hookFormValid;
  };

  // Сохранение текущего шага и переход к следующему
  const saveCurrentStepAndNext = async () => {
    try {
      setIsStepSaving(true);
      const isValid = await validateCurrentStep();
      
      if (!isValid) {
        setIsStepSaving(false);
        return;
      }
      
      // Получаем текущие значения формы
      const formValues = methods.getValues();
      console.log('Current form values:', formValues);
      
      // Обновляем локальное состояние
      const updatedPropertyData = {
        ...propertyData,
        ...formValues,
        lastEditStep: currentStep // Сохраняем текущий шаг
      };
      
      // Отладка значения lastEditStep
      console.log('Setting lastEditStep to:', currentStep);
      console.log('updatedPropertyData.lastEditStep:', updatedPropertyData.lastEditStep);
      
      setPropertyData(updatedPropertyData);
      
      // Создание объекта, если это первое сохранение
      if (!isEditMode || !propertyId) {
        console.log('Создание нового объекта...');
        setIsSaving(true);
        
        const result = await createProperty(updatedPropertyData);
        
        setIsSaving(false);
        
        if (result.success && result.data) {
          console.log('Новый объект создан с ID:', result.data.id);
          
          // Устанавливаем режим редактирования и ID объекта
          setIsEditMode(true);
          setPropertyId(result.data.id);
          
          // Отмечаем текущий шаг как выполненный
          const newCompletedSteps = [...completedSteps];
          newCompletedSteps[currentStep] = true;
          setCompletedSteps(newCompletedSteps);
          
          // Обновляем URL для режима редактирования
          const nextStep = currentStep + 1;
          updateUrlWithStep(nextStep);
          
          // Переходим к следующему шагу
          setCurrentStep(nextStep);
          
          showToast({
            type: 'success',
            message: 'Объект успешно создан',
            duration: 2000
          });
        } else {
          console.error('Ошибка создания объекта:', result.message);
          showToast({
            type: 'error',
            message: `Ошибка создания объекта: ${result.message || 'Неизвестная ошибка'}`,
            duration: 3000
          });
        }
      } 
      // Обновление существующего объекта
      else {
        console.log(`Обновление объекта с ID: ${propertyId}, устанавливаем lastEditStep=${currentStep}`);
        setIsSaving(true);
        
        try {
          const result = await updateProperty(propertyId, updatedPropertyData);
          
          if (result.success && result.data) {
            console.log('Объект успешно обновлен, lastEditStep в ответе:', result.data.lastEditStep);
            
            // Отмечаем текущий шаг как выполненный
            const newCompletedSteps = [...completedSteps];
            newCompletedSteps[currentStep] = true;
            setCompletedSteps(newCompletedSteps);
            
            // Обновляем URL с новым шагом
            const nextStep = currentStep + 1;
            updateUrlWithStep(nextStep);
            
            // Переходим к следующему шагу
            setCurrentStep(nextStep);
            
            showToast({
              type: 'success',
              message: 'Изменения сохранены',
              duration: 2000
            });
          } else {
            console.error('Ошибка обновления объекта:', result.message);
            
            // Проверяем, существует ли объект
            if (result.message?.includes('not found')) {
              showToast({
                type: 'error',
                message: 'Объект недвижимости не найден. Создаем новый объект.',
                duration: 3000
              });
              
              // Сбрасываем режим редактирования
              setIsEditMode(false);
              setPropertyId(null);
              
              // Создаем новый объект
              const createResult = await createProperty(updatedPropertyData);
              
              if (createResult.success && createResult.data) {
                console.log('Новый объект создан с ID:', createResult.data.id);
                setIsEditMode(true);
                setPropertyId(createResult.data.id);
                
                // Отмечаем текущий шаг как выполненный
                const newCompletedSteps = [...completedSteps];
                newCompletedSteps[currentStep] = true;
                setCompletedSteps(newCompletedSteps);
                
                // Переходим к следующему шагу
                const nextStep = currentStep + 1;
                updateUrlWithStep(nextStep);
                setCurrentStep(nextStep);
                
                showToast({
                  type: 'success',
                  message: 'Новый объект успешно создан',
                  duration: 2000
                });
              } else {
                showToast({
                  type: 'error',
                  message: `Ошибка создания объекта: ${createResult.message || 'Неизвестная ошибка'}`,
                  duration: 3000
                });
              }
            } else {
              showToast({
                type: 'error',
                message: `Ошибка сохранения данных: ${result.message || 'Неизвестная ошибка'}`,
                duration: 3000
              });
            }
          }
        } catch (error) {
          console.error('Ошибка при обновлении объекта:', error);
          showToast({
            type: 'error',
            message: 'Непредвиденная ошибка при сохранении данных',
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error('Error in saveCurrentStepAndNext:', error);
      showToast({
        type: 'error',
        message: 'Произошла ошибка при сохранении',
        duration: 3000
      });
    } finally {
      setIsStepSaving(false);
      setIsSaving(false);
    }
  };

  // Обновление URL с параметром шага
  const updateUrlWithStep = (step: number) => {
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('step', step.toString());
      window.history.pushState({}, '', url.toString());
    }
  };

  // Переход на предыдущий шаг с полным обновлением данных
  const handlePrevStep = () => {
    if (currentStep > 0) {
      try {
        // Сохраняем текущие данные формы
        const formData = methods.getValues();
        console.log("Назад - получены текущие данные формы:", formData);
        
        // Слияние данных
        const mergedData = { ...propertyData };
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== undefined) {
            mergedData[key as keyof Property] = val as any;
          }
        });
        
        // Сразу обновляем состояние компонента
        setPropertyData(mergedData);
        console.log("Назад - обновлено состояние с данными:", mergedData);
        
        // Переходим на предыдущий шаг
        const newStep = currentStep - 1;
        setCurrentStep(newStep);
        updateUrlWithStep(newStep);
        
        // Принудительно обновляем форму ПОСЛЕ изменения состояния и перехода
        setTimeout(() => {
          console.log("Назад - сброс формы с полными данными");
          methods.reset(mergedData);
          
          // Дополнительная проверка синхронизации
          setTimeout(() => {
            const formValues = methods.getValues();
            console.log("Назад - проверка данных формы после обновления:", formValues);
          }, 100);
        }, 50);
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Ошибка при переходе назад:", error);
      }
    }
  };

  // Функция для перехода к конкретному шагу
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < formSteps.length) {
      try {
        // Сохраняем текущие данные формы
        const formData = methods.getValues();
        console.log("Переход к шагу - получены текущие данные формы:", formData);
        
        // Слияние данных
        const mergedData = { ...propertyData };
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== undefined) {
            mergedData[key as keyof Property] = val as any;
          }
        });
        
        // Сразу обновляем состояние компонента
        setPropertyData(mergedData);
        console.log("Переход к шагу - обновлено состояние с данными:", mergedData);
        
        // Переходим на выбранный шаг
        setCurrentStep(stepIndex);
        updateUrlWithStep(stepIndex);
        
        // Принудительно обновляем форму ПОСЛЕ изменения состояния и перехода
        setTimeout(() => {
          console.log("Переход к шагу - сброс формы с полными данными");
          methods.reset(mergedData);
          
          // Дополнительная проверка синхронизации
          setTimeout(() => {
            const formValues = methods.getValues();
            console.log("Переход к шагу - проверка данных формы после обновления:", formValues);
          }, 100);
        }, 50);
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Ошибка при переходе к шагу:", error);
      }
    }
  };

  // Проверка, все ли шаги заполнены
  const areAllStepsCompleted = () => {
    return completedSteps.every(step => step);
  };

  // Валидация всех шагов и отправка формы
  const validateAllAndSubmit = async (shouldPublish = false) => {
    try {
      setIsSaving(true);

      // Проверяем все шаги на валидность
      for (let i = 0; i < formSteps.length; i++) {
        setCurrentStep(i);
        const isStepValid = await validateCurrentStep();
        if (!isStepValid) {
          setIsSaving(false);
          return;
        }
      }

      // Все шаги валидны, отправляем данные
      // Если shouldPublish = true, то публикуем объект, иначе сохраняем как черновик
      const propertyToSave = {
        ...propertyData,
        status: shouldPublish ? PropertyStatus.PUBLISHED : PropertyStatus.DRAFT,
        lastEditStep: currentStep // Сохраняем последний редактируемый шаг
      };

      let result;
      
      if (isEditMode && propertyId) {
        result = await updateProperty(propertyId, propertyToSave);
      } else {
        result = await createProperty(propertyToSave);
      }

      if (result.success && result.data) {
        // Успешно создано или обновлено
        showToast({
          type: 'success',
          message: isEditMode 
            ? (shouldPublish ? 'Объект успешно обновлен и опубликован' : 'Объект успешно обновлен') 
            : (shouldPublish ? 'Объект успешно создан и опубликован' : 'Объект успешно сохранен как черновик'),
          duration: 5000
        });

        // Перенаправляем на страницу объекта
        const id = isEditMode ? propertyId : result.data.id;
        router.push(`/admin/properties/${id}`);
      } else {
        // Ошибка создания или обновления
        setIsSaving(false);
        showToast({
          type: 'error',
          message: `Ошибка при ${isEditMode ? 'обновлении' : 'создании'} объекта: ${result.message}`,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSaving(false);
      showToast({
        type: 'error',
        message: `Произошла ошибка при ${isEditMode ? 'обновлении' : 'сохранении'} объекта`,
        duration: 5000
      });
    }
  };

  // В начале компонента, после определения состояний и хуков
  useEffect(() => {
    // При первой загрузке страницы, восстанавливаем данные из localStorage если они есть
    const storedData = localStorage.getItem('property_form_data');
    if (storedData && !isEditMode) {
      try {
        const parsedData = JSON.parse(storedData);
        methods.reset(parsedData);
      } catch (e) {
        console.error('Ошибка при восстановлении данных формы:', e);
        localStorage.removeItem('property_form_data');
      }
    }
    
    // Очищаем данные при размонтировании компонента
    return () => {
      // Опционально можно оставить данные в localStorage
      // localStorage.removeItem('property_form_data');
    };
  }, []);

  // Если данные загружаются
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка данных объекта недвижимости...</p>
        </div>
      </div>
    );
  }

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
                  {isEditMode ? `Редактирование объекта: ${propertyData.title?.ru || 'Без названия'}` : 'Добавление нового объекта недвижимости'}
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
                        // Определяем доступность шага на основе заполненных предыдущих шагов
                        let isStepAccessible = false;
                        
                        if (index === 0) {
                          // Первый шаг всегда доступен
                          isStepAccessible = true;
                        } else if (index === currentStep) {
                          // Текущий шаг доступен
                          isStepAccessible = true;
                        } else if (index === currentStep + 1 && completedSteps[currentStep]) {
                          // Следующий шаг доступен только если текущий заполнен
                          isStepAccessible = true;
                        } else if (index < currentStep) {
                          // Предыдущие шаги доступны
                          isStepAccessible = true;
                        } else {
                          // Все остальные шаги недоступны
                          isStepAccessible = false;
                        }
                        
                        // Определяем класс для активного шага и завершенных шагов
                        let stepClass = '';
                        if (index === currentStep) {
                          stepClass = 'bg-blue-100 text-blue-800 font-medium';
                        } else if (completedSteps[index]) {
                          stepClass = 'hover:bg-gray-100 text-green-700';
                        } else if (isStepAccessible) {
                          stepClass = 'hover:bg-gray-100 text-gray-800';
                        } else {
                          stepClass = 'text-gray-400 cursor-not-allowed opacity-60';
                        }
                        
                        return (
                          <button
                            key={step.id}
                            className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center ${stepClass}`}
                            onClick={() => {
                              if (isStepAccessible) {
                                goToStep(index);
                              }
                            }}
                            disabled={!isStepAccessible}
                          >
                            <span className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-xs border border-current mr-2 ${
                              completedSteps[index] ? 'bg-green-100 text-green-700' : 'bg-white'
                            }`}>
                              {completedSteps[index] ? '✓' : index + 1}
                            </span>
                            <span>{step.title}</span>
                          </button>
                        );
                      })}
                    </nav>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">
                        Текущий статус: <span className="font-medium text-gray-800">
                          {propertyData.status === PropertyStatus.PUBLISHED ? 'Активен' :
                          propertyData.status === PropertyStatus.DRAFT ? 'Черновик' :
                          propertyData.status === PropertyStatus.SOLD ? 'Продан' :
                          propertyData.status === PropertyStatus.ARCHIVED ? 'Архивирован' : 'Черновик'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {areAllStepsCompleted() 
                          ? 'Все этапы заполнены. Вы можете опубликовать объект.' 
                          : 'Заполните все этапы последовательно, чтобы опубликовать объект.'}
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
                      {/* Отображение ошибок */}
                      {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-md p-4 mb-6">
                          <div className="flex items-center mb-2">
                            <FiAlertCircle className="text-red-500 mr-2" />
                            <h3 className="font-medium text-red-800">Пожалуйста, исправьте следующие ошибки:</h3>
                          </div>
                          <ul className="list-disc list-inside text-sm text-red-700 ml-2">
                            {Object.entries(errors).map(([field, message]) => (
                              <li key={field}>{message}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
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
                        {/* Кнопка предпросмотра доступна всегда при заполненных полях */}
                        {propertyData && propertyData.title && propertyData.title.ru && (
                          <>
                            <button 
                              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                              onClick={() => setShowPreview(true)}
                            >
                              <FiEye /> Предпросмотр
                            </button>
                          </>
                        )}
                      
                        {currentStep < formSteps.length - 1 ? (
                          <button
                            className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                              isStepSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                            onClick={saveCurrentStepAndNext}
                            disabled={isStepSaving}
                          >
                            {isStepSaving ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Сохранение...
                              </>
                            ) : (
                              <>
                                Сохранить и продолжить <FiArrowRight className="inline" />
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {/* Кнопка предпросмотра также на последнем шаге */}
                            {propertyData && propertyData.title && propertyData.description && (
                              <button 
                                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                                onClick={() => setShowPreview(true)}
                                disabled={isSaving}
                              >
                                <FiEye /> Предпросмотр
                              </button>
                            )}
                            
                            {areAllStepsCompleted() && (
                              <button 
                                className={`bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                                  isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                                }`}
                                onClick={() => validateAllAndSubmit(true)}
                                disabled={isSaving}
                              >
                                <FiSave /> {isSaving ? 'Публикация...' : 'Опубликовать'}
                              </button>
                            )}
                            
                            <button 
                              className={`bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                                isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
                              }`}
                              onClick={() => validateAllAndSubmit(false)}
                              disabled={isSaving}
                            >
                              <FiSave /> {isSaving ? 'Сохранение...' : 'Сохранить как черновик'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormProvider>
            
            {/* Панель предпросмотра объекта недвижимости */}
            {showPreview && propertyData && propertyData.title && propertyData.description && (
              <PreviewDrawer 
                property={propertyData as Property} 
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                source="edit"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 