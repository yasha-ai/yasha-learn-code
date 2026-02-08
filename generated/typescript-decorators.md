# TypeScript: Броня. Урок: Декораторы

Декораторы - это мощная метапрограммная возможность TypeScript, позволяющая добавлять и изменять поведение классов, методов, свойств и параметров. Они обеспечивают элегантный способ добавления аннотаций и модификаций к коду во время разработки.

## Что такое декораторы?

Декораторы — это функции, которые могут быть применены к классам, методам, свойствам или параметрам. Они обозначаются символом `@` (собака) перед тем элементом, который они должны изменить. Декораторы позволяют добавлять дополнительную функциональность, такую как логирование, проверка прав доступа, внедрение зависимостей, без изменения самого декорируемого кода.

### Пример простого декоратора класса

```typescript
function logClass(target: Function) {
  // target - это конструктор класса
  console.log(`Класс ${target.name} создан.`);
}

@logClass
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// Вывод в консоль: Класс User создан.
```

В этом примере `logClass` — это декоратор, который просто выводит в консоль сообщение о создании класса `User`.

### Декоратор метода

```typescript
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  // target - прототип класса
  // propertyKey - имя метода
  // descriptor - дескриптор метода

  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Вызван метод ${propertyKey} с аргументами: ${args}`);
    const result = originalMethod.apply(this, args);
    console.log(`Метод ${propertyKey} вернул: ${result}`);
    return result;
  };

  return descriptor;
}

class Calculator {
  @logMethod
  add(x: number, y: number): number {
    return x + y;
  }
}

const calculator = new Calculator();
calculator.add(2, 3);

// Вывод в консоль:
// Вызван метод add с аргументами: 2,3
// Метод add вернул: 5
```

В этом примере декоратор `logMethod` оборачивает метод `add` и логирует информацию о его вызове и возвращаемом значении.

### Декоратор свойства

```typescript
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

class Person {
  @readonly
  name: string = "John Doe";

  constructor() {}
}

const person = new Person();
// person.name = "Jane Doe"; // Ошибка! Свойство только для чтения.
console.log(person.name); // John Doe
```

В этом примере декоратор `readonly` делает свойство `name` класса `Person` доступным только для чтения.

## Жизненный пример

Декораторы широко используются в фреймворках, таких как Angular и NestJS.

*   **Angular:** Декораторы `@Component`, `@Injectable`, `@Input`, `@Output` позволяют определять компоненты, сервисы и связывать данные между ними.
*   **NestJS:** Декораторы `@Controller`, `@Get`, `@Post`, `@Body` позволяют определять контроллеры, маршруты API и получать данные из тела запроса.

Например, в NestJS:

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

В этом примере `@Controller('cats')` объявляет класс `CatsController` как контроллер, обрабатывающий запросы к эндпоинту `/cats`. `@Get()` объявляет метод `findAll` как обработчик GET-запросов к этому эндпоинту.

## Ключевые моменты

*   Декораторы - это функции, применяемые к классам, методам, свойствам или параметрам.
*   Они обозначаются символом `@`.
*   Декораторы позволяют добавлять и изменять поведение кода.
*   Они широко используются во фреймворках, таких как Angular и NestJS, для упрощения разработки.
*   Использование декораторов делает код более читаемым и поддерживаемым.
*   Необходимо включить экспериментальную поддержку декораторов в `tsconfig.json`: `"experimentalDecorators": true`.
