# JavaScript: Мозги. Урок: Nullish coalescing ??

Привет! Сегодня мы разберем оператор `??` (nullish coalescing), который поможет нам элегантно обрабатывать значения, которые могут быть `null` или `undefined`. Он упрощает код и делает его более читаемым.

## Что такое Nullish Coalescing Operator (??)

Оператор `??` возвращает правый операнд, только если левый операнд равен `null` или `undefined`. В противном случае, он возвращает левый операнд. Думайте о нем как о безопасном способе предоставить значение по умолчанию, когда переменная "пустая".

### Пример кода

```javascript
let name = null;
let defaultName = "Guest";

let displayName = name ?? defaultName; // displayName будет "Guest"

console.log(displayName); // Выведет: Guest

name = "Alice";
displayName = name ?? defaultName; // displayName будет "Alice"

console.log(displayName); // Выведет: Alice
```

В этом примере, если `name` – `null` или `undefined`, то `displayName` получит значение `defaultName`. Если `name` содержит какое-либо другое значение, то `displayName` получит это значение.

## Практические примеры

Вот несколько примеров использования `??` в разных сценариях:

```javascript
// 1. Установка значения по умолчанию для переменной
let userAge = null;
let age = userAge ?? 18; // Если userAge null или undefined, age будет 18
console.log(age); // Выведет: 18

// 2. Работа с объектами
let user = {
  name: "Bob",
  // age: null // Предположим, что age отсутствует в объекте
};

let userAgeFromObject = user.age ?? 25; // Если user.age null или undefined, userAgeFromObject будет 25
console.log(userAgeFromObject); // Выведет: 25

// 3. Использование с функциями
function greet(name) {
  let greeting = "Hello, " + (name ?? "User") + "!";
  return greeting;
}

console.log(greet("Charlie")); // Выведет: Hello, Charlie!
console.log(greet(null)); // Выведет: Hello, User!
```

## Жизненный пример

В React и других фреймворках часто используются пропсы (props) для передачи данных компонентам.  Иногда пропсы могут быть не переданы, и в этом случае `??` может быть полезен для установки значений по умолчанию.

```javascript
// Пример компонента React
function Greeting(props) {
  const name = props.name ?? "Guest";
  return <h1>Hello, {name}!</h1>;
}

// Использование компонента
// <Greeting name="Eve" />  // Выведет: Hello, Eve!
// <Greeting />           // Выведет: Hello, Guest!
```

В Redux, Vuex и других системах управления состоянием, `??` может использоваться для безопасного доступа к данным, которые могут быть еще не загружены или иметь значение `null` или `undefined`.

## Ключевые моменты

*   `??` проверяет только `null` и `undefined`.
*   `??` отличается от `||` (логическое ИЛИ), который проверяет на любой "falsy" value (0, "", NaN, null, undefined, false).
*   `??` делает код более читаемым, когда нужно предоставить значение по умолчанию для `null` или `undefined`.
*   `??` широко используется в современных JavaScript-фреймворках и библиотеках.
