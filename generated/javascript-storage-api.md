## JavaScript: Мозги. Урок: Storage API

Storage API позволяет веб-приложениям сохранять данные локально в браузере пользователя. Это отличный способ сохранить состояние приложения между сессиями, пользовательские настройки или даже кэшировать данные для повышения производительности.

### Что такое Storage API?

Storage API предоставляет два основных объекта: `localStorage` и `sessionStorage`. Оба они позволяют хранить данные в формате "ключ-значение", но отличаются временем жизни. `localStorage` сохраняет данные постоянно (пока пользователь сам не очистит), а `sessionStorage` хранит данные только в течение текущей сессии браузера (пока открыта вкладка или окно).

### localStorage

`localStorage` используется для хранения данных, которые должны сохраняться даже после закрытия браузера.

```javascript
// Сохраняем данные
localStorage.setItem('username', 'JohnDoe');
localStorage.setItem('theme', 'dark');

// Получаем данные
const username = localStorage.getItem('username');
const theme = localStorage.getItem('theme');

console.log('Username:', username); // Output: Username: JohnDoe
console.log('Theme:', theme); // Output: Theme: dark

// Удаляем один элемент
localStorage.removeItem('username');

// Очищаем все данные
localStorage.clear();
```

### sessionStorage

`sessionStorage` используется для хранения данных, которые должны быть доступны только в течение текущей сессии.

```javascript
// Сохраняем данные
sessionStorage.setItem('cartId', '12345');

// Получаем данные
const cartId = sessionStorage.getItem('cartId');

console.log('Cart ID:', cartId); // Output: Cart ID: 12345

// После закрытия вкладки или окна, cartId будет удален.
```

### Практический пример: Сохранение темы пользователя

Предположим, у нас есть сайт с возможностью переключения между светлой и темной темой. Мы можем использовать `localStorage`, чтобы сохранить выбор пользователя и восстановить его при следующем посещении.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Theme Switcher</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <button id="theme-toggle">Toggle Theme</button>

  <script>
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Функция для применения темы
    function setTheme(theme) {
      if (theme === 'dark') {
        body.classList.add('dark-theme');
      } else {
        body.classList.remove('dark-theme');
      }
    }

    // Получаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('theme');

    // Применяем сохраненную тему при загрузке страницы
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Обработчик клика на кнопку
    themeToggle.addEventListener('click', () => {
      // Переключаем тему
      if (body.classList.contains('dark-theme')) {
        setTheme('light');
        localStorage.setItem('theme', 'light');
      } else {
        setTheme('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  </script>
</body>
</html>
```

```css
/* style.css */
body {
  background-color: white;
  color: black;
}

.dark-theme {
  background-color: black;
  color: white;
}
```

### Жизненный пример

*   **Сохранение настроек пользователя:** Многие веб-сайты используют Storage API для сохранения пользовательских настроек, таких как тема оформления, язык, размер шрифта и т.д.
*   **Корзины покупок:** Интернет-магазины часто используют `localStorage` или `sessionStorage` для хранения товаров в корзине пользователя до оформления заказа.
*   **Кэширование данных:** Веб-приложения могут использовать Storage API для кэширования данных с сервера, чтобы ускорить загрузку страниц и уменьшить количество запросов к серверу.
*   **Фреймворки:** Многие JavaScript фреймворки и библиотеки (например, React, Vue, Angular) используют Storage API для управления состоянием приложения.

### Ключевые моменты

*   `localStorage` хранит данные постоянно, `sessionStorage` - только в течение сессии.
*   Данные хранятся в формате "ключ-значение".
*   Storage API предоставляет методы `setItem`, `getItem`, `removeItem` и `clear`.
*   Используйте Storage API для сохранения пользовательских настроек, данных корзины покупок или кэширования данных.
*   Будьте осторожны с хранением конфиденциальных данных, так как они могут быть доступны скриптам на странице.
*   Максимальный объем данных, который можно хранить в Storage API, ограничен (обычно 5-10 МБ на домен).
