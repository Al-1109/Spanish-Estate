import { useState } from 'react';
import ChatInterface from '../../../components/ui/ChatInterface';

export const AIConsultantSection = () => {
  const quickQuestions = [
    'Какую недвижимость я могу купить с бюджетом 300 000€?',
    'Какие документы нужны для покупки?',
    'Как получить ВНЖ при покупке недвижимости?',
    'Сколько стоит содержание недвижимости?'
  ];

  return (
    <section id="ai-consultant" className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Задайте вопрос нашему ИИ-консультанту</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Наш искусственный интеллект ответит на любые вопросы о недвижимости в Испании, 
          процессе покупки, ВНЖ и многом другом. Вы также можете отправить нам личное сообщение в этом чате.
        </p>
        
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
          <ChatInterface quickQuestions={quickQuestions} />
        </div>
      </div>
    </section>
  );
}; 