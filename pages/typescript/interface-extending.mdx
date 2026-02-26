## TypeScript: Броня. Урок 20: Расширение интерфейсов (Interface Extending)

Расширение интерфейсов - это механизм наследования в TypeScript, который позволяет создавать новые интерфейсы на основе существующих. В отличие от классов, интерфейс может расширять несколько других интерфейсов одновременно (множественное наследование). Это мощный инструмент для создания композиций типов и переиспользования кода.

### Базовое расширение

```typescript
// Простое расширение одного интерфейса
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const dog: Dog = {
  name: 'Rex',
  age: 3,
  breed: 'Labrador',
  bark() {
    console.log('Woof!');
  },
};

// Dog должен иметь все свойства Animal плюс свои
// dog.name; // ✓ string
// dog.breed; // ✓ string
```

### Множественное наследование

```typescript
// Интерфейс может расширять несколько интерфейсов
interface Identifiable {
  id: string;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Taggable {
  tags: string[];
}

// Комбинирование нескольких интерфейсов
interface BlogPost extends Identifiable, Timestamped, Taggable {
  title: string;
  content: string;
  author: string;
}

const post: BlogPost = {
  id: 'post-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: ['typescript', 'programming'],
  title: 'Advanced TypeScript',
  content: '...',
  author: 'John Doe',
};

// post имеет все свойства всех родительских интерфейсов
```

### Переопределение свойств

```typescript
// Можно переопределить тип свойства на более специфичный
interface Entity {
  id: string | number;
  metadata?: Record<string, any>;
}

interface User extends Entity {
  id: string; // ✓ Сужение типа (string вместо string | number)
  name: string;
  email: string;
  metadata: {     // ✓ Более специфичный тип
    lastLogin: Date;
    preferences: {
      theme: 'light' | 'dark';
      language: string;
    };
  };
}

const user: User = {
  id: 'user-123', // ✓ Только string
  name: 'Alice',
  email: 'alice@example.com',
  metadata: {
    lastLogin: new Date(),
    preferences: {
      theme: 'dark',
      language: 'en',
    },
  },
};

// ✗ Нельзя расширить тип (сделать менее специфичным)
// interface Product extends Entity {
//   id: string | number | boolean; // ✗ Ошибка!
// }
```

### Практический пример: API Models

```typescript
// Базовая модель для всех API сущностей
interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Модели с возможностью soft delete
interface SoftDeletable {
  deletedAt: Date | null;
  isDeleted: boolean;
}

// Модели с владельцем
interface Ownable {
  ownerId: string;
  owner?: User;
}

// Модели с публичным доступом
interface Publishable {
  isPublished: boolean;
  publishedAt: Date | null;
}

// Конкретные модели
interface User extends BaseModel {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

interface Post extends BaseModel, SoftDeletable, Ownable, Publishable {
  title: string;
  content: string;
  views: number;
}

interface Comment extends BaseModel, SoftDeletable, Ownable {
  postId: string;
  text: string;
  likes: number;
}

// Type-safe функции
function canEdit(entity: Ownable, userId: string): boolean {
  return entity.ownerId === userId;
}

function isVisible(entity: SoftDeletable): boolean {
  return !entity.isDeleted;
}

function getPublished<T extends Publishable>(items: T[]): T[] {
  return items.filter(item => item.isPublished);
}
```

### Жизненный пример: React Components

```typescript
// Базовые props для всех компонентов
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

// Интерактивные элементы
interface InteractiveProps {
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

// Элементы формы
interface FormElementProps {
  name: string;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

// Конкретные компоненты
interface ButtonProps extends BaseComponentProps, InteractiveProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
}

interface InputProps extends BaseComponentProps, FormElementProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
}

interface SelectProps extends BaseComponentProps, FormElementProps {
  options: Array<{ label: string; value: string }>;
  multiple?: boolean;
  placeholder?: string;
}

// Использование
const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  onClick,
  variant = 'primary',
  children,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Расширение generic интерфейсов

```typescript
// Generic базовый интерфейс
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

// Расширение с дополнительными методами
interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

interface PostRepository extends Repository<Post> {
  findByAuthor(authorId: string): Promise<Post[]>;
  findPublished(): Promise<Post[]>;
  incrementViews(postId: string): Promise<void>;
}

// Реализация
class UserRepositoryImpl implements UserRepository {
  async findById(id: string) { /* ... */ return null; }
  async findAll() { /* ... */ return []; }
  async create(data: Omit<User, 'id'>) { /* ... */ return {} as User; }
  async update(id: string, data: Partial<User>) { /* ... */ return {} as User; }
  async delete(id: string) { /* ... */ return true; }
  
  async findByEmail(email: string) { /* ... */ return null; }
  async findByRole(role: string) { /* ... */ return []; }
  async updatePassword(userId: string, newPassword: string) { /* ... */ }
}
```

### Расширение с ограничениями

```typescript
// Generic интерфейс с constraint
interface Comparable<T> {
  compareTo(other: T): number;
}

// Расширение с сохранением generic
interface Named {
  name: string;
}

interface ComparableNamed<T extends Named> extends Comparable<T> {
  getName(): string;
}

// Конкретная реализация
class Person implements ComparableNamed<Person>, Named {
  constructor(public name: string, public age: number) {}
  
  compareTo(other: Person): number {
    return this.age - other.age;
  }
  
  getName(): string {
    return this.name;
  }
}

// Generic функция
function findMax<T extends Comparable<T>>(items: T[]): T | null {
  if (items.length === 0) return null;
  
  let max = items[0];
  for (const item of items) {
    if (item.compareTo(max) > 0) {
      max = item;
    }
  }
  return max;
}
```

### Цепочки расширения

```typescript
// Иерархия интерфейсов
interface Shape {
  area(): number;
  perimeter(): number;
}

interface ColoredShape extends Shape {
  color: string;
  fill(): void;
}

interface LabeledShape extends ColoredShape {
  label: string;
  showLabel(): void;
}

// Глубокая иерархия
class Rectangle implements LabeledShape {
  constructor(
    public width: number,
    public height: number,
    public color: string,
    public label: string
  ) {}
  
  area() {
    return this.width * this.height;
  }
  
  perimeter() {
    return 2 * (this.width + this.height);
  }
  
  fill() {
    console.log(`Filling with ${this.color}`);
  }
  
  showLabel() {
    console.log(`Label: ${this.label}`);
  }
}

// Rectangle должен реализовать все методы всей иерархии
```

### Композиция vs Наследование

```typescript
// Наследование (is-a отношение)
interface Vehicle {
  speed: number;
  accelerate(): void;
}

interface Car extends Vehicle {
  doors: number;
  fuelType: 'petrol' | 'diesel' | 'electric';
}

// Композиция (has-a отношение) - предпочтительнее
interface Engine {
  horsepower: number;
  start(): void;
  stop(): void;
}

interface Transmission {
  type: 'manual' | 'automatic';
  shift(gear: number): void;
}

interface ModernCar extends Vehicle {
  engine: Engine;
  transmission: Transmission;
  doors: number;
}

// Использование композиции более гибко
const myCar: ModernCar = {
  speed: 0,
  doors: 4,
  engine: {
    horsepower: 200,
    start() { console.log('Engine started'); },
    stop() { console.log('Engine stopped'); },
  },
  transmission: {
    type: 'automatic',
    shift(gear) { console.log(`Shifted to gear ${gear}`); },
  },
  accelerate() {
    this.speed += 10;
  },
};
```

### Utility Types для расширения

```typescript
// Создание helper типов для расширения
type WithId<T> = T & { id: string };
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

// Применение
interface BasicUser {
  name: string;
  email: string;
}

type User = WithId<WithTimestamps<BasicUser>>;
// Эквивалентно:
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Generic helper
type Entity<T> = WithId<WithTimestamps<T>>;

type UserEntity = Entity<BasicUser>;
type PostEntity = Entity<{ title: string; content: string }>;
```

### Ключевые моменты

- Интерфейс может расширять один или несколько интерфейсов (`extends`)
- Множественное наследование позволяет комбинировать различные возможности
- Можно переопределять свойства на более специфичные типы (narrowing)
- Нельзя расширить тип (сделать менее специфичным)
- Расширение работает с generic интерфейсами
- Можно создавать глубокие иерархии интерфейсов
- Композиция часто предпочтительнее глубокого наследования
- Используется для создания модульной, переиспользуемой архитектуры типов
- Идеально для моделирования сущностей, компонентов, API
- Комбинируется с utility types для создания гибких абстракций
