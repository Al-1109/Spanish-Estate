require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSqlFile(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Разделим файл на отдельные SQL запросы по точке с запятой
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);
    
    console.log(`Found ${queries.length} SQL queries to execute`);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`Executing query #${i + 1}:`);
      console.log(query);
      
      // Используем расширение Postgres для выполнения SQL запроса
      const { data, error } = await supabase.functions.invoke('execute-sql', {
        body: { query }
      });
      
      if (error) {
        console.error(`Error executing query #${i + 1}:`, error);
      } else {
        console.log(`Query #${i + 1} executed successfully`);
      }
    }
    
    console.log('All queries executed');
  } catch (error) {
    console.error('Error executing SQL file:', error);
  }
}

// Получаем путь к SQL файлу из аргументов командной строки
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide a path to the SQL file');
  process.exit(1);
}

const sqlFilePath = path.resolve(args[0]);
executeSqlFile(sqlFilePath); 