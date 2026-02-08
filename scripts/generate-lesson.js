#!/usr/bin/env node
/**
 * Generate lesson content and image using Gemini API
 * Usage: node scripts/generate-lesson.js "course-slug" "lesson-slug" "Lesson Title"
 */

const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: GOOGLE_GEMINI_API_KEY environment variable is not set!');
  console.error('Please set it in .env.local or export it before running this script.');
  process.exit(1);
}

async function generateContent(courseTitle, lessonTitle, context) {
  const prompt = `Ты — опытный преподаватель программирования. Напиши урок на русском языке для курса "${courseTitle}".

Тема урока: "${lessonTitle}"

Контекст курса: ${context}

Требования к уроку:
1. Начни с краткого введения (2-3 предложения)
2. Объясни концепцию простым языком с примерами кода
3. Используй markdown форматирование
4. Добавь практические примеры кода с комментариями
5. Добавь раздел "🌍 Жизненный пример" — покажи, где и как это применяется в реальных проектах (сайты, приложения, фреймворки)
6. В конце добавь раздел "🔑 Ключевые моменты" с bullet points
7. Длина: 400-600 слов
8. Код должен быть в блоках с указанием языка (\`\`\`javascript, \`\`\`html и т.д.)
9. Добавь эмодзи для визуального оформления заголовков

Формат ответа: только markdown текст урока, без дополнительных комментариев.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    })
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`);
  }
  
  return data.candidates[0].content.parts[0].text;
}

async function generateImage(lessonTitle, courseTitle) {
  const prompt = `Educational illustration for programming lesson. Topic: "${lessonTitle}" from "${courseTitle}" course. 
Style: Modern, clean, minimalist tech illustration. Dark blue gradient background. 
Include: Relevant programming symbols, code snippets visualization, abstract tech elements.
Colors: Deep blue (#1a1a2e), purple accents (#6366f1), cyan highlights (#22d3ee).
NO text, NO words, just visual elements.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('Image generation error:', data.error.message);
    return null;
  }
  
  // Find image part in response
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return Buffer.from(part.inlineData.data, 'base64');
    }
  }
  
  return null;
}

async function main() {
  const [,, courseSlug, lessonSlug, lessonTitle] = process.argv;
  
  if (!courseSlug || !lessonSlug || !lessonTitle) {
    console.error('Usage: node generate-lesson.js <course-slug> <lesson-slug> "Lesson Title"');
    process.exit(1);
  }

  const courseInfo = {
    'html': { title: 'HTML: Скелет', context: 'Основы HTML, структура веб-страниц' },
    'css': { title: 'CSS: Стиль', context: 'Стилизация веб-страниц, селекторы, свойства' },
    'javascript': { title: 'JavaScript: Мозги', context: 'Программирование на JavaScript, логика, DOM' },
    'typescript': { title: 'TypeScript: Броня', context: 'Типизированный JavaScript, интерфейсы, типы' },
    'react': { title: 'React: Движок', context: 'Компонентный подход, хуки, состояние' },
    'git': { title: 'Git: Машина времени', context: 'Контроль версий, ветки, коммиты' },
  };

  const course = courseInfo[courseSlug];
  if (!course) {
    console.error(`Unknown course: ${courseSlug}`);
    process.exit(1);
  }

  console.log(`🎓 Generating lesson: ${lessonTitle}`);
  console.log(`📚 Course: ${course.title}`);
  
  // Generate content
  console.log('📝 Generating content via Gemini...');
  const content = await generateContent(course.title, lessonTitle, course.context);
  console.log('✅ Content generated!');
  
  // Generate image
  console.log('🎨 Generating image via Gemini...');
  const imageBuffer = await generateImage(lessonTitle, course.title);
  
  // Save outputs
  const outputDir = path.join(__dirname, '..', 'generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save content
  const contentPath = path.join(outputDir, `${courseSlug}-${lessonSlug}.md`);
  fs.writeFileSync(contentPath, content);
  console.log(`💾 Content saved: ${contentPath}`);
  
  // Save image if generated
  if (imageBuffer) {
    const imagePath = path.join(outputDir, `${courseSlug}-${lessonSlug}.png`);
    fs.writeFileSync(imagePath, imageBuffer);
    console.log(`🖼️ Image saved: ${imagePath}`);
  } else {
    console.log('⚠️ Image generation skipped or failed');
  }
  
  // Output for seed.js format
  console.log('\n📋 Seed.js format:');
  console.log('---');
  const escapedContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  console.log(`{
  title: '${lessonTitle}',
  slug: '${lessonSlug}',
  order: X, // Set appropriate order
  content: \`${escapedContent}\`
}`);
  console.log('---');
  
  console.log('\n✅ Done!');
}

main().catch(console.error);
