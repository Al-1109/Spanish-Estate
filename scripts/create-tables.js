require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Trying to create tables in Supabase...');

  try {
    // Создаем таблицу properties
    const createPropertiesTable = await supabase.from('properties').select('*').limit(1).catch(async () => {
      console.log('Creating properties table...');
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
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
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (error) {
        console.error('Error creating properties table:', error);
        return;
      }
      
      console.log('Properties table created successfully');
    });

    // Создаем таблицу user_profiles
    const createUserProfilesTable = await supabase.from('user_profiles').select('*').limit(1).catch(async () => {
      console.log('Creating user_profiles table...');
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.user_profiles (
            id UUID PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            role TEXT DEFAULT 'client',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (error) {
        console.error('Error creating user_profiles table:', error);
        return;
      }
      
      console.log('User profiles table created successfully');
    });

    // Создаем таблицу chat_messages
    const createChatMessagesTable = await supabase.from('chat_messages').select('*').limit(1).catch(async () => {
      console.log('Creating chat_messages table...');
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.chat_messages (
            id SERIAL PRIMARY KEY,
            user_id UUID,
            message TEXT NOT NULL,
            is_ai BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (error) {
        console.error('Error creating chat_messages table:', error);
        return;
      }
      
      console.log('Chat messages table created successfully');
    });

    // Добавляем тестовые данные
    console.log('Adding test data...');
    const { error: insertError } = await supabase
      .from('properties')
      .insert([
        { 
          title: 'Роскошная вилла на побережье', 
          description: 'Великолепная вилла с видом на море', 
          price: 850000, 
          location: 'Коста Брава', 
          city: 'Бланес', 
          province: 'Жирона', 
          bedrooms: 5, 
          bathrooms: 3, 
          area: 450 
        },
        { 
          title: 'Современные апартаменты в центре', 
          description: 'Стильные апартаменты в центре города', 
          price: 350000, 
          location: 'Центр города', 
          city: 'Барселона', 
          province: 'Барселона', 
          bedrooms: 2, 
          bathrooms: 2, 
          area: 85 
        }
      ])
      .select();

    if (insertError) {
      console.error('Error inserting test data:', insertError);
    } else {
      console.log('Test data added successfully');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTables(); 