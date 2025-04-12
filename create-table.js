require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHpxdXJ6YXBiZGtuYnNiZmx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQ3Mzk4MSwiZXhwIjoyMDYwMDQ5OTgxfQ.zL3vjYia6ORyr_ek9G-PCo2wOoc5iwutvoN7jsJah6A'; // service_role ключ

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    // Прямой SQL запрос через rpc метод
    const { data, error } = await supabase.rpc('exec', {
      query: `
        CREATE TABLE IF NOT EXISTS properties (
          id SERIAL PRIMARY KEY,
          title TEXT,
          description TEXT,
          price NUMERIC,
          location TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    });
    
    if (error) {
      console.error('Error with SQL query:', error);
      return;
    }
    
    console.log('Table created successfully:', data);
    
    // Проверим, создалась ли таблица, добавив в нее тестовую запись
    const { data: insertData, error: insertError } = await supabase
      .from('properties')
      .insert({
        title: 'Test Property',
        description: 'This is a test property',
        price: 150000,
        location: 'Barcelona'
      })
      .select();
    
    if (insertError) {
      console.error('Error inserting test data:', insertError);
      return;
    }
    
    console.log('Test data inserted successfully:', insertData);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTables(); 