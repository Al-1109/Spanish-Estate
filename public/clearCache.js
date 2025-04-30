// Функция для очистки кэша браузера
window.clearBrowserCache = function() {
  var success = false;

  // Метод 1: Cache API
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
        console.log('Кэш удален:', name);
      }
    });
    success = true;
  }

  // Метод 2: Добавление параметра для предотвращения кэширования при обновлении страницы
  try {
    const clearCacheParam = 'clearcache=' + new Date().getTime();
    const currentUrl = window.location.href;
    const hasParams = currentUrl.indexOf('?') !== -1;
    const separator = hasParams ? '&' : '?';
    localStorage.setItem('reloadAfterCacheClear', 'true');
    localStorage.setItem('redirectUrl', currentUrl + separator + clearCacheParam);
    success = true;
  } catch (e) {
    console.error('Ошибка при попытке настроить перезагрузку страницы:', e);
  }

  // Метод 3: Добавление метатегов для предотвращения кэширования
  try {
    const metaTags = [
      { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Expires', content: '0' }
    ];
    
    metaTags.forEach(meta => {
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = meta.httpEquiv;
      metaTag.content = meta.content;
      document.head.appendChild(metaTag);
    });
    success = true;
  } catch (e) {
    console.error('Ошибка при добавлении метатегов:', e);
  }

  // Выполнить перезагрузку страницы для применения очистки кэша
  if (success) {
    alert('Кэш браузера очищен. Страница будет перезагружена.');
    setTimeout(function() {
      const redirectUrl = localStorage.getItem('redirectUrl');
      if (redirectUrl) {
        localStorage.removeItem('redirectUrl');
        localStorage.removeItem('reloadAfterCacheClear');
        window.location.href = redirectUrl;
      } else {
        window.location.reload(true);
      }
    }, 500);
    return true;
  } else {
    alert('Не удалось очистить кэш браузера. Попробуйте обновить страницу вручную.');
    return false;
  }
};

// Инициализация необходимых для работы AddressAutocomplete настроек
(function() {
  console.log('[clearCache.js] Инициализация настроек для AddressAutocomplete');
  
  // Настройка Fetch API для отправки заголовков с каждым запросом
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Если URL содержит nominatim.openstreetmap.org, добавляем необходимые заголовки
    if (url && url.toString().includes('nominatim.openstreetmap.org')) {
      console.log('[clearCache.js] Перехват запроса к Nominatim API:', url);
      
      options = options || {};
      options.headers = options.headers || {};
      
      // Добавляем заголовки, если они не определены
      if (!options.headers['User-Agent']) {
        options.headers['User-Agent'] = 'SpainEstates/1.0';
      }
      if (!options.headers['Referer']) {
        options.headers['Referer'] = 'https://spainestates.com/';
      }
      if (!options.headers['Accept']) {
        options.headers['Accept'] = 'application/json';
      }
      
      console.log('[clearCache.js] Запрос с заголовками:', options.headers);
    }
    
    return originalFetch.apply(this, [url, options]);
  };
  
  // Настройка глобальных переменных для работы с AddressAutocomplete
  window.addressAutocompleteSettings = {
    enabled: true,
    defaultHeaders: {
      'User-Agent': 'SpainEstates/1.0',
      'Referer': 'https://spainestates.com/',
      'Accept': 'application/json'
    }
  };
  
  console.log('[clearCache.js] Настройки AddressAutocomplete инициализированы');
})(); 