import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types/supabase';
import { getChatHistory, saveUserMessage, saveAIResponse, getAIResponse } from '../../lib/chat';

// Временный ID пользователя для анонимной сессии
// В реальном приложении здесь будет использоваться ID аутентифицированного пользователя
const ANONYMOUS_USER_ID = '00000000-0000-0000-0000-000000000000';

interface ChatInterfaceProps {
  quickQuestions: string[];
}

export default function ChatInterface({ quickQuestions }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Загрузка истории чата при монтировании компонента
  useEffect(() => {
    async function loadChatHistory() {
      const history = await getChatHistory(ANONYMOUS_USER_ID);
      
      // Если истории нет, добавляем приветственное сообщение
      if (history.length === 0) {
        setMessages([{
          id: 0,
          created_at: new Date().toISOString(),
          user_id: ANONYMOUS_USER_ID,
          message: 'Здравствуйте! Я ИИ-консультант Spanish-Estate. Чем я могу вам помочь?',
          is_ai: true,
        }]);
      } else {
        setMessages(history);
      }
    }
    
    loadChatHistory();
  }, []);
  
  // Автоскролл при добавлении новых сообщений
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Обработка отправки сообщения
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    // Добавляем сообщение пользователя в интерфейс сразу
    const newUserMessage: ChatMessage = {
      id: Date.now(), // Временный ID, который будет заменен после сохранения
      user_id: ANONYMOUS_USER_ID,
      message: userMessage,
      is_ai: false,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Сохраняем сообщение пользователя в БД
    const savedUserMessage = await saveUserMessage(ANONYMOUS_USER_ID, userMessage);
    
    // Получаем ответ от ИИ
    const aiResponseText = await getAIResponse(userMessage);
    
    // Добавляем ответ ИИ в интерфейс
    const newAIMessage: ChatMessage = {
      id: Date.now() + 1, // Временный ID
      user_id: ANONYMOUS_USER_ID,
      message: aiResponseText,
      is_ai: true,
      created_at: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newAIMessage]);
    setIsLoading(false);
    
    // Сохраняем ответ ИИ в БД
    await saveAIResponse(ANONYMOUS_USER_ID, aiResponseText);
  };
  
  // Обработка нажатия на кнопку быстрого вопроса
  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };
  
  // Обработка нажатия Enter в поле ввода
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Область сообщений */}
      <div 
        ref={chatContainerRef}
        className="flex-grow p-4 bg-gray-50 overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.is_ai ? 'justify-start' : 'justify-end'} mb-4`}
          >
            <div 
              className={`py-2 px-4 rounded-lg max-w-md ${
                msg.is_ai ? 'bg-blue-100 text-blue-900' : 'bg-blue-900 text-white'
              }`}
            >
              <p>{msg.message}</p>
              <div className="text-xs mt-1 opacity-70">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-blue-100 rounded-lg py-2 px-4">
              <p className="text-blue-900">Печатает...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Быстрые вопросы */}
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((question, index) => (
            <button 
              key={index}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full px-3 py-1 transition"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
        
        {/* Ввод сообщения */}
        <div className="flex w-full">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите ваш вопрос..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            className="bg-blue-900 text-white px-4 py-2 rounded-r-md hover:bg-blue-800 transition"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
} 