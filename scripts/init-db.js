require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const https = require('https');

// Получаем параметры из переменных окружения
const projectId = process.env.SUPABASE_PROJECT_ID;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Функция для выполнения SQL запроса через SQL API Supabase
async function executeSql(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: query
    });

    const options = {
      hostname: `${projectId}.supabase.co`,
      port: 443,
      path: '/rest/v1/sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const result = data ? JSON.parse(data) : {};
            resolve(result);
          } catch (e) {
            console.log('Warning: Could not parse response as JSON', data);
            resolve(data);
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Функция для инициализации базы данных
async function initializeDatabase() {
  try {
    console.log('Инициализация базы данных Supabase...');
    
    // Чтение SQL файла с миграцией
    const sqlFilePath = path.join(__dirname, '../supabase/migrations/20250412000000_create_initial_schema.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Разделим файл на отдельные SQL запросы по точке с запятой
    const queries = sqlContent
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0);
    
    console.log(`Найдено ${queries.length} SQL запросов для выполнения`);
    
    // Выполнение каждого запроса
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\nВыполняется запрос #${i + 1}:\n${query.substring(0, 150)}...`);
      
      try {
        await executeSql(query);
        console.log(`✅ Запрос #${i + 1} успешно выполнен`);
      } catch (error) {
        console.error(`❌ Ошибка выполнения запроса #${i + 1}:`, error.message);
        // Продолжаем выполнение следующих запросов
      }
    }
    
    // Добавление тестовых данных
    console.log('\nДобавление тестовых данных...');
    const seedFilePath = path.join(__dirname, '../supabase/seed.sql');
    const seedContent = fs.readFileSync(seedFilePath, 'utf8');
    
    try {
      await executeSql(seedContent);
      console.log('✅ Тестовые данные успешно добавлены');
    } catch (error) {
      console.error('❌ Ошибка добавления тестовых данных:', error.message);
    }
    
    console.log('\nИнициализация базы данных завершена');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
  }
}

// Запуск инициализации
initializeDatabase(); 