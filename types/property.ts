export interface Property {
  id: string;
  title: {
    es: string;
    en: string;
    ru: string;
  };
  description: {
    es: string;
    en: string;
    ru: string;
  };
  type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
  location: {
    region: string;
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
  price: {
    value: number;
    currency: 'EUR';
  };
  status: 'active' | 'sold' | 'reserved' | 'draft';
  features: {
    bedrooms: number;
    bathrooms: number;
    totalArea: number;
    landArea?: number;
    floor?: number;
    totalFloors?: number;
    hasPool?: boolean;
    hasGarage?: boolean;
    hasTerrace?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasSeaView?: boolean;
    distanceToSea?: number;
    yearBuilt?: number;
    yearRenovated?: number;
    energyRating?: string;
    customFeatures: string[];
  };
  images: {
    id: string;
    url: string;
    thumbnailUrl: string;
    isMain: boolean;
    order: number;
  }[];
  virtualTourUrl?: string;
  
  // Настройки отображения на главной странице
  homepageDisplay: {
    // Показывать ли этот объект на главной странице при ручном выборе
    showOnHomepage: boolean;
    // Приоритет при выборе объектов для главной (выше число - выше в списке)
    homepagePriority: number;
  };

  // Статистика просмотров для алгоритма "наиболее просматриваемые"
  viewsStats: {
    totalViews: number;
    lastWeekViews: number;
    lastMonthViews: number;
    // История просмотров по дням для продвинутой аналитики
    viewsHistory: {
      date: string;
      count: number;
    }[];
  };
  
  seo: {
    title: {
      es: string;
      en: string;
      ru: string;
    };
    description: {
      es: string;
      en: string;
      ru: string;
    };
    keywords: {
      es: string;
      en: string;
      ru: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
  changeHistory: {
    timestamp: string;
    userId: string;
    userName: string;
    changes: any;
  }[];
}

// Типы для настроек отображения объектов на главной странице
export type HomepageDisplayMode = 'random' | 'manual' | 'most_viewed';

export interface HomepagePropertiesSettings {
  // Режим отображения объектов на главной странице
  displayMode: HomepageDisplayMode;
  // Количество объектов для отображения
  numberOfProperties: number;
  // Список ID объектов для ручного режима
  manuallySelectedIds?: string[];
  // Период для расчета популярности при использовании most_viewed
  popularityPeriod?: 'week' | 'month' | 'all_time';
  // Фильтры для выбора объектов в режимах random и most_viewed
  filters?: {
    types?: Array<Property['type']>;
    regions?: string[];
    priceRange?: {
      min?: number;
      max?: number;
    };
    onlyActive?: boolean; // Показывать только активные объекты
  };
  // Последнее обновление настроек
  lastUpdated: string;
  // Пользователь, который последний раз обновил настройки
  lastUpdatedBy: string;
} 