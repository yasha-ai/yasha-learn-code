## TypeScript: Generics - Броня против Неопределенности

Generics (дженерики) в TypeScript позволяют писать компоненты, которые могут работать с различными типами данных, сохраняя при этом типовую безопасность. Это как создание шаблона, который адаптируется к конкретному типу.

### Что такое Generics?

Представьте, что вам нужна функция, которая возвращает первый элемент массива.  С generics вы можете написать эту функцию один раз, и она будет работать с массивами чисел, строк, объектов и всего остального, при этом TypeScript будет следить за тем, чтобы типы соответствовали.

```typescript
// Без generics, нужно либо использовать `any`, либо перегрузку функций
function getFirstElement(arr: any[]): any {
  return arr[0];
}

const numberArray = [1, 2, 3];
const firstElement = getFirstElement(numberArray); // firstElement имеет тип `any` - это не идеально!
```

С generics мы можем сделать лучше:

```typescript
// Используем Generic type `T`
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numberArray = [1, 2, 3];
const firstNumber = getFirstElement(numberArray); // firstNumber имеет тип `number`! TypeScript вывел тип!

const stringArray = ["a", "b", "c"];
const firstString = getFirstElement(stringArray); // firstString имеет тип `string`!

// Можно указать тип явно
const booleanArray = [true, false, true];
const firstBoolean = getFirstElement<boolean>(booleanArray); // firstBoolean имеет тип `boolean`
```

В этом примере `T` - это type variable (типовая переменная). Когда вы вызываете `getFirstElement` с массивом чисел, `T` становится `number`.  TypeScript использует это, чтобы убедиться, что возвращаемый тип тоже `number`. Если массив пустой, то вернется `undefined`.

### Generics и Interfaces

Generics также отлично работают с интерфейсами.

```typescript
interface Result<T> {
  success: boolean;
  data?: T; // Данные будут иметь тип T
  error?: string;
}

function processData(data: string): Result<string> {
  if (data.length > 5) {
    return { success: true, data: data };
  } else {
    return { success: false, error: "Data is too short" };
  }
}

const result = processData("Long Data");
if (result.success) {
  console.log("Data:", result.data); // result.data имеет тип string
} else {
  console.error("Error:", result.error);
}
```

### Generics и Classes

```typescript
class DataHolder<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  getData(): T {
    return this.data;
  }
}

const numberHolder = new DataHolder<number>(10);
console.log(numberHolder.getData()); // 10

const stringHolder = new DataHolder<string>("Hello");
console.log(stringHolder.getData()); // Hello
```

### Жизненный пример

Многие библиотеки и фреймворки используют generics для повышения типовой безопасности и гибкости.

*   **React:**  `React.useState<T>()` - хук, который использует generics для определения типа состояния.
*   **Redux Toolkit:** `createSlice<State, CaseReducers, Name extends string = string>()` - использует generics для определения типа состояния, редьюсеров и названия слайса.
*   **Angular:**  Использование `HttpClient` с generics для определения типа возвращаемых данных из API запросов (например, `HttpClient.get<User>('/api/users')`).

### Ключевые моменты

*   Generics позволяют писать reusable code, который работает с разными типами.
*   Они улучшают типовую безопасность, позволяя TypeScript проверять типы во время компиляции.
*   Type variables (например, `T`) используются для представления типов, которые будут определены позже.
*   Generics можно использовать с функциями, интерфейсами и классами.
*   Многие популярные библиотеки и фреймворки активно используют generics.
