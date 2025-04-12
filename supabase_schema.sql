-- Таблица для объектов недвижимости
CREATE TABLE properties (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  status TEXT CHECK (status IN ('available', 'sold', 'pending')),
  features TEXT[]
);

-- Таблица для пользователей (дополнение к встроенной auth.users в Supabase)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  name TEXT,
  phone TEXT
);

-- Таблица для сообщений чата
CREATE TABLE chat_messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE
);

-- Индексы для улучшения производительности
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);

-- Базовые политики Row Level Security (RLS)
-- Политики для таблицы properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Публичный доступ на чтение к доступным объектам" 
ON properties FOR SELECT 
USING (status = 'available');

CREATE POLICY "Админы могут редактировать объекты" 
ON properties FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  )
);

-- Политики для таблицы chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Пользователи видят только свои сообщения" 
ON chat_messages FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Пользователи могут создавать только свои сообщения" 
ON chat_messages FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Триггер для создания записи в user_profiles при регистрации пользователя
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user(); 