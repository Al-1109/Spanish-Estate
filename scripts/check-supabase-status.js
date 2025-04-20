require('dotenv').config({ path: '.env.local' });
const https = require('https');

console.log('Проверка статуса Supabase...');

// Проверяем статус Supabase через публичный API
const req = https.request(
  {
    hostname: 'status.supabase.com',
    port: 443,
    path: '/api/v2/status.json',
    method: 'GET'
  },
  (res) => {
    console.log(`Статус ответа: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Статус Supabase:');
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