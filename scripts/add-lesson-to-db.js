#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

const execAsync = promisify(exec);

// Получаем аргументы: course_slug lesson_slug title order
const [courseSlug, lessonSlug, title, order] = process.argv.slice(2);

if (!courseSlug || !lessonSlug || !title || !order) {
  console.error('Usage: node add-lesson-to-db.js <course_slug> <lesson_slug> "Title" <order>');
  console.error('Example: node add-lesson-to-db.js html forms "Формы и инпуты" 3');
  process.exit(1);
}

// Load .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GOOGLE_GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}
const DB_PATH = path.join(__dirname, '..', 'prisma', 'dev.db');
const GENERATED_DIR = path.join(__dirname, '..', 'generated');

// Соответствие courseSlug → courseId
const COURSE_IDS = {
  'html': 'cmlcfcluv0000kwpnu5c6qvzu',
  'css': 'cmlcfclvf0003kwpnqqwhv3pw',
  'javascript': 'cmlcfclvw0006kwpnlrd2pn3p',
  'typescript': 'cmlcfclwd0009kwpnnqdzp611',
  'react': 'cmlcfclwu000bkwpn9e1ddgs1',
  'git': 'cmlcfclxa000dkwpn6fpgzu20'
};

// Системные промпты для каждого курса
const SYSTEM_PROMPTS = {
  html: `Ты — эксперт по HTML, создающий образовательный курс на русском языке в стиле "Yasha Learn Code".

СТИЛЬ:
- Технический, но доступный
- Практичные примеры кода
- Структура: теория → примеры → практика

ФОРМАТ MARKDOWN:
- Начни с H2 заголовка: ## HTML: [Название темы]
- Подзаголовки используй H3 (###)
- Блоки кода: \`\`\`html
- Комментарии в коде на русском
- В конце: "### 🎯 Практика" с заданиями
- И раздел "### 💡 Совет"

СТРУКТУРА:
1. Что это и зачем
2. Основная теория с примерами
3. Продвинутые примеры
4. Типичные ошибки (опционально)
5. Практика (3-5 заданий)
6. Совет/заключение

Длина: 80-120 строк. Минимум 5 примеров кода. Современный HTML5.`,
  
  css: `Ты — эксперт по CSS, создающий образовательный курс на русском языке.

СТИЛЬ: Технический, практичный, с визуальными примерами.

ФОРМАТ:
- H2: ## CSS: [Название]
- H3 подзаголовки
- Блоки кода: \`\`\`css
- Комментарии на русском
- В конце: "### 🎯 Практика" и "### 💡 Совет"

СТРУКТУРА: теория → примеры → типичные ошибки → практика → совет

Длина: 80-120 строк. Минимум 5-7 примеров. Современный CSS (Grid, Flexbox, Custom Properties).`,

  javascript: `Ты — эксперт по JavaScript, создающий курс на русском языке.

СТИЛЬ: Современный JS (ES6+), практичный, с реальными примерами.

ФОРМАТ:
- H2: ## JavaScript: [Название]
- Блоки кода: \`\`\`javascript
- Комментарии на русском
- Практика и советы в конце

СТРУКТУРА: концепция → примеры → продвинутое использование → типичные баги → практика

Длина: 100-130 строк. Минимум 6-8 примеров. Современный синтаксис (async/await, destructuring, spread).`,

  typescript: `Ты — эксперт по TypeScript, создающий продвинутый курс на русском языке.

СТИЛЬ: Технический, для среднего+ уровня. Показывай типобезопасность и best practices.

ФОРМАТ:
- H2: ## TypeScript: [Название]
- Блоки кода: \`\`\`typescript
- Примеры должны демонстрировать силу типов

СТРУКТУРА: проблема без типов → решение с TypeScript → продвинутые техники → практика

Длина: 100-140 строк. Минимум 6-8 примеров. TypeScript 5.x.`,

  react: `Ты — эксперт по React, создающий курс на русском языке.

СТИЛЬ: Функциональные компоненты, hooks, современный React.

ФОРМАТ:
- H2: ## React: [Название]
- Блоки кода: \`\`\`jsx или \`\`\`typescript (для TSX)
- Комментарии на русском

СТРУКТУРА: концепция → базовый пример → hooks → оптимизация → типичные ошибки → практика

Длина: 100-140 строк. Минимум 5-7 примеров. React 18+.`,

  git: `Ты — эксперт по Git, создающий курс на русском языке.

СТИЛЬ: Практичный, с командами и визуальными схемами (ASCII).

ФОРМАТ:
- H2: ## Git: [Название]
- Блоки кода: \`\`\`bash
- Примеры реальных команд
- Пояснения последствий команд

СТРУКТУРА: задача → команды → примеры → типичные проблемы → практика

Длина: 80-110 строк. Минимум 5-6 примеров команд. Git best practices.`
};

function generateId() {
  return 'cm' + crypto.randomBytes(12).toString('base64url');
}

async function generateContent(courseSlug, title) {
  console.log(`\n📝 Генерирую контент для урока: ${title}`);
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPTS[courseSlug] || SYSTEM_PROMPTS.html
  });

  const prompt = `Создай подробный урок на тему: "${title}".

Генерируй ТОЛЬКО markdown контент, начиная с ## заголовка. Без вступительных фраз.`;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    console.log(`✅ Контент сгенерирован (${content.length} символов)`);
    return content;
  } catch (error) {
    console.error(`❌ Ошибка генерации контента:`, error.message);
    throw error;
  }
}

async function generateImage(title, lessonSlug) {
  console.log(`\n🎨 Генерирую картинку для урока...`);
  
  const prompt = `Modern educational illustration for lesson: "${title}". Premium style, tech aesthetic, blue-purple gradient, abstract geometric shapes, minimalist, professional. No text or labels.`;
  const outputPath = path.join(GENERATED_DIR, `${lessonSlug}.png`);

  const curlScript = path.join(__dirname, '../../scripts/generate-image-curl.sh');
  
  try {
    const { stdout, stderr } = await execAsync(`bash "${curlScript}" "${prompt}" "${outputPath}"`);
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ Картинка сохранена: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Ошибка генерации картинки:`, error.message);
    // Не падаем, продолжаем без картинки
    return null;
  }
}

async function addLessonToDB(courseSlug, lessonSlug, title, order, content) {
  console.log(`\n💾 Добавляю урок в БД...`);
  
  const courseId = COURSE_IDS[courseSlug];
  if (!courseId) {
    throw new Error(`Unknown course: ${courseSlug}`);
  }

  const lessonId = generateId();
  const contentEscaped = content.replace(/'/g, "''"); // SQL escape single quotes
  const titleEscaped = title.replace(/'/g, "''");
  
  const sql = `INSERT INTO Lesson (id, title, slug, content, "order", courseId, createdAt) VALUES ('${lessonId}', '${titleEscaped}', '${lessonSlug}', '${contentEscaped}', ${order}, '${courseId}', datetime('now'));`;

  // Write SQL to temporary file
  const sqlFile = path.join('/tmp', `lesson-${lessonId}.sql`);
  fs.writeFileSync(sqlFile, sql, 'utf8');

  try {
    const { stdout, stderr } = await execAsync(`sqlite3 "${DB_PATH}" < "${sqlFile}"`);
    console.log(`✅ Урок добавлен в БД (id: ${lessonId})`);
    if (stderr) console.error(stderr);
    fs.unlinkSync(sqlFile); // cleanup
  } catch (error) {
    console.error(`❌ Ошибка записи в БД:`, error.message);
    if (fs.existsSync(sqlFile)) fs.unlinkSync(sqlFile);
    throw error;
  }
}

async function main() {
  console.log(`\n🚀 Начинаю генерацию урока...`);
  console.log(`📚 Курс: ${courseSlug}`);
  console.log(`📖 Урок: ${lessonSlug} - ${title} (order: ${order})`);

  try {
    // 1. Генерация контента
    const content = await generateContent(courseSlug, title);
    
    // 2. Сохранение markdown в generated/
    const mdPath = path.join(GENERATED_DIR, `${lessonSlug}.md`);
    fs.writeFileSync(mdPath, content, 'utf8');
    console.log(`✅ Markdown сохранён: ${mdPath}`);

    // 3. Генерация картинки
    await generateImage(title, lessonSlug);

    // 4. Добавление в БД
    await addLessonToDB(courseSlug, lessonSlug, title, order, content);

    console.log(`\n✨ Урок успешно добавлен!\n`);
  } catch (error) {
    console.error(`\n❌ Критическая ошибка:`, error);
    process.exit(1);
  }
}

main();
