import { useState } from 'react';

export const AIConsultantSection = () => {
  const [chatMessage, setChatMessage] = useState('');

  const quickQuestions = [
    'Какую недвижимость я могу купить с бюджетом 300 000€?',
    'Какие документы нужны для покупки?',
    'Как получить ВНЖ при покупке недвижимости?',
    'Сколько стоит содержание недвижимости?'
  ];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Задайте вопрос нашему ИИ-консультанту</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Наш искусственный интеллект ответит на любые вопросы о недвижимости в Испании, 
          процессе покупки, ВНЖ и многом другом
        </p>
        
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 p-4 bg-gray-50 overflow-y-auto">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 rounded-lg py-2 px-4 max-w-md">
                <p className="text-blue-900">
                  Здравствуйте! Я ИИ-консультант Spanish-Estate. Чем я могу вам помочь?
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full px-3 py-1 transition"
                  onClick={() => setChatMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            
            <div className="flex w-full">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Введите ваш вопрос..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-900 text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition">
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 