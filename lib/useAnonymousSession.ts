import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useAnonymousSession() {
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  
  useEffect(() => {
    // Проверяем, есть ли уже ID в localStorage
    const storedId = localStorage.getItem('anonymousUserId');
    
    if (storedId) {
      setAnonymousId(storedId);
    } else {
      // Если нет, генерируем новый UUID и сохраняем его
      const newId = uuidv4();
      localStorage.setItem('anonymousUserId', newId);
      setAnonymousId(newId);
    }
  }, []);
  
  return anonymousId;
} 