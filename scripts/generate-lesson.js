#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Получаем аргументы командной строки
const [category, slug, title] = process.argv.slice(2);

if (!category || !slug || !title) {
  console.error('Usage: node generate-lesson.js <category> <slug> "Title"');
  console.error('Example: node generate-lesson.js typescript conditional-types "Условные типы"');
  process.exit(1);
}

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GOOGLE_GEMINI_API_KEY environment variable not set');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Системный промпт для генерации урока
const systemPrompt = `Ты — эксперт по TypeScript, создающий образовательный курс на русском языке в стиле "Yasha Learn Code".

СТИЛЬ:
- Технический, но доступный
- Используй метафоры и аналогии (но не переусердствуй)
- Примеры кода должны быть практичными и понятными
- Структура: теория → примеры → практика

ФОРМАТ MDX:
- Начни с H2 заголовка: ## TypeScript: [Название темы]
- Подзаголовки используй H3 (###)
- Блоки кода обязательно с \`\`\`typescript
- Добавляй комментарии в коде на русском
- В конце урока добавь раздел "### 🎯 Практика" с заданиями
- Добавь раздел "### 💡 Совет" с best practices

СТРУКТУРА УРОКА:
1. Вступление (что это и зачем)
2. Основная теория с примерами
3. Продвинутые примеры
4. Типичные ошибки (опционально)
5. Практика (3-5 заданий)
6. Совет/заключение

ТРЕБОВАНИЯ:
- Длина: 100-150 строк кода
- Минимум 5-7 примеров кода
- Каждый пример должен быть рабочим
- Избегай слишком простых примеров (курс для среднего+ уровня)
- Используй современный TypeScript (5.x)

Генерируй ТОЛЬКО содержимое MDX файла, без дополнительных объяснений.`;

async function generateLesson() {
  console.log(`\n🔧 Генерирую урок: ${title}`);
  console.log(`📁 Категория: ${category}, slug: ${slug}\n`);

  try {
    // Инициализируем модель
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    // Генерируем контент
    const prompt = `Создай подробный урок на тему: "${title}".
    
Это продвинутый курс TypeScript. Ученики уже знают базовые типы, интерфейсы, generics, utility types и декораторы.

Урок должен:
1. Объяснить концепцию простым языком
2. Показать практические примеры использования
3. Демонстрировать продвинутые техники
4. Включать типичные ошибки и их решения
5. Предложить практические задания

Генерируй MDX контент напрямую, начиная с ## заголовка.`;

    console.log('⏳ Отправляю запрос к Gemini API...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    // Путь к файлу урока
    const lessonDir = path.join(process.cwd(), 'pages', category);
    const lessonPath = path.join(lessonDir, `${slug}.mdx`);

    // Создаём директорию если не существует
    if (!fs.existsSync(lessonDir)) {
      fs.mkdirSync(lessonDir, { recursive: true });
    }

    // Записываем файл
    fs.writeFileSync(lessonPath, content, 'utf8');
    console.log(`✅ Урок создан: ${lessonPath}`);

    // Обновляем _meta.json
    updateMetaJson(category, slug, title);

    console.log('✨ Готово!\n');
  } catch (error) {
    console.error('❌ Ошибка при генерации:', error.message);
    if (error.message.includes('quota') || error.message.includes('limit')) {
      console.error('\n⚠️  ЛИМИТ API! Переключись на ключ #2:');
      console.error('export GOOGLE_GEMINI_API_KEY=YOUR_API_KEY_HERE\n');
    }
    process.exit(1);
  }
}

function updateMetaJson(category, slug, title) {
  const metaPath = path.join(process.cwd(), 'pages', category, '_meta.json');
  
  let meta = {};
  if (fs.existsSync(metaPath)) {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  }

  // Находим следующий номер урока
  const existingNumbers = Object.values(meta)
    .map(val => {
      const match = val.match(/^(\d+)\./);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);

  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

  // Добавляем новый урок
  meta[slug] = `${nextNumber}. ${title}`;

  // Сохраняем обновлённый _meta.json
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n', 'utf8');
  console.log(`📝 Обновлён _meta.json (урок #${nextNumber})`);
}

// Запускаем генерацию
generateLesson();
