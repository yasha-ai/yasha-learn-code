## TypeScript: Броня. Type vs Interface

В TypeScript мы используем `type` и `interface` для определения структуры объектов. Оба инструмента похожи, но имеют ключевые различия, которые важно понимать для написания надежного кода. Давайте разберемся, в чем же разница между ними.

### Что такое Type и Interface?

`Type` и `interface` позволяют нам описывать форму объекта. Они сообщают TypeScript, какие свойства должны быть у объекта и какого типа эти свойства.  Это помогает избежать ошибок на этапе разработки, когда мы пытаемся получить доступ к несуществующим свойствам или присвоить значения неверного типа.

#### Пример Interface

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  email?: string; // Опциональное свойство
}

const user: User = {
  id: 1,
  name: "John Doe",
  age: 30,
};

// const user2: User = { // Ошибка: отсутствует age
//   id: 2,
//   name: "Jane Doe",
// };
```

#### Пример Type Alias

```typescript
type Point = {
  x: number;
  y: number;
};

const point: Point = {
  x: 10,
  y: 20,
};
```

### Ключевые различия

Основное различие заключается в том, что `interface` можно расширять (merge), а `type` - нет.  Interface расширяется с помощью `extends`, а type - с помощью оператора `&` (пересечение типов).  Однако, если два интерфейса с одинаковым именем объявлены в одной области видимости, они будут объединены.  Type Alias нельзя переопределить или объединить.

#### Расширение Interface

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: "Buddy",
  breed: "Golden Retriever",
};
```

#### Пересечение Type

```typescript
type Circle = {
  radius: number;
};

type Color = {
  color: string;
};

type ColoredCircle = Circle & Color;

const coloredCircle: ColoredCircle = {
  radius: 5,
  color: "red",
};
```

#### Union Type (только для Type)

`Type` может использовать оператор `|` для создания union type, который позволяет переменной иметь один из нескольких определенных типов. `Interface` не может этого делать.

```typescript
type Result = string | number;

const result1: Result = "Success";
const result2: Result = 123;
```

### Когда что использовать?

*   **Interface:** Используйте для определения структуры объектов, особенно если планируете расширять их в будущем.  Хорошо подходит для описания контрактов между классами и компонентами.
*   **Type:** Используйте для создания type aliases, union types, intersection types, и для описания простых типов данных (например, примитивов или кортежей).  Также полезен, когда нужно создать более сложное описание типа, которое невозможно выразить с помощью interface.

### Жизненный пример

В React часто используют `interface` для определения props компонентов.  Например:

```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};
```

В Redux, `type` часто используется для определения типов actions и reducers, особенно когда используются union types для описания различных типов действий.

### Ключевые моменты

*   `Interface` расширяется с помощью `extends`, а `type` - с помощью `&`.
*   `Interface` можно объединять (merge), а `type` - нет.
*   `Type` может использовать union types (`|`), `interface` - нет.
*   `Interface` чаще используют для описания структуры объектов и props компонентов.
*   `Type` чаще используют для type aliases, union types, и для описания простых типов данных.
*   Выбор между `type` и `interface` часто зависит от личных предпочтений и стиля кодирования. В большинстве случаев, оба варианта подойдут.
