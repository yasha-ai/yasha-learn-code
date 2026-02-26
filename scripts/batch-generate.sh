#!/bin/bash
set -e

API_KEY=${GOOGLE_GEMINI_API_KEY}

if [ -z "$API_KEY" ]; then
  echo "❌ GOOGLE_GEMINI_API_KEY not set"
  exit 1
fi

echo "🚀 Начинаю генерацию 12 уроков..."

# JavaScript (2 remaining)
echo "📦 JavaScript: errors"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js javascript errors "Обработка ошибок"

echo "📦 JavaScript: best-practices"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js javascript best-practices "Best practices"

# TypeScript (6 remaining)
echo "📦 TypeScript: enums"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript enums "Enum и Literal types"

echo "📦 TypeScript: utility-types"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript utility-types "Utility types"

echo "📦 TypeScript: decorators"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript decorators "Декораторы"

echo "📦 TypeScript: namespaces"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript namespaces "Namespaces и модули"

echo "📦 TypeScript: tsconfig"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript tsconfig "Конфигурация tsconfig.json"

echo "📦 TypeScript: best-practices"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js typescript best-practices "Best practices"

# React (3 lessons)
echo "📦 React: jsx"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js react jsx "JSX синтаксис"

echo "📦 React: props-state"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js react props-state "Props и State"

echo "📦 React: hooks"
GOOGLE_GEMINI_API_KEY=$API_KEY node scripts/generate-lesson.js react hooks "Hooks (useState, useEffect)"

echo "✅ Все 11 уроков сгенерированы!"
