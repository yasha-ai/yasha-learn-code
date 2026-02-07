const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const courses = [
  {
    slug: 'html',
    title: 'HTML: Скелет',
    description: 'Изучи фундамент веба — структуру страниц.',
    icon: '💀',
    order: 1,
    lessons: [
      { 
        title: 'Введение в HTML', 
        slug: 'intro', 
        order: 1, 
        content: `# Привет, HTML! 👋

HTML (HyperText Markup Language) — это **скелет** любой веб-страницы. Без него ничего не работает.

## Твоя первая страница

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Моя страница</title>
  </head>
  <body>
    <h1>Привет, мир!</h1>
  </body>
</html>
\`\`\`

## Что здесь происходит?

- \`<!DOCTYPE html>\` — говорит браузеру, что это HTML5
- \`<html>\` — корневой элемент
- \`<head>\` — метаданные (title, стили, скрипты)
- \`<body>\` — видимый контент`
      },
      { 
        title: 'Теги и элементы', 
        slug: 'tags', 
        order: 2, 
        content: `# Теги — кирпичики HTML 🧱

Каждый тег имеет своё назначение.

## Основные теги

| Тег | Назначение |
|-----|------------|
| \`<h1>\`-\`<h6>\` | Заголовки |
| \`<p>\` | Параграф |
| \`<a>\` | Ссылка |
| \`<img>\` | Изображение |
| \`<div>\` | Контейнер |
| \`<span>\` | Инлайн-контейнер |

## Пример

\`\`\`html
<h1>Заголовок</h1>
<p>Это параграф с <a href="https://google.com">ссылкой</a>.</p>
<img src="cat.jpg" alt="Котик">
\`\`\``
      },
    ]
  },
  {
    slug: 'css',
    title: 'CSS: Стиль',
    description: 'Сделай свои страницы красивыми.',
    icon: '🎨',
    order: 2,
    lessons: [
      { 
        title: 'Селекторы', 
        slug: 'selectors', 
        order: 1, 
        content: `# CSS Селекторы 🎯

Селекторы — это способ "нацелиться" на элементы.

## Виды селекторов

\`\`\`css
/* По тегу */
p { color: blue; }

/* По классу */
.highlight { background: yellow; }

/* По ID */
#header { font-size: 24px; }

/* Комбинированные */
div.card { border: 1px solid; }
\`\`\`

## Специфичность

ID > Class > Tag

\`#header\` победит \`.header\` и \`header\`.`
      },
      { 
        title: 'Box Model', 
        slug: 'box-model', 
        order: 2, 
        content: `# Box Model 📦

Каждый элемент — это коробка.

## Слои (изнутри наружу)

1. **Content** — контент
2. **Padding** — внутренний отступ
3. **Border** — граница
4. **Margin** — внешний отступ

\`\`\`css
.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
}
\`\`\`

## box-sizing

\`\`\`css
* {
  box-sizing: border-box; /* Padding и border включены в width */
}
\`\`\``
      },
    ]
  },
  {
    slug: 'javascript',
    title: 'JavaScript: Мозги',
    description: 'Добавь интерактивность и логику.',
    icon: '🧠',
    order: 3,
    lessons: [
      { 
        title: 'Переменные', 
        slug: 'variables', 
        order: 1, 
        content: `# Переменные 📦

Переменные хранят данные.

## Три способа объявить

\`\`\`javascript
const name = "Яша";    // Константа (не меняется)
let age = 1;           // Переменная (может меняться)
var old = "не используй"; // Устаревший способ
\`\`\`

## Правило

**const** по умолчанию, **let** когда нужно изменить.

## Типы данных

\`\`\`javascript
const str = "текст";      // String
const num = 42;           // Number
const bool = true;        // Boolean
const arr = [1, 2, 3];    // Array
const obj = { a: 1 };     // Object
\`\`\``
      },
      { 
        title: 'Функции', 
        slug: 'functions', 
        order: 2, 
        content: `# Функции ⚙️

Функции — переиспользуемые блоки кода.

## Обычная функция

\`\`\`javascript
function greet(name) {
  return \`Привет, \${name}!\`;
}

greet("Яша"); // "Привет, Яша!"
\`\`\`

## Стрелочная функция

\`\`\`javascript
const add = (a, b) => a + b;

add(2, 3); // 5
\`\`\`

## Когда что использовать

- **Обычные** — когда нужен \`this\` или \`arguments\`
- **Стрелочные** — в остальных случаях (короче и чище)`
      },
    ]
  },
  {
    slug: 'typescript',
    title: 'TypeScript: Броня',
    description: 'JavaScript с суперсилой — типами.',
    icon: '🛡️',
    order: 4,
    lessons: [
      { 
        title: 'Зачем TypeScript?', 
        slug: 'why-ts', 
        order: 1, 
        content: `# Зачем TypeScript? 🛡️

TypeScript = JavaScript + Типы

## Проблема JS

\`\`\`javascript
function greet(name) {
  return "Привет, " + name.toUpperCase();
}

greet(42); // Runtime Error! 💥
\`\`\`

## Решение TS

\`\`\`typescript
function greet(name: string): string {
  return "Привет, " + name.toUpperCase();
}

greet(42); // Ошибка при компиляции! ✅
\`\`\`

## Преимущества

- Ловит ошибки **до** запуска
- Автодополнение в IDE
- Документация в коде
- Рефакторинг без страха`
      },
    ]
  },
  {
    slug: 'react',
    title: 'React: Движок',
    description: 'Строй интерфейсы из компонентов.',
    icon: '⚛️',
    order: 5,
    lessons: [
      { 
        title: 'Компоненты', 
        slug: 'components', 
        order: 1, 
        content: `# React Компоненты ⚛️

Компонент = функция, возвращающая JSX.

## Простой компонент

\`\`\`tsx
function Welcome({ name }: { name: string }) {
  return <h1>Привет, {name}!</h1>;
}

// Использование
<Welcome name="Яша" />
\`\`\`

## Props

Props — это входные данные компонента.

\`\`\`tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
\`\`\``
      },
    ]
  },
  {
    slug: 'git',
    title: 'Git: Машина времени',
    description: 'Контроль версий для твоего кода.',
    icon: '🕰️',
    order: 6,
    lessons: [
      { 
        title: 'Init & Commit', 
        slug: 'init-commit', 
        order: 1, 
        content: `# Git Basics 🕰️

Git — система контроля версий.

## Основные команды

\`\`\`bash
git init              # Начать отслеживание
git add .             # Добавить все файлы
git commit -m "msg"   # Сохранить снапшот
git status            # Проверить состояние
git log               # История коммитов
\`\`\`

## Типичный workflow

\`\`\`bash
# 1. Внёс изменения в код
# 2. Проверил что изменилось
git status

# 3. Добавил файлы
git add src/

# 4. Закоммитил
git commit -m "feat: добавил новую фичу"
\`\`\`

## Conventional Commits

- \`feat:\` — новая фича
- \`fix:\` — исправление бага
- \`docs:\` — документация
- \`refactor:\` — рефакторинг`
      },
    ]
  },
]

async function main() {
  console.log('🌱 Начинаю сидинг...')
  
  for (const courseData of courses) {
    const { lessons, ...course } = courseData
    
    const createdCourse = await prisma.course.upsert({
      where: { slug: course.slug },
      update: { ...course },
      create: {
        ...course,
        lessons: {
          create: lessons
        }
      },
    })
    
    console.log(`✅ Курс: ${createdCourse.title}`)
  }
  
  console.log('🎉 Сидинг завершён!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
