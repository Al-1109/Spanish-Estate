# Ветка admin-panel: Разработка административной панели Spanish Estate

> **Примечание:** Глобальное описание проекта и его текущий статус находятся в файлах [README.md](./README.md) и [STATUS.md](./STATUS.md) в основной ветке.

## Цель рабочей ветки
Разработка полноценной административной панели с системой аутентификации администраторов для управления содержимым сайта. Панель должна предоставлять интерфейс для всех разделов сайта с возможностью последующей интеграции ИИ-помощника.

## Концепция административной панели

Административная панель разрабатывается на основе следующих принципов:
1. Простой, интуитивно понятный интерфейс
2. Безопасная система аутентификации и разграничения ролей
3. Модульная структура с чётким разделением разделов управления
4. Подготовленные точки расширения для будущей интеграции ИИ-автоматизации

## Стадии разработки

Разработка административной панели будет происходить в три основных этапа:

### Этап 1: Базовая структура и аутентификация
- Реализация системы аутентификации через Supabase Auth
- Разработка базового макета панели с боковым меню
- Создание защищенных маршрутов и middleware для проверки прав доступа

### Этап 2: Функциональные модули управления контентом
- Разработка модуля управления объектами недвижимости
- Создание интерфейса для управления секциями главной страницы
- Реализация модуля управления статьями и контентом
- Настройка модуля управления ИИ-консультантом

### Этап 3: Интеграция с API и оптимизация
- Создание серверных API-маршрутов для всех функций управления
- Оптимизация производительности панели администратора
- Внедрение уведомлений о действиях и журналирования

## Задачи для текущей ветки

### 1. Система аутентификации
- [x] Создание страницы входа для администраторов
- [x] Интеграция с Supabase Auth
- [x] Настройка middleware для защиты маршрутов
- [x] Реализация проверки ролей пользователей
- [x] Функционал сброса пароля и обновления профиля

### 2. Структура и базовая навигация
- [x] Разработка основного макета (layout) панели администратора
- [x] Создание бокового меню с разделами
- [x] Реализация шапки с информацией о пользователе
- [x] Настройка маршрутизации между разделами
- [x] Добавление функции выхода из учетной записи

### 3. Модуль управления недвижимостью
- [ ] Страница со списком всех объектов недвижимости
- [ ] Интерфейс для создания нового объекта
- [ ] Форма редактирования существующих объектов
- [ ] Функционал загрузки и управления изображениями
- [ ] Возможность скрытия/публикации/удаления объектов

### 4. Безопасность и права доступа
- [x] Настройка системы разграничения прав доступа
- [ ] Защита API-эндпоинтов
- [ ] Валидация входных данных
- [ ] Журналирование действий администраторов

## Техническая спецификация

### Технологии
- Next.js 13.4.19 (App Router)
- React 18.2.0
- TypeScript
- Tailwind CSS
- Supabase (БД и аутентификация)
- React Hook Form (для форм)
- Zod (для валидации)

### Структура административной панели

```
/admin
├── /dashboard                 # Сводная статистика и быстрые действия
├── /properties                # Управление объектами недвижимости
│   ├── /                      # Список всех объектов
│   ├── /create                # Создание нового объекта
│   └── /[id]/edit             # Редактирование объекта
├── /content                   # Управление контентом главной страницы
│   ├── /hero                  # Настройки баннера
│   ├── /features              # Настройки блока преимуществ
│   ├── /showcase              # Настройки отображаемых объектов
│   └── /footer                # Настройки футера
├── /articles                  # Управление статьями блога
├── /ai                        # Настройки ИИ-консультанта
├── /media                     # Медиа-библиотека
├── /settings                  # Общие настройки сайта
└── /users                     # Управление администраторами
```

### API для управления контентом

Базовая структура API для панели администратора:

```
/api/admin
├── /auth                      # Аутентификация
├── /properties                # Управление объектами недвижимости
├── /content                   # Управление контентом главной страницы
├── /articles                  # Управление статьями
├── /media                     # Управление медиафайлами
└── /settings                  # Управление настройками
```

## План дальнейшей разработки админ-панели

### Этап 1: Базовая структура админ-панели

1. **Создание страницы входа для администраторов** ✅
   - Разработка формы аутентификации (логин/пароль) ✅
   - Интеграция с Supabase Auth для аутентификации ✅
   - Настройка проверки ролей (admin/user) ✅

2. **Разработка базового шаблона административной панели** ✅
   - Создание макета с боковым меню навигации ✅
   - Разработка хедера с информацией о пользователе и выходом ✅
   - Реализация основной области контента с динамической загрузкой ✅

3. **Настройка маршрутизации для админ-панели** ✅
   - Создание защищенных маршрутов с проверкой аутентификации ✅
   - Реализация структуры маршрутов согласно планируемым разделам ✅
   - Настройка перенаправления для неаутентифицированных пользователей ✅

### Этап 2: Базовая функциональность для управления контентом

1. **Раздел управления объектами недвижимости** (ключевой компонент) 🔄
   - Создание списка всех объектов с фильтрацией и сортировкой
   - Форма создания/редактирования объекта недвижимости
   - Загрузка и управление изображениями объектов
   - Реализация удаления/архивирования объектов

2. **Раздел управления секциями главной страницы**
   - Создание интерфейса для редактирования баннера (HeroSection)
   - Управление блоком преимуществ (FeaturesSection)
   - Настройка отображаемых объектов в разделе PropertiesSection
   - Управление статьями в ArticlesSection

3. **Настройки ИИ-консультанта**
   - Интерфейс для управления быстрыми вопросами
   - Настройка шаблонов ответов
   - Возможность просмотра истории диалогов

### Этап 3: Интеграция админ-панели с основным сайтом

1. **Создание API для получения данных**
   - Разработка API-эндпоинтов для получения объектов, статей и контента
   - Реализация фильтрации и пагинации
   - Настройка кэширования для оптимизации производительности

2. **Интеграция данных в компоненты главной страницы**
   - Обновление HeroSection для использования данных из админ-панели
   - Интеграция реальных объектов недвижимости в PropertiesSection
   - Подключение актуальных статей в ArticlesSection

## Техническое задание по разработке модуля управления недвижимостью

### 1. Цель

Создание комплексного модуля для управления объектами недвижимости с возможностью добавления, редактирования, удаления и просмотра всех объектов в админ-панели. Модуль должен обеспечивать полный цикл управления данными об объектах недвижимости, их характеристиках, изображениях и статусах.

### 2. Функциональные требования

#### 2.1. Просмотр объектов недвижимости
- Таблица со списком всех объектов недвижимости с пагинацией
- Фильтрация по:
  - Типу объекта (квартира, дом, вилла и т.д.)
  - Региону/городу
  - Ценовому диапазону
  - Статусу объекта (активен, продан, зарезервирован)
  - Количеству спален/ванных комнат
  - Площади
- Сортировка по цене, дате добавления, площади
- Поиск по названию/описанию/ID объекта
- Быстрый предпросмотр основной информации об объекте

#### 2.2. Добавление/редактирование объектов недвижимости
- Форма с полями для основных характеристик объекта:
  - Название и описание (на нескольких языках)
  - Тип объекта
  - Местоположение (регион, город, адрес, координаты)
  - Цена и статус
  - Количество спален/ванных комнат
  - Общая площадь и площадь участка
  - Особенности (бассейн, терраса, гараж и т.д.)
  - Год постройки/ремонта
  - Расстояние до моря/пляжа
  - Ссылка на виртуальный тур (при наличии)
- Возможность добавления SEO-информации
- Опция сохранения черновика

#### 2.3. Управление изображениями
- Загрузка нескольких изображений с предпросмотром
- Возможность выбора главного изображения
- Редактирование порядка отображения изображений
- Возможность обрезки и базового редактирования
- Автоматическое создание превью для оптимизации загрузки
- Поддержка больших изображений для виртуальных туров

#### 2.4. Дополнительные функции
- Возможность дублирования объекта
- Экспорт данных в CSV/Excel
- Возможность массового редактирования нескольких объектов
- Система заметок/комментариев для внутреннего использования
- История изменений объекта
- Уведомления о новых запросах по объекту

### 3. Технические требования

#### 3.1. Структура данных объекта недвижимости
```typescript
interface Property {
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
```

#### 3.2. API Endpoints

1. **GET /api/admin/properties**
   - Получение списка объектов с фильтрацией и пагинацией
   - Параметры: фильтры, сортировка, пагинация

2. **GET /api/admin/properties/:id**
   - Получение детальной информации об объекте

3. **POST /api/admin/properties**
   - Создание нового объекта недвижимости

4. **PUT /api/admin/properties/:id**
   - Обновление существующего объекта

5. **DELETE /api/admin/properties/:id**
   - Удаление объекта

6. **POST /api/admin/properties/images**
   - Загрузка изображений

7. **DELETE /api/admin/properties/images/:id**
   - Удаление изображения

8. **PUT /api/admin/properties/images/order**
   - Изменение порядка изображений

9. **PUT /api/admin/properties/status/:id**
   - Быстрое изменение статуса объекта

#### 3.3. Требования к UI/UX

1. **Страница списка объектов**
   - Таблица с основными полями и миниатюрами
   - Панель фильтров (сворачиваемая)
   - Инструменты массового редактирования
   - Пагинация и выбор количества элементов на странице
   - Индикаторы статуса объекта

2. **Страница добавления/редактирования**
   - Многошаговая форма с разделами
   - Валидация полей
   - Автосохранение черновика
   - Предпросмотр объекта в режиме реального времени
   - Drag-and-drop для изображений

3. **Компоненты**
   - Карта для выбора местоположения
   - Галерея для управления изображениями
   - Многоязычный редактор текста
   - Виджет для загрузки и обработки изображений

### 4. План реализации

#### Фаза 1: Базовая функциональность (3 дня)
- Создание структуры базы данных
- Разработка API для CRUD-операций
- Создание страницы списка объектов с базовой фильтрацией
- Реализация простой формы добавления основных полей

#### Фаза 2: Расширенная функциональность (4 дня)
- Разработка расширенной фильтрации и сортировки
- Создание полной формы с валидацией
- Реализация управления изображениями
- Внедрение многоязычности для полей

#### Фаза 3: Улучшения UX и дополнительные функции (3 дня)
- Добавление массового редактирования
- Реализация экспорта данных
- Внедрение истории изменений
- Оптимизация UI/UX интерфейса

#### Фаза 4: Тестирование и оптимизация (2 дня)
- Тестирование всех функций модуля
- Оптимизация запросов и производительности
- Исправление багов и улучшение UX
- Документирование модуля

### 5. Интеграция с существующими компонентами

- Интеграция с системой аутентификации для логов действий
- Интеграция с Supabase для хранения данных и изображений
- Интеграция с пользовательской частью сайта для отображения объектов
- Интеграция с системой уведомлений

### 6. Требования к безопасности

- Валидация всех вводимых данных
- Проверка прав доступа для всех операций
- Логирование всех изменений
- Защита от XSS и инъекций
- Безопасная загрузка и обработка изображений

### 7. Критерии приемки

- Все функциональные требования реализованы и протестированы
- Интерфейс адаптивен и работает на всех устройствах
- Время отклика API не превышает 1 секунды
- Все введенные данные корректно отображаются в пользовательской части
- Обеспечено корректное управление данными на нескольких языках
- Модуль прошел тестирование на безопасность и производительность

### 8. Метрики успеха

- Время, затрачиваемое на добавление нового объекта, не превышает 5 минут
- Время загрузки страницы со списком объектов не превышает 2 секунды
- Объем кода и сложность компонентов оптимизированы
- Пользовательский опыт оценивается как "отличный" администраторами

## Приоритеты разработки

### Приоритеты Этапа 1
1. Создание работающей системы аутентификации администраторов ✅
2. Разработка базового макета с навигацией по разделам ✅
3. Защита маршрутов от несанкционированного доступа ✅
4. Создание базовой инфраструктуры для управления данными ✅

### Приоритеты Этапа 2
1. Полноценный интерфейс управления объектами недвижимости (CRUD) 🔄
2. Возможность загрузки и управления изображениями объектов 🔄
3. Управление статусом публикации объектов 🔄
4. Базовые функции редактирования контента страниц 📝

### Приоритеты Этапа 3
1. Расширенная функциональность для всех модулей управления 📝
2. Улучшенный пользовательский интерфейс с анимациями и переходами 📝
3. Расширенные функции валидации и предварительного просмотра 📝
4. Оптимизация производительности всех операций 📝

## Критерии готовности

1. Система аутентификации администраторов работает корректно ✅
2. Все основные функциональные модули реализованы 🔄
3. API-эндпоинты защищены и правильно обрабатывают запросы 🔄
4. Пользовательский интерфейс легко понятен и не требует обучения 🔄
5. Изменения, сделанные через административную панель, корректно отображаются на сайте 📝

## План слияния с основной веткой
После завершения всех задач и успешного тестирования, данная ветка будет объединена с основной веткой `main`. При слиянии будет произведена интеграция кода административной панели, не нарушая работоспособность публичной части сайта. 

## Техническое задание по разработке UI-компонентов админ-панели с react-icons

### 1. Цель

Создание современного, интуитивно понятного пользовательского интерфейса для административной панели с использованием библиотеки react-icons, которая обеспечит единый стиль иконок во всей системе управления недвижимостью.

### 2. Компоненты пользовательского интерфейса

#### 2.1. Боковое навигационное меню

**Функциональные требования:**
- Отображение основных разделов админ-панели с соответствующими иконками
- Возможность свернуть/развернуть меню для экономии пространства
- Визуальное выделение активного раздела
- Группировка связанных разделов с возможностью разворачивания

**UI-компоненты:**
```tsx
// Основной компонент бокового меню
const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo-container">
        <Logo />
        {!collapsed && <span className="logo-text">Spain Estates</span>}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
      
      <NavigationItems collapsed={collapsed} />
    </div>
  );
};

// Компонент элементов навигации
const NavigationItems = ({ collapsed }) => {
  return (
    <nav className="nav-items">
      <NavItem 
        icon={<FiHome />} 
        label="Дашборд" 
        path="/admin/dashboard" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiHome />} 
        label="Объекты" 
        path="/admin/properties" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiLayout />} 
        label="Контент" 
        path="/admin/content" 
        collapsed={collapsed} 
        hasSubmenu
        submenuItems={[
          { icon: <FiImage />, label: "Баннер", path: "/admin/content/hero" },
          { icon: <FiStar />, label: "Преимущества", path: "/admin/content/features" },
          { icon: <FiGrid />, label: "Объекты на главной", path: "/admin/content/showcase" }
        ]}
      />
      <NavItem 
        icon={<FiFileText />} 
        label="Статьи" 
        path="/admin/articles" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiMessageSquare />} 
        label="ИИ-консультант" 
        path="/admin/ai" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiImage />} 
        label="Медиафайлы" 
        path="/admin/media" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiSettings />} 
        label="Настройки" 
        path="/admin/settings" 
        collapsed={collapsed} 
      />
      <NavItem 
        icon={<FiUsers />} 
        label="Пользователи" 
        path="/admin/users" 
        collapsed={collapsed} 
      />
    </nav>
  );
};
```

#### 2.2. Шапка (Header)

**Функциональные требования:**
- Отображение информации о текущем пользователе
- Кнопка быстрого доступа к уведомлениям
- Функция выхода из системы
- Переключение между светлой и темной темами
- Breadcrumbs для навигации

**UI-компоненты:**
```tsx
const Header = ({ title }) => {
  return (
    <header className="admin-header">
      <div className="breadcrumbs">
        <Breadcrumbs />
      </div>
      
      <div className="header-title">
        <h1>{title}</h1>
      </div>
      
      <div className="header-actions">
        <button className="theme-toggle">
          <FiSun className="light-theme-icon" />
          <FiMoon className="dark-theme-icon" />
        </button>
        
        <div className="notifications">
          <button className="notification-btn">
            <FiBell />
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="user-menu">
          <button className="user-menu-btn">
            <Avatar />
            <span className="user-name">Администратор</span>
            <FiChevronDown />
          </button>
          <div className="user-dropdown">
            <ul>
              <li><FiUser /> Профиль</li>
              <li><FiSettings /> Настройки</li>
              <li><FiLogOut /> Выйти</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
```

#### 2.3. Таблица объектов недвижимости

**Функциональные требования:**
- Отображение списка объектов с основной информацией
- Возможность сортировки по разным полям
- Функции фильтрации и поиска
- Действия для каждого объекта (редактирование, удаление, просмотр)
- Пагинация и выбор количества объектов на странице

**UI-компоненты:**
```tsx
const PropertiesTable = ({ properties, loading }) => {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Функция сортировки
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field) => {
    if (field !== sortField) return <FiChevronDown className="sort-icon" />;
    return sortDirection === 'asc' ? 
      <FiChevronUp className="sort-icon active" /> : 
      <FiChevronDown className="sort-icon active" />;
  };
  
  return (
    <div className="properties-table-container">
      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner" />
          <p>Загрузка объектов...</p>
        </div>
      ) : (
        <>
          <table className="properties-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th>Изображение</th>
                <th onClick={() => handleSort('title')}>
                  Название {getSortIcon('title')}
                </th>
                <th onClick={() => handleSort('type')}>
                  Тип {getSortIcon('type')}
                </th>
                <th onClick={() => handleSort('price.value')}>
                  Цена {getSortIcon('price.value')}
                </th>
                <th onClick={() => handleSort('location.city')}>
                  Город {getSortIcon('location.city')}
                </th>
                <th onClick={() => handleSort('status')}>
                  Статус {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('createdAt')}>
                  Дата добавления {getSortIcon('createdAt')}
                </th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id}>
                  <td>{property.id}</td>
                  <td>
                    <div className="property-image">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0].thumbnailUrl} alt={property.title.en} />
                      ) : (
                        <div className="no-image"><FiImage /></div>
                      )}
                    </div>
                  </td>
                  <td>{property.title.en}</td>
                  <td>
                    {property.type === 'apartment' && <><FiHome /> Квартира</>}
                    {property.type === 'house' && <><FiHome /> Дом</>}
                    {property.type === 'villa' && <><FiHome /> Вилла</>}
                    {property.type === 'commercial' && <><FiBriefcase /> Коммерческая</>}
                    {property.type === 'land' && <><FiMapPin /> Земля</>}
                  </td>
                  <td>€{property.price.value.toLocaleString()}</td>
                  <td>{property.location.city}</td>
                  <td>
                    <span className={`status-badge ${property.status}`}>
                      {property.status === 'active' && <><FiCheckCircle /> Активен</>}
                      {property.status === 'sold' && <><FiBarChart2 /> Продан</>}
                      {property.status === 'reserved' && <><FiClock /> Зарезервирован</>}
                      {property.status === 'draft' && <><FiEdit3 /> Черновик</>}
                    </span>
                  </td>
                  <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn view">
                        <FiEye />
                      </button>
                      <button className="action-btn edit">
                        <FiEdit />
                      </button>
                      <button className="action-btn delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="table-pagination">
            <div className="rows-per-page">
              <span>Строк на странице:</span>
              <select>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="pagination-controls">
              <button className="pagination-btn first">
                <FiChevronsLeft />
              </button>
              <button className="pagination-btn prev">
                <FiChevronLeft />
              </button>
              <div className="pagination-pages">
                <span className="current-page">1</span>
                <span>из</span>
                <span className="total-pages">10</span>
              </div>
              <button className="pagination-btn next">
                <FiChevronRight />
              </button>
              <button className="pagination-btn last">
                <FiChevronsRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
```

#### 2.4. Фильтры для списка объектов

**Функциональные требования:**
- Фильтрация по различным параметрам объектов
- Возможность сохранения пользовательских фильтров
- Быстрая очистка всех фильтров
- Сворачиваемая панель фильтров

**UI-компоненты:**
```tsx
const PropertiesFilters = ({ onApplyFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    priceRange: { min: '', max: '' },
    location: { region: '', city: '' },
    features: {
      bedrooms: { min: '', max: '' },
      bathrooms: { min: '', max: '' },
      hasPool: null,
      hasGarage: null,
      hasSeaView: null
    }
  });
  
  const handleTypeChange = (type) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    
    setFilters({
      ...filters,
      type: newTypes
    });
  };
  
  const handleReset = () => {
    setFilters({
      type: [],
      status: [],
      priceRange: { min: '', max: '' },
      location: { region: '', city: '' },
      features: {
        bedrooms: { min: '', max: '' },
        bathrooms: { min: '', max: '' },
        hasPool: null,
        hasGarage: null,
        hasSeaView: null
      }
    });
  };
  
  return (
    <div className={`filters-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="filters-header">
        <h3><FiFilter /> Фильтры</h3>
        <button 
          className="toggle-filters-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="filters-content">
          <div className="filter-section">
            <h4>Тип объекта</h4>
            <div className="filter-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes('apartment')}
                  onChange={() => handleTypeChange('apartment')}
                />
                <FiHome /> Квартира
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes('house')}
                  onChange={() => handleTypeChange('house')}
                />
                <FiHome /> Дом
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes('villa')}
                  onChange={() => handleTypeChange('villa')}
                />
                <FiHome /> Вилла
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes('commercial')}
                  onChange={() => handleTypeChange('commercial')}
                />
                <FiBriefcase /> Коммерческая
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.type.includes('land')}
                  onChange={() => handleTypeChange('land')}
                />
                <FiMapPin /> Земля
              </label>
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Цена, €</h4>
            <div className="price-range">
              <input 
                type="number" 
                placeholder="От" 
                value={filters.priceRange.min}
                onChange={(e) => setFilters({
                  ...filters, 
                  priceRange: {...filters.priceRange, min: e.target.value}
                })}
              />
              <span className="range-separator">-</span>
              <input 
                type="number" 
                placeholder="До" 
                value={filters.priceRange.max}
                onChange={(e) => setFilters({
                  ...filters, 
                  priceRange: {...filters.priceRange, max: e.target.value}
                })}
              />
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Местоположение</h4>
            <select 
              value={filters.location.region}
              onChange={(e) => setFilters({
                ...filters, 
                location: {...filters.location, region: e.target.value}
              })}
            >
              <option value="">Все регионы</option>
              <option value="costa-blanca">Коста Бланка</option>
              <option value="costa-del-sol">Коста дель Соль</option>
              <option value="mallorca">Майорка</option>
            </select>
            
            <select 
              value={filters.location.city}
              onChange={(e) => setFilters({
                ...filters, 
                location: {...filters.location, city: e.target.value}
              })}
            >
              <option value="">Все города</option>
              <option value="alicante">Аликанте</option>
              <option value="benidorm">Бенидорм</option>
              <option value="marbella">Марбелья</option>
              <option value="palma">Пальма</option>
            </select>
          </div>
          
          <div className="filter-actions">
            <button 
              className="reset-filters-btn"
              onClick={handleReset}
            >
              <FiX /> Сбросить
            </button>
            <button 
              className="apply-filters-btn"
              onClick={() => onApplyFilters(filters)}
            >
              <FiCheck /> Применить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 2.5. Форма редактирования объекта недвижимости

**Функциональные требования:**
- Многошаговый процесс добавления/редактирования
- Валидация полей и отображение ошибок
- Многоязычные поля для названия и описания
- Управление изображениями с перетаскиванием
- Предпросмотр объекта перед сохранением

**UI-компоненты (пример одного из шагов):**
```tsx
const BasicInfoStep = ({ formData, setFormData, errors }) => {
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleLanguageChange = (field, language, value) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [language]: value
      }
    });
  };
  
  return (
    <div className="form-step">
      <h2 className="step-title">
        <FiInfo /> Основная информация
      </h2>
      
      <div className="form-section">
        <h3>Название объекта</h3>
        <div className="language-tabs">
          <button className="lang-tab active">
            <FiFlag /> Русский
          </button>
          <button className="lang-tab">
            <FiFlag /> English
          </button>
          <button className="lang-tab">
            <FiFlag /> Español
          </button>
        </div>
        
        <div className="language-fields">
          <div className="field-container">
            <label>Название (RU)</label>
            <input 
              type="text"
              value={formData.title.ru}
              onChange={(e) => handleLanguageChange('title', 'ru', e.target.value)}
              className={errors?.title?.ru ? 'error' : ''}
            />
            {errors?.title?.ru && (
              <span className="error-message">
                <FiAlertCircle /> {errors.title.ru}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Тип объекта</h3>
        <div className="property-type-selector">
          <button 
            className={`type-btn ${formData.type === 'apartment' ? 'active' : ''}`}
            onClick={() => handleChange('type', 'apartment')}
          >
            <FiHome /> Квартира
          </button>
          <button 
            className={`type-btn ${formData.type === 'house' ? 'active' : ''}`}
            onClick={() => handleChange('type', 'house')}
          >
            <FiHome /> Дом
          </button>
          <button 
            className={`type-btn ${formData.type === 'villa' ? 'active' : ''}`}
            onClick={() => handleChange('type', 'villa')}
          >
            <FiHome /> Вилла
          </button>
          <button 
            className={`type-btn ${formData.type === 'commercial' ? 'active' : ''}`}
            onClick={() => handleChange('type', 'commercial')}
          >
            <FiBriefcase /> Коммерческая
          </button>
          <button 
            className={`type-btn ${formData.type === 'land' ? 'active' : ''}`}
            onClick={() => handleChange('type', 'land')}
          >
            <FiMapPin /> Земля
          </button>
        </div>
        {errors?.type && (
          <span className="error-message">
            <FiAlertCircle /> {errors.type}
          </span>
        )}
      </div>
      
      <div className="form-section">
        <h3>Цена и статус</h3>
        <div className="form-row">
          <div className="field-container">
            <label>Цена, €</label>
            <div className="price-input">
              <span className="currency-symbol">€</span>
              <input 
                type="number"
                value={formData.price.value}
                onChange={(e) => setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    value: e.target.value
                  }
                })}
                className={errors?.price?.value ? 'error' : ''}
              />
            </div>
            {errors?.price?.value && (
              <span className="error-message">
                <FiAlertCircle /> {errors.price.value}
              </span>
            )}
          </div>
          
          <div className="field-container">
            <label>Статус</label>
            <select 
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={errors?.status ? 'error' : ''}
            >
              <option value="active">Активен</option>
              <option value="reserved">Зарезервирован</option>
              <option value="sold">Продан</option>
              <option value="draft">Черновик</option>
            </select>
            {errors?.status && (
              <span className="error-message">
                <FiAlertCircle /> {errors.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 3. План реализации UI-компонентов

#### Фаза 1: Разработка структурных компонентов (2 дня)
- Создание базового Layout для админ-панели
- Разработка Sidebar с навигацией
- Создание Header с информацией о пользователе
- Стилизация основных элементов управления

#### Фаза 2: Таблица и система фильтрации (3 дня)
- Разработка компонента таблицы объектов недвижимости
- Создание системы фильтров и поиска
- Реализация сортировки и пагинации
- Добавление действий для управления объектами

#### Фаза 3: Формы и управление данными (3 дня)
- Создание многошаговой формы для добавления/редактирования объектов
- Разработка компонента для управления изображениями
- Валидация полей формы
- Предпросмотр объекта перед сохранением

#### Фаза 4: Дополнительные UI-элементы (2 дня)
- Разработка карточек для Dashboard
- Создание графиков и статистики
- Компоненты уведомлений и сообщений
- Модальные окна подтверждения действий

### 4. Стандарты UI/UX

#### 4.1. Дизайн-система
- Использование единых цветов, шрифтов и отступов
- Консистентное применение иконок из библиотеки react-icons
- Разработка компонентов с учётом адаптивности
- Применение принципов Material Design и современных веб-стандартов

#### 4.2. Анимации и переходы
- Плавные переходы между страницами
- Анимация появления элементов
- Отзывчивые кнопки и элементы управления
- Индикаторы загрузки для асинхронных операций

#### 4.3. Доступность
- Поддержка клавиатурной навигации
- Семантическая разметка для скринридеров
- Достаточная контрастность текста
- Адекватные размеры активных элементов

### 5. Интеграция с бэкендом

- Использование React Query для запросов к API
- Обработка состояний загрузки и ошибок
- Оптимистические обновления для лучшего UX
- Кэширование данных для быстрой навигации

### 6. Критерии успеха

- Интерфейс админ-панели соответствует современным стандартам веб-дизайна
- Все компоненты корректно отображаются на разных размерах экранов
- Переходы между экранами плавные и интуитивно понятные
- Система ввода данных предотвращает возможные ошибки пользователей
- Управление объектами недвижимости осуществляется эффективно и без лишних действий 