const { Client } = require('pg');

// Используем URL для подключения к Supabase PostgreSQL
// Кодируем специальные символы в пароле
const password = encodeURIComponent('Gixv86DN+mg2ZlygXXVd/xQtowLgL');
const connectionString = `postgres://postgres:${password}@db.xnlzqurzapbdknbsbflw.supabase.co:5432/postgres`;

async function setupDatabase() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // для Supabase требуется SSL
    }
  });

  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    // Создаем таблицу properties
    const createTableResult = await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT,
        description TEXT,
        price NUMERIC,
        location TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table created or already exists');

    // Добавим тестовую запись
    const insertResult = await client.query(`
      INSERT INTO properties (title, description, price, location)
      VALUES ('Test Property', 'This is a test property', 150000, 'Barcelona')
      RETURNING *;
    `);
    console.log('Inserted test data:', insertResult.rows[0]);

    // Проверим данные
    const selectResult = await client.query('SELECT * FROM properties;');
    console.log('Current data in properties table:', selectResult.rows);

    await client.end();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
    if (client) {
      await client.end();
    }
  }
}

setupDatabase(); 