// Скрипт для назначения роли администратора пользователю в Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Функция для установки роли администратора
async function setAdminRole(userEmail) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Отсутствуют переменные окружения. Убедитесь, что файл .env.local настроен правильно.');
    process.exit(1);
  }

  // Создаем клиент Supabase с сервисным ключом (имеет полные права)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Получаем пользователя по email
    const { data: users, error: getUserError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', userEmail)
      .single();
    
    if (getUserError) {
      // Если такой таблицы нет, попробуем использовать API auth.admin
      console.log('Пробуем альтернативный метод получения пользователя...');
      const { data: { users: adminUsers }, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Ошибка при получении списка пользователей:', listError.message);
        process.exit(1);
      }
      
      const user = adminUsers.find(u => u.email === userEmail);
      if (!user) {
        console.error(`Пользователь с email ${userEmail} не найден`);
        process.exit(1);
      }
      
      // Устанавливаем метаданные пользователя
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { app_metadata: { role: 'admin' } }
      );
      
      if (updateError) {
        console.error('Ошибка при обновлении роли пользователя:', updateError.message);
        process.exit(1);
      }
      
      console.log(`Пользователю ${userEmail} успешно присвоена роль администратора`);
    } else {
      // Если пользователь найден через SQL запрос
      const userId = users.id;
      
      // Обновляем метаданные пользователя
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { app_metadata: { role: 'admin' } }
      );
      
      if (updateError) {
        console.error('Ошибка при обновлении роли пользователя:', updateError.message);
        process.exit(1);
      }
      
      console.log(`Пользователю ${userEmail} успешно присвоена роль администратора`);
    }
  } catch (error) {
    console.error('Непредвиденная ошибка:', error);
    process.exit(1);
  }
}

// Получаем email пользователя из аргументов командной строки
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Укажите email пользователя: node scripts/add-admin-role.js user@example.com');
  process.exit(1);
}

setAdminRole(userEmail); 