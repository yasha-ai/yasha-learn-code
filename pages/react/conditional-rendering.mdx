## React: Движок. Урок 4: Условный рендеринг

В React часто требуется отображать различные элементы интерфейса в зависимости от определенных условий. Условный рендеринг позволяет динамически изменять отображаемый контент на основе состояния вашего приложения. В этом уроке мы рассмотрим различные подходы к условному рендерингу в React.

### Что такое условный рендеринг?

Условный рендеринг – это возможность отображать разные компоненты или JSX в зависимости от определенных условий. В React это достигается с помощью JavaScript логики внутри компонентов.

### Способы условного рендеринга

1. **`if/else` statements:** Самый простой и понятный способ.

```javascript
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <h1>Добро пожаловать!</h1>;
  } else {
    return <h1>Пожалуйста, войдите.</h1>;
  }
}

function App() {
  return (
    <div>
      <Greeting isLoggedIn={true} />
      <Greeting isLoggedIn={false} />
    </div>
  );
}

export default App;
```

2. **Тернарный оператор:** Более компактный способ для простых условий.

```javascript
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  return (
    <h1>
      {isLoggedIn ? 'Добро пожаловать!' : 'Пожалуйста, войдите.'}
    </h1>
  );
}

function App() {
  return (
    <div>
      <Greeting isLoggedIn={true} />
      <Greeting isLoggedIn={false} />
    </div>
  );
}

export default App;
```

3. **Логическое `&&` (короткое замыкание):**  Отображает элемент, только если условие истинно.

```javascript
function Message(props) {
  const messages = props.messages;
  return (
    <div>
      {messages.length > 0 &&
        <h2>
          У вас {messages.length} непрочитанных сообщений.
        </h2>
      }
    </div>
  );
}

function App() {
  return (
    <div>
      <Message messages={['Сообщение 1', 'Сообщение 2']} />
      <Message messages={[]} />
    </div>
  );
}

export default App;
```

4. **Возврат `null`:**  Компонент ничего не отображает при определенном условии.

```javascript
function WarningBanner(props) {
  if (!props.warn) {
    return null; // Ничего не отображаем
  }

  return (
    <div className="warning">
      Предупреждение!
    </div>
  );
}

function App() {
  return (
    <div>
      <WarningBanner warn={true} />
      <WarningBanner warn={false} />
    </div>
  );
}

export default App;
```

### Жизненный пример

Условный рендеринг широко используется в веб-разработке. Например:

*   **Аутентификация:** Отображение разных элементов интерфейса в зависимости от того, авторизован пользователь или нет (навигационное меню, кнопки).
*   **Загрузка данных:** Отображение индикатора загрузки (spinner) пока данные загружаются с сервера.
*   **Список элементов:** Отображение сообщения "Нет данных", если список элементов пуст.
*   **Управление видимостью:** Отображение/скрытие модальных окон или всплывающих подсказок.

Пример:

```javascript
function UserProfile(props) {
  const { user, isLoading, error } = props;

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  if (!user) {
    return <div>Пользователь не найден.</div>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Ключевые моменты

*   Условный рендеринг позволяет создавать динамические и адаптивные пользовательские интерфейсы.
*   `if/else`, тернарный оператор и логическое `&&` – основные инструменты.
*   Используйте `null` для компонентов, которые не должны отображаться при определенных условиях.
*   Выбирайте способ условного рендеринга в зависимости от сложности условия и читаемости кода.
