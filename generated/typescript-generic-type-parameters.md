## TypeScript: Броня. Урок 27: Generic Type Parameters (Параметры типов)

Generic type parameters - это переменные типов, которые делают возможным создание переиспользуемого кода, работающего с разными типами. Понимание того, как объявлять, ограничивать и использовать type parameters критически важно для создания гибких и type-safe абстракций в TypeScript.

### Именование Type Parameters

```typescript
// Традиционные имена
// T - Type (основной тип)
// K - Key (ключ объекта)
// V - Value (значение)
// E - Element (элемент)
// P - Props (свойства, часто в React)
// S - State (состояние)

// Простой generic
function identity<T>(value: T): T {
  return value;
}

// Множественные параметры
function merge<T, U>(first: T, second: U): T & U {
  return { ...first, ...second };
}

// Более описательные имена для сложных случаев
function createMap<TKey extends string | number, TValue>(
  entries: Array<[TKey, TValue]>
): Map<TKey, TValue> {
  return new Map(entries);
}

// В классах - описательные имена часто лучше
class Repository<TEntity, TId = string> {
  async findById(id: TId): Promise<TEntity | null> {
    // implementation
    return null;
  }
}
```

### Inference Type Parameters

```typescript
// TypeScript выводит типы из аргументов
function toArray<T>(value: T): T[] {
  return [value];
}

const numbers = toArray(42);        // T выведен как number
const strings = toArray('hello');   // T выведен как string

// Множественные параметры с inference
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair(1, 'a');           // [number, string]
const p2 = pair(true, [1, 2, 3]);  // [boolean, number[]]

// Inference с объектами
function mapObject<T extends object, U>(
  obj: T,
  fn: <K extends keyof T>(key: K, value: T[K]) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;
  
  for (const key in obj) {
    result[key] = fn(key, obj[key]);
  }
  
  return result;
}

const user = { name: 'Alice', age: 30 };
// T выводится как { name: string; age: number }
// U выводится из возврата fn
const lengths = mapObject(user, (key, value) => String(value).length);
// { name: number; age: number }
```

### Явное указание Type Parameters

```typescript
// Иногда inference не работает или нужна явность
function createArray<T>(length: number): T[] {
  return new Array(length);
}

// Без явного указания - T = unknown
const arr1 = createArray(3);

// С явным указанием
const arr2 = createArray<number>(3);   // number[]
const arr3 = createArray<string>(5);   // string[]

// Частичное указание (если есть defaults)
function triple<T = number, U = T>(
  first: T,
  second?: U
): [T, U, U] {
  return [first, second as U, second as U];
}

const t1 = triple(42);                    // [number, number, number]
const t2 = triple<string>('hello');       // [string, string, string]
const t3 = triple<number, string>(42, 'a'); // [number, string, string]
```

### Type Parameters в разных контекстах

```typescript
// В функциях
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

// В методах
class Collection<T> {
  private items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  // Метод может иметь свои type parameters
  map<U>(fn: (item: T) => U): Collection<U> {
    const newCollection = new Collection<U>();
    newCollection.items = this.items.map(fn);
    return newCollection;
  }
  
  filter(predicate: (item: T) => boolean): Collection<T> {
    const newCollection = new Collection<T>();
    newCollection.items = this.items.filter(predicate);
    return newCollection;
  }
}

// В типах и интерфейсах
type AsyncResult<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

interface Box<T> {
  value: T;
  map<U>(fn: (value: T) => U): Box<U>;
}

// В type aliases
type Mapper<T, U> = (value: T) => U;
type Predicate<T> = (value: T) => boolean;
```

### Практический пример: Type-safe Event Emitter

```typescript
// Event emitter с параметризованными событиями
type EventMap = Record<string, any>;

class TypedEventEmitter<TEvents extends EventMap> {
  private listeners: Partial<{
    [K in keyof TEvents]: Array<(payload: TEvents[K]) => void>;
  }> = {};
  
  on<K extends keyof TEvents>(
    event: K,
    handler: (payload: TEvents[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(handler);
  }
  
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
  
  off<K extends keyof TEvents>(
    event: K,
    handler: (payload: TEvents[K]) => void
  ): void {
    const handlers = this.listeners[event];
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}

// Определение событий приложения
interface AppEvents {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { key: string; value: unknown };
  'error': { message: string; code: number };
}

// Type-safe emitter
const emitter = new TypedEventEmitter<AppEvents>();

// TypeScript проверяет типы
emitter.on('user:login', (payload) => {
  // payload: { userId: string; timestamp: number }
  console.log(`User ${payload.userId} logged in`);
});

emitter.emit('user:login', {
  userId: '123',
  timestamp: Date.now(),
}); // ✓

// emitter.emit('user:login', { userId: '123' }); // ✗ отсутствует timestamp
```

### Higher-Order Type Parameters

```typescript
// Type parameters принимающие другие type parameters
type Constructor<T = any> = new (...args: any[]) => T;

function Mixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class User {
  constructor(public name: string) {}
}

const TimestampedUser = Mixin(User);
const user = new TimestampedUser('Alice');
// user имеет и name, и timestamp

// Mapped types с type parameters
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
```

### Жизненный пример: Form Builder

```typescript
// Type-safe form builder с параметризованными полями

type FieldValue = string | number | boolean | Date;

interface Field<T extends FieldValue> {
  value: T;
  defaultValue: T;
  validators: Array<(value: T) => string | null>;
  touched: boolean;
  error: string | null;
}

type FieldsConfig<T extends Record<string, FieldValue>> = {
  [K in keyof T]: Omit<Field<T[K]>, 'value' | 'touched' | 'error'>;
};

type FormState<T extends Record<string, FieldValue>> = {
  [K in keyof T]: Field<T[K]>;
};

class FormBuilder<T extends Record<string, FieldValue>> {
  private state: FormState<T>;
  
  constructor(config: FieldsConfig<T>) {
    this.state = {} as FormState<T>;
    
    for (const key in config) {
      this.state[key] = {
        ...config[key],
        value: config[key].defaultValue,
        touched: false,
        error: null,
      };
    }
  }
  
  setValue<K extends keyof T>(field: K, value: T[K]): void {
    this.state[field].value = value;
    this.state[field].touched = true;
    this.validate(field);
  }
  
  getValue<K extends keyof T>(field: K): T[K] {
    return this.state[field].value;
  }
  
  private validate<K extends keyof T>(field: K): void {
    const fieldState = this.state[field];
    
    for (const validator of fieldState.validators) {
      const error = validator(fieldState.value);
      if (error) {
        fieldState.error = error;
        return;
      }
    }
    
    fieldState.error = null;
  }
  
  isValid(): boolean {
    return Object.values(this.state).every(
      (field: any) => field.error === null
    );
  }
  
  getValues(): T {
    const values = {} as T;
    
    for (const key in this.state) {
      values[key] = this.state[key].value;
    }
    
    return values;
  }
}

// Определение формы
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Валидаторы
const emailValidator = (value: string) =>
  value.includes('@') ? null : 'Invalid email';

const passwordValidator = (value: string) =>
  value.length >= 8 ? null : 'Password too short';

// Создание формы
const loginForm = new FormBuilder<LoginForm>({
  email: {
    defaultValue: '',
    validators: [emailValidator],
  },
  password: {
    defaultValue: '',
    validators: [passwordValidator],
  },
  rememberMe: {
    defaultValue: false,
    validators: [],
  },
});

// Type-safe использование
loginForm.setValue('email', 'user@example.com'); // ✓
loginForm.setValue('password', 'secret123');     // ✓
loginForm.setValue('rememberMe', true);          // ✓

// loginForm.setValue('email', 123); // ✗ number не string

if (loginForm.isValid()) {
  const values = loginForm.getValues();
  // values: LoginForm
  console.log(values.email, values.password, values.rememberMe);
}
```

### Variance в Type Parameters

```typescript
// Covariance (out positions)
interface Producer<out T> {
  produce(): T;
}

// Contravariance (in positions)
interface Consumer<in T> {
  consume(value: T): void;
}

// Invariance (both in и out)
interface Box<T> {
  get(): T;
  set(value: T): void;
}

// TypeScript 4.7+ позволяет явно указывать variance
type ReadOnlyBox<out T> = {
  readonly value: T;
};

type WriteOnlyBox<in T> = {
  setValue(value: T): void;
};
```

### Conditional Type Parameters

```typescript
// Type parameters в conditional types
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type Result1 = Awaited<Promise<string>>;           // string
type Result2 = Awaited<Promise<Promise<number>>>; // number

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type Arrays = ToArray<string | number>; // string[] | number[]

// Non-distributive
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;

type Array1 = ToArrayNonDist<string | number>; // (string | number)[]
```

### Best Practices

```typescript
// ✓ Используйте описательные имена для сложных cases
interface Repository<TEntity, TKey extends string | number> {
  findByKey(key: TKey): Promise<TEntity | null>;
}

// ✓ Ограничивайте type parameters когда возможно
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

// ✓ Используйте defaults для часто используемых типов
interface Response<T = unknown, E = Error> {
  data?: T;
  error?: E;
}

// ✗ Избегайте слишком много type parameters
// Трудно читается и использовать
interface Complex<A, B, C, D, E, F, G> {
  // ...
}

// ✓ Группируйте связанные параметры в объекты
interface Better<TConfig extends { /* ... */ }> {
  // ...
}

// ✓ Используйте inference где возможно
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// Не нужно указывать типы явно
const result = map([1, 2, 3], x => x.toString()); // string[]
```

### Ключевые моменты

- Type parameters делают код переиспользуемым для разных типов
- Традиционные имена: T, K, V, E, P, S
- TypeScript выводит типы из аргументов (type inference)
- Можно указывать типы явно когда inference не работает
- Type parameters могут быть ограничены (constraints)
- Можно использовать defaults для type parameters
- Поддерживаются в функциях, методах, классах, интерфейсах, type aliases
- TypeScript 4.7+ поддерживает variance annotations (`in`/`out`)
- Используйте описательные имена для сложных случаев
- Избегайте слишком много type parameters - группируйте в объекты
