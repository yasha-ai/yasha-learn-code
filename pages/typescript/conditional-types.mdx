## TypeScript: Броня. Урок 10: Условные типы (Conditional Types)

Условные типы в TypeScript - это мощный инструмент, который позволяет создавать типы, зависящие от условий. Они работают по принципу тернарного оператора: `T extends U ? X : Y`. Если тип `T` совместим с типом `U`, то результат будет `X`, иначе - `Y`. Это открывает невероятные возможности для создания гибких и переиспользуемых типов.

### Базовый синтаксис

Синтаксис условных типов выглядит следующим образом:

```typescript
T extends U ? X : Y
```

Где:
- `T` - проверяемый тип
- `U` - тип для сравнения
- `X` - результат, если условие истинно
- `Y` - результат, если условие ложно

### Простые примеры

```typescript
// Пример 1: Проверка, является ли тип строкой
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<"hello">; // true (строковый литерал)

// Пример 2: Извлечение типа из массива
type ArrayElementType<T> = T extends (infer U)[] ? U : never;

type NumberArray = ArrayElementType<number[]>;  // number
type StringArray = ArrayElementType<string[]>;  // string
type NotArray = ArrayElementType<boolean>;      // never

// Пример 3: Удаление null из типа
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null;
type DefinitelyString = NonNullable<MaybeString>; // string
```

### Распределительные условные типы (Distributive Conditional Types)

Когда условный тип применяется к union типу, TypeScript автоматически "распределяет" проверку на каждый член union:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// Результат: string[] | number[]
// (а не (string | number)[])

// Пример с фильтрацией типов
type Filter<T, U> = T extends U ? T : never;

type OnlyStrings = Filter<string | number | boolean, string>;
// Результат: string

type OnlyNumbers = Filter<string | number | boolean, number>;
// Результат: number
```

### Предотвращение распределения

Иногда нужно избежать распределения. Для этого оборачиваем проверяемый тип в кортеж:

```typescript
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Result1 = ToArrayNonDist<string | number>;
// Результат: (string | number)[]

type ToArray<T> = T extends any ? T[] : never;
type Result2 = ToArray<string | number>;
// Результат: string[] | number[]
```

### Практические примеры

```typescript
// Извлечение типов функций
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

interface User {
  name: string;
  age: number;
  greet(): void;
  login(): Promise<void>;
}

type UserFunctions = FunctionPropertyNames<User>;
// Результат: "greet" | "login"

type UserData = NonFunctionPropertyNames<User>;
// Результат: "name" | "age"

// Unwrap Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>;          // number

// Flatten nested arrays
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type Nested = Flatten<string[][][]>; // string
```

### Жизненный пример

В реальных проектах условные типы часто используются для создания type-safe API:

```typescript
// Система типизированных событий
type EventMap = {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { key: string; value: any };
};

type EventName = keyof EventMap;

// Условный тип для получения типа payload
type EventPayload<T extends EventName> = EventMap[T];

class EventEmitter {
  on<T extends EventName>(
    event: T,
    handler: (payload: EventPayload<T>) => void
  ): void {
    // implementation
  }

  emit<T extends EventName>(event: T, payload: EventPayload<T>): void {
    // implementation
  }
}

const emitter = new EventEmitter();

// TypeScript знает точный тип payload для каждого события
emitter.on('user:login', (data) => {
  console.log(data.userId, data.timestamp); // ✓ типы известны
});

emitter.emit('user:login', {
  userId: '123',
  timestamp: Date.now()
}); // ✓ требует правильный payload

// emitter.emit('user:login', { userId: '123' }); // ✗ ошибка - нет timestamp
```

### Комбинирование с другими продвинутыми типами

```typescript
// Создание ReadonlyDeep типа
type ReadonlyDeep<T> = T extends object
  ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> }
  : T;

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      user: string;
      password: string;
    };
  };
}

type ImmutableConfig = ReadonlyDeep<Config>;
// Все вложенные свойства станут readonly

// Извлечение async функций
type AsyncFunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];

interface API {
  fetchUser(): Promise<User>;
  logout(): void;
  updateProfile(): Promise<void>;
  getName(): string;
}

type AsyncMethods = AsyncFunctionKeys<API>;
// Результат: "fetchUser" | "updateProfile"
```

### Ключевые моменты

- Условные типы позволяют создавать типы на основе условий, используя синтаксис `T extends U ? X : Y`
- При применении к union типам происходит автоматическое распределение (distributive behavior)
- Ключевое слово `infer` позволяет извлекать типы внутри условных типов (подробнее в следующих уроках)
- Условные типы - основа многих встроенных utility типов TypeScript
- Можно предотвратить распределение, оборачивая типы в кортежи
- Используются для создания мощных generic типов и type-safe API
- Комбинируются с mapped types для создания сложных трансформаций типов
- Критически важны для библиотек и фреймворков, работающих с динамическими типами
