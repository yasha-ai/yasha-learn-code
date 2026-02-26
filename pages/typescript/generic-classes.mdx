## TypeScript: Броня. Урок 29: Generic Classes

Generic classes позволяют создавать переиспользуемые классы, которые работают с разными типами данных. Type parameters в классах могут использоваться для полей, методов, конструкторов и статических членов. Это один из самых мощных паттернов ООП в TypeScript для создания гибких и type-safe абстракций.

### Базовый Generic Class

```typescript
// Простой generic класс
class Box<T> {
  private value: T;
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
  
  setValue(value: T): void {
    this.value = value;
  }
}

// Использование
const numberBox = new Box<number>(42);
console.log(numberBox.getValue()); // 42
numberBox.setValue(100);

const stringBox = new Box<string>('hello');
console.log(stringBox.getValue()); // "hello"

// Type inference работает
const inferredBox = new Box(true); // Box<boolean>
```

### Множественные Type Parameters

```typescript
// Класс с несколькими generic параметрами
class Pair<K, V> {
  constructor(
    private key: K,
    private value: V
  ) {}
  
  getKey(): K {
    return this.key;
  }
  
  getValue(): V {
    return this.value;
  }
  
  setPair(key: K, value: V): void {
    this.key = key;
    this.value = value;
  }
}

const pair1 = new Pair<string, number>('age', 30);
const pair2 = new Pair<number, boolean>(1, true);

// Type inference
const pair3 = new Pair('name', 'Alice'); // Pair<string, string>
```

### Generic Methods в Non-Generic Class

```typescript
// Методы могут быть generic даже если класс нет
class Utilities {
  // Generic метод для создания массива
  static createArray<T>(length: number, value: T): T[] {
    return Array(length).fill(value);
  }
  
  // Generic метод для фильтрации
  static filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }
  
  // Generic метод для маппинга
  static map<T, U>(array: T[], fn: (item: T) => U): U[] {
    return array.map(fn);
  }
}

// Использование
const numbers = Utilities.createArray(5, 0);      // number[]
const strings = Utilities.createArray(3, 'hello'); // string[]

const evens = Utilities.filter([1, 2, 3, 4, 5], x => x % 2 === 0); // [2, 4]
const doubled = Utilities.map([1, 2, 3], x => x * 2);              // [2, 4, 6]
```

### Generic Class с Constraints

```typescript
// Generic class с ограничениями
interface Entity {
  id: string;
}

class Repository<T extends Entity> {
  private items: Map<string, T> = new Map();
  
  add(item: T): void {
    this.items.set(item.id, item);
  }
  
  findById(id: string): T | undefined {
    return this.items.get(id);
  }
  
  findAll(): T[] {
    return Array.from(this.items.values());
  }
  
  update(id: string, updates: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...updates };
    this.items.set(id, updated);
    return updated;
  }
  
  delete(id: string): boolean {
    return this.items.delete(id);
  }
  
  count(): number {
    return this.items.size;
  }
}

// Использование с конкретным типом
interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();

userRepo.add({
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
});

const user = userRepo.findById('1'); // User | undefined
```

### Практический пример: Observable

```typescript
// Реализация паттерна Observer с generics
type Observer<T> = (value: T) => void;

class Observable<T> {
  private observers: Set<Observer<T>> = new Set();
  private currentValue: T;
  
  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }
  
  // Подписка на изменения
  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    
    // Немедленно вызываем с текущим значением
    observer(this.currentValue);
    
    // Возвращаем функцию отписки
    return () => {
      this.observers.delete(observer);
    };
  }
  
  // Обновление значения
  next(value: T): void {
    this.currentValue = value;
    this.observers.forEach(observer => observer(value));
  }
  
  // Получение текущего значения
  getValue(): T {
    return this.currentValue;
  }
  
  // Трансформация в новый Observable
  map<U>(fn: (value: T) => U): Observable<U> {
    const mapped = new Observable<U>(fn(this.currentValue));
    
    this.subscribe(value => {
      mapped.next(fn(value));
    });
    
    return mapped;
  }
  
  // Фильтрация значений
  filter(predicate: (value: T) => boolean): Observable<T> {
    const filtered = new Observable<T>(this.currentValue);
    
    this.subscribe(value => {
      if (predicate(value)) {
        filtered.next(value);
      }
    });
    
    return filtered;
  }
}

// Использование
const counter = new Observable<number>(0);

const unsubscribe = counter.subscribe(value => {
  console.log('Counter:', value);
});

counter.next(1);  // Counter: 1
counter.next(2);  // Counter: 2

// Трансформация
const doubled = counter.map(x => x * 2);
doubled.subscribe(value => {
  console.log('Doubled:', value);
}); // Doubled: 4

counter.next(5);  // Counter: 5, Doubled: 10

unsubscribe(); // Отписка
```

### Generic Class Inheritance

```typescript
// Наследование generic классов
class Collection<T> {
  protected items: T[] = [];
  
  add(item: T): void {
    this.items.push(item);
  }
  
  getAll(): T[] {
    return [...this.items];
  }
  
  count(): number {
    return this.items.length;
  }
}

// Расширение с сохранением generic
class SortedCollection<T> extends Collection<T> {
  constructor(private compareFn: (a: T, b: T) => number) {
    super();
  }
  
  add(item: T): void {
    super.add(item);
    this.items.sort(this.compareFn);
  }
  
  findByIndex(index: number): T | undefined {
    return this.items[index];
  }
}

// Расширение с фиксацией типа
class NumberCollection extends Collection<number> {
  sum(): number {
    return this.items.reduce((acc, val) => acc + val, 0);
  }
  
  average(): number {
    return this.sum() / this.count();
  }
}

// Расширение с добавлением generic
class PaginatedCollection<T, TMeta = {}> extends Collection<T> {
  constructor(
    items: T[],
    private metadata: TMeta
  ) {
    super();
    this.items = items;
  }
  
  getMetadata(): TMeta {
    return this.metadata;
  }
}
```

### Жизненный пример: State Machine

```typescript
// Type-safe state machine
type StateDefinition = {
  [state: string]: {
    [event: string]: string; // event -> next state
  };
};

type ExtractStates<T extends StateDefinition> = keyof T;
type ExtractEvents<T extends StateDefinition> = {
  [K in keyof T]: keyof T[K];
}[keyof T];

class StateMachine<
  TStates extends StateDefinition,
  TContext = {}
> {
  private currentState: ExtractStates<TStates>;
  private context: TContext;
  private listeners: Array<(state: ExtractStates<TStates>, context: TContext) => void> = [];
  
  constructor(
    private states: TStates,
    initialState: ExtractStates<TStates>,
    initialContext: TContext
  ) {
    this.currentState = initialState;
    this.context = initialContext;
  }
  
  // Переход в новое состояние
  send(event: ExtractEvents<TStates>): boolean {
    const transitions = this.states[this.currentState];
    const nextState = transitions?.[event as string];
    
    if (!nextState) {
      console.warn(`No transition for event "${String(event)}" in state "${String(this.currentState)}"`);
      return false;
    }
    
    this.currentState = nextState as ExtractStates<TStates>;
    this.notifyListeners();
    return true;
  }
  
  // Получение текущего состояния
  getState(): ExtractStates<TStates> {
    return this.currentState;
  }
  
  // Обновление контекста
  updateContext(updates: Partial<TContext>): void {
    this.context = { ...this.context, ...updates };
    this.notifyListeners();
  }
  
  // Получение контекста
  getContext(): TContext {
    return this.context;
  }
  
  // Подписка на изменения
  subscribe(listener: (state: ExtractStates<TStates>, context: TContext) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentState, this.context));
  }
}

// Определение состояний и переходов
interface TrafficLightStates extends StateDefinition {
  red: { TIMER: 'green' };
  green: { TIMER: 'yellow' };
  yellow: { TIMER: 'red' };
}

interface TrafficLightContext {
  duration: number;
  timestamp: number;
}

// Создание state machine
const trafficLight = new StateMachine<TrafficLightStates, TrafficLightContext>(
  {
    red: { TIMER: 'green' },
    green: { TIMER: 'yellow' },
    yellow: { TIMER: 'red' },
  },
  'red',
  { duration: 0, timestamp: Date.now() }
);

// Подписка на изменения
trafficLight.subscribe((state, context) => {
  console.log(`Current state: ${state}, Duration: ${context.duration}`);
});

// Type-safe переходы
trafficLight.send('TIMER'); // red -> green
trafficLight.send('TIMER'); // green -> yellow
trafficLight.send('TIMER'); // yellow -> red
```

### Static Members в Generic Classes

```typescript
// Статические члены НЕ могут использовать type parameters класса
class Container<T> {
  private value: T;
  
  // ✗ Ошибка: статические члены не могут использовать T
  // static defaultValue: T;
  
  // ✓ Но могут иметь свои generic параметры
  static create<U>(value: U): Container<U> {
    return new Container(value);
  }
  
  static merge<A, B>(
    first: Container<A>,
    second: Container<B>
  ): Container<[A, B]> {
    return new Container<[A, B]>([first.getValue(), second.getValue()]);
  }
  
  constructor(value: T) {
    this.value = value;
  }
  
  getValue(): T {
    return this.value;
  }
}

// Использование статических методов
const container1 = Container.create(42);       // Container<number>
const container2 = Container.create('hello');  // Container<string>

const merged = Container.merge(container1, container2);
// Container<[number, string]>
```

### Abstract Generic Classes

```typescript
// Абстрактные generic классы
abstract class DataSource<T> {
  abstract fetch(): Promise<T[]>;
  abstract save(item: T): Promise<void>;
  
  async getAll(): Promise<T[]> {
    const data = await this.fetch();
    console.log(`Fetched ${data.length} items`);
    return data;
  }
}

// Конкретная реализация
class ApiDataSource<T> extends DataSource<T> {
  constructor(private endpoint: string) {
    super();
  }
  
  async fetch(): Promise<T[]> {
    const response = await fetch(this.endpoint);
    return response.json();
  }
  
  async save(item: T): Promise<void> {
    await fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }
}

// Использование
interface Product {
  id: string;
  name: string;
  price: number;
}

const productSource = new ApiDataSource<Product>('/api/products');
const products = await productSource.getAll();
```

### Ключевые моменты

- Generic classes параметризуются type parameters в объявлении
- Type parameters используются для полей, методов и конструкторов
- Множественные type parameters разделяются запятыми
- Можно применять constraints к type parameters
- Наследование поддерживает generics (можно сохранить, зафиксировать или расширить)
- Статические члены НЕ могут использовать type parameters класса
- Статические методы могут иметь свои собственные generic параметры
- Abstract generic classes определяют контракт для подклассов
- Используются для Collections, Repositories, State Machines, Observables
- Критически важны для создания переиспользуемых ООП абстракций
