#!/usr/bin/env python3
"""
Генерирует интерактивные Sandpack плейграунды для уроков YashaSchool.
Использует Gemini API для создания релевантных примеров кода.
"""

import os
import re
import sys
import time
import subprocess
from google import genai
from google.genai import types

# Config
API_KEY = os.environ.get("GOOGLE_GEMINI_API_KEY")
if not API_KEY:
    print("❌ GOOGLE_GEMINI_API_KEY не задан. Запусти с env переменной.")
    sys.exit(1)
REPO = "/home/xopycaku/clawd/yasha-learn-nextra"
PAGES = os.path.join(REPO, "pages")
BATCH_SIZE = 10

client = genai.Client(api_key=API_KEY)

# Секции для обработки (jquery и git пропускаем)
SECTIONS = {
    "javascript": "vanilla",
    "typescript": "vanilla-ts",
    "css": "vanilla",
    "html": "vanilla",
    "php": "vanilla",  # симулируем через JS
    "react": "react",
}

def has_playground(content):
    return "<Sandpack" in content or "<Playground" in content

def get_lesson_title(content):
    """Извлечь заголовок из MDX файла"""
    m = re.search(r'^#+ (.+)$', content, re.MULTILINE)
    return m.group(1) if m else "урок"

def get_prompt(content, section, template, filename):
    title = get_lesson_title(content)
    # Обрезаем контент до 3000 символов чтобы не превышать лимиты
    short_content = content[:3000] if len(content) > 3000 else content

    files_desc = {
        "vanilla": "файлы /index.html, /styles.css, /index.js",
        "vanilla-ts": "файл /index.ts",
        "react": "файл /App.tsx",
    }.get(template, "файлы /index.html, /index.js")

    php_note = ""
    if section == "php":
        php_note = "\nВАЖНО: это PHP урок, но Sandpack работает только в браузере. Создай JavaScript пример который демонстрирует ТЕ ЖЕ концепции что в уроке (массивы, функции, классы, строки и т.д.) но на JavaScript."

    return f"""Ты создаёшь интерактивный Sandpack playground для урока по веб-разработке.

Тема урока: {title}
Секция: {section}
Файл: {filename}
{php_note}

Содержимое урока (первые 3000 символов):
---
{short_content}
---

Задача: создай рабочий, интерактивный Sandpack пример по теме этого урока.

Верни ТОЛЬКО блок в таком формате (начиная с ## и заканчивая />):

## Интерактивный пример

<Sandpack
  template="{template}"
  files={{{{
    {get_files_template(template)}
  }}}}
  options={{{{
    showNavigator: false,
    showLineNumbers: true,
    editorHeight: 400
  }}}}
/>

СТРОГИЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
1. Внутри template literals (между backtick `) экранируй все ${'{'}...{'}'} как \\${{'{'}...'}'}}
2. Тег </script> внутри backtick строки пиши как <\\/script>
3. Вложенные backtick пиши как \\`
4. Код должен быть рабочим и демонстрировать тему урока
5. Сделай пример ИНТЕРАКТИВНЫМ: кнопки, ввод пользователя, динамические изменения
6. Комментарии в коде на русском языке
7. Используй {files_desc}
8. Стиль: тёмная/нейтральная цветовая схема, padding: 20px, font-family: sans-serif
"""

def get_files_template(template):
    if template == "vanilla":
        return '''"/index.html": `...html код...`,
    "/styles.css": `...css код...`,
    "/index.js": `...js код...`'''
    elif template == "vanilla-ts":
        return '"/index.ts": `...typescript код...`'
    elif template == "react":
        return '"/App.tsx": `...react код...`'
    return '"/index.js": `...js код...`'

def extract_sandpack_block(text):
    """Извлечь блок с Sandpack из ответа Gemini"""
    # Убираем markdown code fences если есть
    text = re.sub(r'```(?:html|jsx|mdx|tsx)?\n', '', text)
    text = re.sub(r'\n```\s*$', '', text, flags=re.MULTILINE)
    text = text.strip()

    # Ищем от ## Интерактивный пример до конца />
    patterns = [
        r'(## Интерактивный пример\s*\n+<Sandpack[\s\S]*?/>)',
        r'(<Sandpack[\s\S]*?/>)',
    ]
    for pattern in patterns:
        m = re.search(pattern, text)
        if m:
            block = m.group(1).strip()
            if not block.startswith("##"):
                block = "## Интерактивный пример\n\n" + block
            return "\n\n" + block
    return None

def generate_playground(content, section, template, filename):
    """Вызов Gemini API для генерации плейграунда"""
    prompt = get_prompt(content, section, template, filename)
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=4096,
            )
        )
        result = response.text
        block = extract_sandpack_block(result)
        if block and "<Sandpack" in block:
            return block
        print(f"  ⚠️  Не нашли <Sandpack в ответе")
        print(f"  Ответ (первые 300 символов): {result[:300]}")
        return None
    except Exception as e:
        print(f"  ❌ Gemini ошибка: {e}")
        return None

def append_playground(mdx_path, playground_block):
    """Добавить плейграунд в конец MDX файла"""
    with open(mdx_path, 'a') as f:
        f.write("\n" + playground_block + "\n")

def commit_batch(files, batch_num, section):
    """Закоммитить батч файлов"""
    if not files:
        return
    subprocess.run(["git", "add"] + files, cwd=REPO, capture_output=True)
    msg = f"feat: add Sandpack playgrounds — {section} batch {batch_num} ({len(files)} lessons)"
    result = subprocess.run(
        ["git", "commit", "-m", msg],
        cwd=REPO, capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"  ✅ Commit: {msg}")
    else:
        print(f"  ⚠️  Commit failed: {result.stderr[:100]}")

def push():
    result = subprocess.run(
        ["git", "push", "origin", "main"],
        cwd=REPO, capture_output=True, text=True
    )
    if result.returncode == 0:
        print("  ✅ Pushed to origin/main")
    else:
        print(f"  ⚠️  Push failed: {result.stderr[:100]}")

def process_section(section, template, limit=None):
    section_path = os.path.join(PAGES, section)
    if not os.path.exists(section_path):
        print(f"⚠️  Папка {section_path} не существует, пропускаем")
        return 0

    mdx_files = sorted([
        f for f in os.listdir(section_path)
        if f.endswith(".mdx") and not f.startswith("_")
    ])

    print(f"\n{'='*60}")
    print(f"📂 Секция: {section} (template: {template})")
    print(f"   Всего файлов: {len(mdx_files)}")

    # Фильтруем те что уже имеют плейграунд
    needs_playground = []
    for fname in mdx_files:
        path = os.path.join(section_path, fname)
        with open(path) as f:
            content = f.read()
        if not has_playground(content):
            needs_playground.append((fname, path, content))

    if limit:
        needs_playground = needs_playground[:limit]

    print(f"   Нужны плейграунды: {len(needs_playground)}")

    if not needs_playground:
        print(f"   ✅ Все уроки уже имеют плейграунды!")
        return 0

    batch_files = []
    batch_num = 1
    total_added = 0

    for i, (fname, path, content) in enumerate(needs_playground):
        lesson_name = fname.replace(".mdx", "")
        print(f"\n  [{i+1}/{len(needs_playground)}] {lesson_name}")

        playground = generate_playground(content, section, template, fname)

        if playground:
            append_playground(path, playground)
            batch_files.append(path)
            total_added += 1
            print(f"  ✅ Добавлен плейграунд")
        else:
            print(f"  ❌ Не удалось сгенерировать плейграунд")

        # Коммитим каждые BATCH_SIZE файлов
        if len(batch_files) >= BATCH_SIZE:
            commit_batch(batch_files, batch_num, section)
            push()
            batch_files = []
            batch_num += 1
            time.sleep(2)  # Небольшая пауза между батчами

        # Задержка между API вызовами
        time.sleep(1.5)

    # Коммитим остаток
    if batch_files:
        commit_batch(batch_files, batch_num, section)

    return total_added

def main():
    print("🚀 Генерация Sandpack плейграундов для YashaSchool")
    print(f"   Секции: {', '.join(SECTIONS.keys())}")
    print(f"   Размер батча: {BATCH_SIZE} файлов\n")

    # Аргументы: [section] [--limit N]
    args = sys.argv[1:]
    start_section = None
    limit = None
    i = 0
    while i < len(args):
        if args[i] == "--limit" and i + 1 < len(args):
            limit = int(args[i+1])
            i += 2
        else:
            start_section = args[i]
            i += 1

    if limit:
        print(f"   ТЕСТ РЕЖИМ: максимум {limit} уроков\n")

    total = 0
    started = start_section is None

    for section, template in SECTIONS.items():
        if start_section and section == start_section:
            started = True
        if not started:
            print(f"⏭️  Пропускаем {section} (начинаем с {start_section})")
            continue

        added = process_section(section, template, limit=limit)
        total += added

    # Финальный пуш
    print(f"\n{'='*60}")
    print(f"🎉 Готово! Добавлено плейграундов: {total}")
    push()

    # Уведомление
    subprocess.run([
        "openclaw", "system", "event",
        "--text", f"Done: сгенерированы плейграунды для yashaschool. Добавлено {total} плейграундов в {len(SECTIONS)} секциях.",
        "--mode", "now"
    ])

if __name__ == "__main__":
    main()
