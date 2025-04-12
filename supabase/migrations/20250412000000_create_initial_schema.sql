-- Создаем таблицу properties
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

-- Создаем таблицу для профилей пользователей
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем таблицу для сообщений чата
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security для таблиц
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа для properties
CREATE POLICY "Публичный доступ на чтение к properties" 
ON public.properties FOR SELECT USING (true);

CREATE POLICY "Только админы могут изменять properties" 
ON public.properties FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM public.user_profiles WHERE role = 'admin'
  )
);

-- Создаем политики доступа для user_profiles
CREATE POLICY "Пользователи могут видеть только свой профиль" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять только свой профиль" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Создаем политики для chat_messages
CREATE POLICY "Пользователи могут видеть только свои сообщения" 
ON public.chat_messages FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Пользователи могут создавать только свои сообщения" 
ON public.chat_messages FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Создаем функцию для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер для вызова функции при регистрации
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 