## TypeScript: Базовые Типы

TypeScript, будучи строго типизированным суперсетом JavaScript, вводит концепцию типов для обеспечения статической проверки кода. Понимание базовых типов — это фундамент для написания надежного и предсказуемого кода.

### Проблема без Типов в JavaScript

В JavaScript переменные могут динамически менять свой тип во время выполнения, что может приводить к неожиданным ошибкам, обнаруживаемым только в рантайме.

```javascript
// JavaScript без типов:
function processInput(input) {
  // На момент вызова мы не знаем, что такое 'input'.
  // Это может быть число, строка, объект...
  return input * 2;
}

let result1 = processInput(10);    // OK: result1 = 20
let result2 = processInput("5");   // Ошибка времени выполнения: "5" * 2 = NaN
let result3 = processInput([1, 2]); // Ошибка времени выполнения: [1,2] * 2 -> NaN
console.log(result1, result2, result3);
```
Без статической проверки типов, подобные ошибки легко пропускаются на этапе разработки и проявляются уже в работающем приложении.

### Решение с TypeScript: Основные Базовые Типы

TypeScript вводит явное объявление типов, позволяя компилятору проверять их до выполнения кода.

1.  **`number`**: Представляет как целые числа, так и числа с плавающей точкой.
    ```typescript
    let price: number = 19.99;
    let quantity: number = 10;
    // price = "twenty"; // Ошибка TS2322: Type 'string' is not assignable to type 'number'.
    ```

2.  **`string`**: Представляет текстовые данные.
    ```typescript
    let productName: string = "Super Widget";
    let greeting: string = `Hello, ${productName}!`;
    ```

3.  **`boolean`**: Представляет логические значения `true` или `false`.
    ```typescript
    let isActive: boolean = true;
    let hasPermission: boolean = false;
    ```

4.  **`null` и `undefined`**: Оба являются отдельными типами и подтипами для всех других типов по умолчанию (если `strictNullChecks` не включен). Рекомендуется использовать `strictNullChecks: true` для предотвращения ошибок с `null` и `undefined`.
    ```typescript
    let emptyString: string | null = null;
    let notYetDefined: number | undefined = undefined;
    // При strictNullChecks: true, number = null; вызовет ошибку.
    ```

5.  **`symbol`**: Используется для создания уникальных и неизменяемых значений, часто для ключей свойств объекта.
    ```typescript
    const uniqueId: symbol = Symbol('id');
    const anotherId: symbol = Symbol('id');
    console.log(uniqueId === anotherId); // false
    ```

6.  **`bigint`**: Представляет целые числа произвольной точности. Используется для чисел, которые превышают предел `number` (2^53 - 1).
    ```typescript
    let veryLargeNumber: bigint = 9007199254740991n;
    let sum: bigint = veryLargeNumber + 1n; // Операции с bigint требуют других bigint
    // let mixedSum: number = veryLargeNumber + 1; // Ошибка TS2362: Operator '+' cannot be applied to types 'bigint' and 'number'.
    ```

7.  **`void`**: Указывает на отсутствие возвращаемого значения у функции.
    ```typescript
    function logMessage(msg: string): void {
      console.log(msg);
      // return msg; // Ошибка TS2322: Type 'string' is not assignable to type 'void'.
    }
    ```

8.  **`any`**: Тип, отключающий все проверки типов. Переменная типа `any` может принимать любое значение, и TypeScript не будет проверять ее использование. **Используйте с крайней осторожностью**, так как это разрушает преимущества TypeScript.
    ```typescript
    let untypedValue: any = "hello";
    untypedValue = 10;
    untypedValue.doSomethingThatDoesntExist(); // Нет ошибки на этапе компиляции, но будет runtime-ошибка
    ```

9.  **`unknown`**: Безопасная альтернатива `any`. Переменная типа `unknown` может принимать любое значение, но для работы с ним необходимо сначала сузить его тип (perform type narrow).
    ```typescript
    let potentiallyDangerous: unknown = "строка";
    // console.log(potentiallyDangerous.toUpperCase()); // Ошибка TS2571: Object is of type 'unknown'.
    if (typeof potentiallyDangerous === 'string') {
      console.log(potentiallyDangerous.toUpperCase()); // 'СТРОКА'
    } else if (typeof potentiallyDangerous === 'number') {
      console.log(potentiallyDangerous * 2);
    }
    ```

10. **`never`**: Тип для значений, которые никогда не могут произойти. Используется для функций, которые всегда выбрасывают исключение или содержат бесконечный цикл.
    ```typescript
    function throwError(message: string): never {
      throw new Error(message);
    }
    function infiniteLoop(): never {
      while (true) {}
    }
    ```

11. **`object`**: Представляет любой тип, который не является примитивным (`number`, `string`, `boolean`, `symbol`, `bigint`, `null`, `undefined`). Редко используется напрямую, так как обычно мы хотим более специфичные типы объектов.
    ```typescript
    let nonPrimitive: object = {};
    nonPrimitive = { name: "TS" };
    // nonPrimitive = 10; // Ошибка TS2322: Type 'number' is not assignable to type 'object'.
    ```

### Продвинутые Техники с Базовыми Типами

*   **Выведение типов (Type Inference)**: TypeScript способен самостоятельно определить тип переменной, если он инициализируется при объявлении.
    ```typescript
    let count = 5;       // count: number (выведено автоматически)
    let greeting = "Hi"; // greeting: string
    // count = "ten";    // Ошибка TS2322: Type 'string' is not assignable to type 'number'.
    ```

*   **Объединение типов (Union Types)**: Позволяет переменной иметь один из нескольких типов. Используется оператор `|`.
    ```typescript
    let userId: number | string = 101;
    userId = "abc-123";
    // userId = true; // Ошибка TS2322: Type 'boolean' is not assignable to type 'string | number'.
    ```

*   **Литеральные типы (Literal Types)**: Тип, который может быть только одним конкретным значением. Часто используются с объединением типов.
    ```typescript
    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
    let requestMethod: HttpMethod = "GET";
    // requestMethod = "HEAD"; // Ошибка TS2322: Type '"HEAD"' is not assignable to type 'HttpMethod'.
    ```

### Практика

1.  Создайте функцию `processUnknownInput`, которая принимает один аргумент типа `unknown`. Внутри функции безопасно проверьте тип аргумента. Если это `string`, выведите его в верхнем регистре; если `number`, выведите его квадрат; в противном случае выведите сообщение об ошибке.
2.  Определите тип `TrafficLightColor` с помощью литеральных типов, который может быть только "red", "yellow" или "green". Объявите переменную этого типа и попробуйте присвоить ей некорректное значение.