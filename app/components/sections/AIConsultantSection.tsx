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
    <section className="ai-consultant">
      <div className="container">
        <h2>Задайте вопрос нашему ИИ-консультанту</h2>
        <p className="section-desc">
          Наш искусственный интеллект ответит на любые вопросы о недвижимости в Испании, 
          процессе покупки, ВНЖ и многом другом
        </p>
        
        <div className="chat-container">
          <div className="chat-history">
            <div className="chat-message ai">
              <p>Здравствуйте! Я ИИ-консультант Spanish-Estate. Чем я могу вам помочь?</p>
            </div>
          </div>
          
          <div className="chat-controls">
            <div className="quick-questions">
              {quickQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="quick-question"
                  onClick={() => setChatMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
            
            <div className="chat-input">
              <input 
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Введите ваш вопрос..."
              />
              <button className="send-button">Отправить</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 