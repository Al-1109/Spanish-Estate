import { supabase } from './supabase';
import { ChatMessage } from '../types/supabase';

// Функция для получения истории чата для пользователя
export async function getChatHistory(userId: string | undefined): Promise<ChatMessage[]> {
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Ошибка при получении истории чата:', error);
    return [];
  }

  return data || [];
}

// Функция для сохранения сообщения пользователя
export async function saveUserMessage(
  userId: string | undefined, 
  message: string
): Promise<ChatMessage | null> {
  if (!userId || !message.trim()) {
    return null;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      message,
      is_ai: false
    })
    .select()
    .single();

  if (error) {
    console.error('Ошибка при сохранении сообщения пользователя:', error);
    return null;
  }

  return data;
}

// Функция для сохранения ответа ИИ
export async function saveAIResponse(
  userId: string | undefined, 
  message: string
): Promise<ChatMessage | null> {
  if (!userId || !message.trim()) {
    return null;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      user_id: userId,
      message,
      is_ai: true
    })
    .select()
    .single();

  if (error) {
    console.error('Ошибка при сохранении ответа ИИ:', error);
    return null;
  }

  return data;
}

// Временная функция для симуляции ответа ИИ (потом будет заменена на API)
export async function getAIResponse(question: string): Promise<string> {
  // Набор заготовленных ответов для симуляции работы ИИ
  const responses: Record<string, string> = {
    'какую недвижимость я могу купить с бюджетом 300 000€?': 
      'За 300 000€ вы можете приобрести 1-2 комнатную квартиру в популярных прибрежных городах вроде Торревьеха или Аликанте. Также доступны небольшие апартаменты в пригородах Барселоны и Валенсии. Если рассматривать менее туристические районы, то бюджет позволит купить таунхаус или небольшую виллу.',
    
    'какие документы нужны для покупки?': 
      'Для покупки недвижимости в Испании вам потребуется: NIE (идентификационный номер иностранца), открытый банковский счет в испанском банке, нотариально заверенная доверенность (если вы не можете присутствовать лично). На момент сделки все налоги должны быть оплачены предыдущим владельцем.',
    
    'как получить внж при покупке недвижимости?':
      'При покупке недвижимости стоимостью от 500 000€ вы можете претендовать на "Золотую визу" (инвесторскую визу), которая дает ВНЖ на 2 года с возможностью продления. Эта виза распространяется на всю семью, включая детей до 18 лет. Процесс получения занимает около 2-3 месяцев после покупки.',
    
    'сколько стоит содержание недвижимости?':
      'Ежегодные расходы на содержание недвижимости в Испании включают: налог на недвижимость (IBI) - около 0,5-1% от кадастровой стоимости, коммунальные платежи - в среднем 100-200€ в месяц, налог на вывоз мусора - около 100-150€ в год. Для апартаментов также плата за обслуживание общих территорий - от 50 до 200€ в месяц.'
  };

  // Упрощаем вопрос для поиска соответствия
  const simplifiedQuestion = question.toLowerCase().trim();
  
  // Проверяем, есть ли прямое соответствие в заготовленных ответах
  for (const key in responses) {
    if (simplifiedQuestion.includes(key) || key.includes(simplifiedQuestion)) {
      return responses[key];
    }
  }

  // Если соответствие не найдено, возвращаем общий ответ
  return `Спасибо за ваш вопрос о "${question}". Я обрабатываю ваш запрос. Чтобы получить более точную информацию, вы можете связаться с нашими специалистами по телефону или оставить заявку на сайте.`;
} 