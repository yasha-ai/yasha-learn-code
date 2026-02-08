## TypeScript: Броня. Урок 1: Базовые типы

В TypeScript, в отличие от JavaScript, каждая переменная и функция имеют тип. Это позволяет компилятору проверять код на наличие ошибок еще до запуска, делая разработку более надежной и предсказуемой. В этом уроке мы рассмотрим основные типы данных, которые TypeScript предоставляет из коробки.

### Основные типы данных

TypeScript предлагает набор базовых типов, которые охватывают большинство распространенных сценариев. Вот некоторые из них:

*   **`number`**: Числовой тип данных (целые числа и числа с плавающей точкой).

    ```typescript
    let age: number = 30;
    let price: number = 19.99;
    ```

*   **`string`**: Текстовый тип данных.

    ```typescript
    let name: string = "Alice";
    let message: string = 'Hello, world!';
    ```

*   **`boolean`**: Логический тип данных (true или false).

    ```typescript
    let isAdult: boolean = true;
    let isLoggedIn: boolean = false;
    ```

*   **`null` и `undefined`**: Представляют отсутствие значения.  По умолчанию, `null` и `undefined` являются подтипами всех других типов. Это значит, что вы можете присвоить `null` или `undefined` переменной типа `number`, `string` и т.д.  Однако, можно изменить это поведение с помощью флага `--strictNullChecks` в конфигурации TypeScript.

    ```typescript
    let emptyValue: null = null;
    let notDefined: undefined = undefined;
    ```

*   **`any`**: Тип, который позволяет переменной принимать любое значение. Старайтесь избегать его, так как он отменяет преимущества типизации.

    ```typescript
    let anything: any = 42;
    anything = "Hello";
    anything = true;
    ```

*   **`unknown`**:  Похож на `any`, но более безопасен. Вы не можете выполнять операции с переменной типа `unknown`, пока не убедитесь, что она имеет определенный тип.

    ```typescript
    let unknownValue: unknown = "This could be anything";

    // Ошибка: Объект типа "unknown" не может быть присвоен типу "string".
    // let text: string = unknownValue;

    if (typeof unknownValue === 'string') {
        let text: string = unknownValue; // Теперь безопасно
        console.log(text.toUpperCase());
    }
    ```

*   **`void`**:  Используется для функций, которые не возвращают значение.

    ```typescript
    function logMessage(message: string): void {
        console.log(message);
    }
    ```

*   **`never`**: Используется для функций, которые никогда не заканчивают свое выполнение (например, всегда выбрасывают исключение).

    ```typescript
    function throwError(message: string): never {
        throw new Error(message);
    }
    ```

*   **Массивы**: Массивы типизируются с указанием типа элементов.

    ```typescript
    let numbers: number[] = [1, 2, 3, 4, 5];
    let names: string[] = ["Alice", "Bob", "Charlie"];
    let booleanValues: Array<boolean> = [true, false, true]; // Альтернативный синтаксис
    ```

*   **Кортежи (Tuples)**:  Массивы с фиксированным количеством элементов, где каждый элемент может иметь свой тип.

    ```typescript
    let person: [string, number] = ["John", 25];
    ```

### Практические примеры кода

```typescript
// Пример использования number и string
let productPrice: number = 99.99;
let productName: string = "Super Widget";

// Пример использования boolean
let isInStock: boolean = true;

// Пример использования массива строк
let categories: string[] = ["Electronics", "Gadgets"];

// Пример использования кортежа
let coordinates: [number, number] = [10, 20]; // Широта и долгота
```

### Жизненный пример

В React-приложениях TypeScript широко используется для типизации props и state компонентов.  Это позволяет избегать ошибок, связанных с неправильным использованием данных, и улучшает читаемость кода.

Например:

```typescript
interface Props {
  name: string;
  age: number;
  isLoggedIn: boolean;
}

const UserProfile: React.FC<Props> = ({ name, age, isLoggedIn }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Logged in: {isLoggedIn ? "Yes" : "No"}</p>
    </div>
  );
};
```

В Angular и Vue.js аналогично используются типы для определения структуры данных и взаимодействия между компонентами.  Фреймворки, такие как NestJS (для бэкенда), активно используют TypeScript для создания надежных и масштабируемых приложений.

### Ключевые моменты

*   TypeScript добавляет типы в JavaScript, что позволяет обнаруживать ошибки на этапе компиляции.
*   Базовые типы включают `number`, `string`, `boolean`, `null`, `undefined`, `any`, `unknown`, `void`, `never`, массивы и кортежи.
*   Использование типов делает код более понятным и поддерживаемым.
*   Типизация компонентов во фреймворках, таких как React, Angular и Vue.js, помогает предотвратить ошибки и улучшить качество кода.
*   `unknown` является более безопасной альтернативой `any`.
*   Изучение и правильное использование базовых типов - основа для освоения TypeScript.
