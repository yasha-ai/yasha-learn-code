#!/bin/bash
set -e

GEMINI_KEY=${GEMINI_API_KEY}

if [ -z "$GEMINI_KEY" ]; then
  echo "❌ GEMINI_API_KEY not set"
  exit 1
fi

SCRIPT_PATH="/home/xopycaku/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py"
OUTPUT_DIR="/home/xopycaku/clawd/yasha-learn-code/public/lessons"

echo "🎨 Генерирую 12 картинок для уроков..."

# JavaScript
echo "📦 javascript-modules.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "Modern JavaScript ES6 modules concept: import and export statements, modular code architecture, clean tech aesthetic with dark premium colors, floating code blocks, interconnected module diagram" \
  --filename "$OUTPUT_DIR/javascript-modules.png" \
  --resolution 1K

echo "📦 javascript-errors.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "JavaScript error handling visualization: try-catch blocks, error objects, debugging workflow, red alert symbols mixed with green success indicators, professional dark UI style" \
  --filename "$OUTPUT_DIR/javascript-errors.png" \
  --resolution 1K

echo "📦 javascript-best-practices.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "JavaScript best practices golden rules: clean code principles, performance optimization icons, security shield, testing symbols, premium gold and blue color scheme" \
  --filename "$OUTPUT_DIR/javascript-best-practices.png" \
  --resolution 1K

# TypeScript
echo "📦 typescript-enums.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript enum types visualization: enumerated values list, type safety shield, literal types diagram, structured data representation, blue and purple tech colors" \
  --filename "$OUTPUT_DIR/typescript-enums.png" \
  --resolution 1K

echo "📦 typescript-utility-types.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript utility types toolbox: Partial, Pick, Omit, Record type transformations, swiss army knife concept, advanced type manipulation, elegant dark design" \
  --filename "$OUTPUT_DIR/typescript-utility-types.png" \
  --resolution 1K

echo "📦 typescript-decorators.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript decorators concept: @ symbol, function wrapping layers, metadata annotation, aspect-oriented programming, decorative elements with modern tech aesthetic" \
  --filename "$OUTPUT_DIR/typescript-decorators.png" \
  --resolution 1K

echo "📦 typescript-namespaces.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript namespaces and modules organization: nested folder structure, namespace hierarchy tree, code organization diagram, clean architecture visualization" \
  --filename "$OUTPUT_DIR/typescript-namespaces.png" \
  --resolution 1K

echo "📦 typescript-tsconfig.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript tsconfig.json configuration: settings panel, compiler options checkboxes, JSON structure, project setup dashboard, professional configuration UI" \
  --filename "$OUTPUT_DIR/typescript-tsconfig.png" \
  --resolution 1K

echo "📦 typescript-best-practices.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "TypeScript best practices guide: type safety principles, strict mode badge, quality assurance symbols, enterprise-grade code standards, gold medal with TS logo" \
  --filename "$OUTPUT_DIR/typescript-best-practices.png" \
  --resolution 1K

# React
echo "📦 react-jsx.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "React JSX syntax visualization: HTML-like syntax in JavaScript, component markup, JSX transformation diagram, React logo with code brackets, cyan and white colors" \
  --filename "$OUTPUT_DIR/react-jsx.png" \
  --resolution 1K

echo "📦 react-props-state.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "React Props and State concept: data flow arrows, component communication diagram, state management icons, props passing visualization, interactive UI elements" \
  --filename "$OUTPUT_DIR/react-props-state.png" \
  --resolution 1K

echo "📦 react-hooks.png"
GEMINI_API_KEY=$GEMINI_KEY uv run $SCRIPT_PATH \
  --prompt "React Hooks useState and useEffect: fishing hooks metaphor with React logo, state lifecycle diagram, side effects visualization, modern functional components, blue gradient" \
  --filename "$OUTPUT_DIR/react-hooks.png" \
  --resolution 1K

echo "✅ Все 12 картинок сгенерированы!"
