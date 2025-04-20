require('dotenv').config({ path: '.env.local' });
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectId = process.env.SUPABASE_PROJECT_ID;

console.log('Проверка доступности Supabase API...');
console.log(`URL: ${supabaseUrl}`);
console.log(`Project ID: ${projectId}`);

// Удаляем префикс 'https://' и получаем только хост
const hostname = supabaseUrl.replace('https://', '');

// Проверяем доступность хоста
const req = https.request(
  {
    hostname: hostname,
    port: 443,
    path: '/rest/v1/?apikey=' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  },
  (res) => {
    console.log(`Статус ответа: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Ответ от сервера:');
      try {
        const parsedData = JSON.parse(data);
        console.log(JSON.stringify(parsedData, null, 2));
      } catch (e) {
        console.log('Не удалось распарсить ответ как JSON:');
        console.log(data);
      }
    });
  }
);

req.on('error', (error) => {
  console.error(`Ошибка при подключении: ${error.message}`);
});

req.end(); 