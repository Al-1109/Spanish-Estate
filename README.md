# SpainEstates - Real Estate Platform

## Структура проекта

### Структура директорий

```
app/                            # Next.js App Router
  ├── admin/                    # Административная панель
  │   └── properties/           # Управление объектами недвижимости
  │       └── create/           # Создание объектов
  │           └── components/   # Компоненты формы создания объекта
  ├── components/               # Общие компоненты
  │   └── ui/                   # UI компоненты
  ├── lib/                      # Библиотеки и утилиты
  │   ├── api.ts                # API для работы с данными
  │   └── supabase.ts           # Конфигурация Supabase клиента
  └── types/                    # TypeScript типы и интерфейсы
```

### Информация о ветках

Документация о ветках разработки и их назначении доступна в следующих файлах:
- `STATUS_BRANCH.md` - текущий статус разработки, критические файлы и иерархия веток
- `README_BRANCH.md` - подробная документация и технические спецификации веток

### Иерархия веток

```
admin-panel (основная ветка админ-панели)
  ├── admin-panel-property-steps-location (компонент расположения)
  │   └── admin-panel-property-steps-location-stable-map-full (стабильная версия карты)
  ├── admin-panel-property-steps-basic-info (раздел описания)
  └── admin-panel-preview (компонент предпросмотра объектов)
```

## Критические неотслеживаемые файлы

Некоторые важные файлы создаются разработчиками локально и не отслеживаются Git:

- `app/admin/properties/create/components/BasicInfoStep.tsx`
- `app/admin/properties/create/components/FeaturesStep.tsx`
- `app/admin/properties/create/components/ImagesStep.tsx`
- `app/admin/properties/create/components/HomepageSettingsStep.tsx`
- `app/admin/properties/create/components/SEOStep.tsx`
- `app/admin/properties/create/components/address-autocomplete/index.tsx`
- `app/admin/properties/create/components/map/LeafletMap.tsx`
- `lib/api.ts`
- `components/ui/Toast.tsx`
- `components/PreviewDrawer.tsx`
- `components/PropertyPreview.tsx`

Перед переключением между ветками или выполнением `git reset` сохраните эти файлы локально.

## Руководство по работе с ветками

1. **При создании новых файлов:**
   ```bash
   git add .
   git commit -m "Добавлены новые компоненты"
   ```

2. **Перед переключением веток:**
   ```bash
   # Проверить неотслеживаемые файлы
   git ls-files --others --exclude-standard
   
   # Создать временное сохранение (stash)
   git stash save "Временные изменения перед переключением"
   ```

3. **Создание ветки компонента:**
   ```bash
   git checkout -b admin-panel-my-feature
   ```

4. **Документирование:**
   Обновляйте STATUS_BRANCH.md с информацией о новых файлах и зависимостях.

## Технологии

- Next.js 14+
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- React Hook Form
- Leaflet
