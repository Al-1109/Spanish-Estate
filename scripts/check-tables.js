require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Используем сервисный ключ для административного доступа
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  try {
    console.log('Проверка подключения к Supabase...');
    
    // Проверяем существование таблицы properties
    const { data: tableExists, error: tableError } = await supabase
      .from('properties')
      .select('count')
      .limit(1)
      .single();
    
    if (tableError) {
      if (tableError.code === 'PGRST116') {
        console.error('Ошибка: Таблица properties не существует');
        console.log('Пробуем создать таблицу...');
        
        // SQL для создания таблицы properties
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql_string: `
            CREATE TABLE IF NOT EXISTS public.properties (
              id SERIAL PRIMARY KEY,
              title TEXT NOT NULL,
              description TEXT,
              price NUMERIC NOT NULL,
              bedrooms INTEGER,
              bathrooms INTEGER,
              area NUMERIC,
              location TEXT,
              city TEXT,
              province TEXT,
              images TEXT[],
              status TEXT DEFAULT 'available',
              features TEXT[],
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
            
            -- Настройки безопасности
            ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
            CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.properties
                FOR SELECT USING (true);
                
            -- Вставляем тестовую запись, если таблица пуста
            INSERT INTO public.properties (title, description, price, city)
            SELECT 'Тестовая вилла', 'Описание тестовой виллы', 250000, 'Барселона'
            WHERE NOT EXISTS (SELECT 1 FROM public.properties LIMIT 1);
          `
        });
        
        if (createError) {
          console.error('Ошибка при создании таблицы:', createError);
        } else {
          console.log('Таблица properties успешно создана');
        }
      } else {
        console.error('Ошибка при проверке таблицы:', tableError);
      }
    } else {
      console.log('Таблица properties существует');
      console.log('Результат запроса:', tableExists);
    }
    
    // Проверяем содержимое таблицы
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('*');
      
    if (propertiesError) {
      console.error('Ошибка при получении данных из таблицы:', propertiesError);
    } else {
      console.log(`Найдено объектов: ${propertiesData.length}`);
      propertiesData.forEach(property => {
        console.log(`- ${property.title} (${property.price}€), город: ${property.city}`);
      });
    }
    
  } catch (error) {
    console.error('Общая ошибка:', error);
  }
}

checkTables(); 