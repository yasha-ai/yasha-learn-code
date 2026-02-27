#!/usr/bin/env python3
"""
Генерирует интерактивные Sandpack плейграунды для уроков YashaSchool.
VERSION 2: Simplified approach - меньше кода, один файл, больше output tokens.
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

# MODEL: использовать более мощную модель
# Варианты: gemini-3.1-pro-preview, gemini-2.5-pro-exp, gemini-exp-1206
MODEL = "gemini-3.1-pro-preview"  # Latest pro model

client = genai.Client(api_key=API_KEY)

# Секции для обработки
SECTIONS = {
    "javascript": "vanilla",
    "typescript": "vanilla-ts",
    "css": "vanilla",
    "html": "vanilla",
    "php": "vanilla",
    "react": "react",
}

def has_playground(content):
    return "<Sandpack" in content or "## Интерактивный пример" in content

def get_lesson_title(content):
    """Извлечь заголовок из MDX файла"""
    m = re.search(r'^#+ (.+)$', content, re.MULTILINE)
    return m.group(1) if m else "урок"

def get_prompt_simplified(content, section, template, filename):
    """УПРОЩЁННЫЙ ПРОМПТ: генерируем только 1 файл (App.tsx или index.html)"""
    title = get_lesson_title(content)
    short_content = content[:2000] if len(content) > 2000 else content
    
    if template == "react":
        file_name = "/App.tsx"
        file_desc = "один файл App.tsx с React компонентом"
    else:
        file_name = "/index.html"
        file_desc = "один HTML файл со встроенными стилями и скриптом"
    
    return f"""Создай МИНИМАЛЬНЫЙ рабочий Sandpack playground для урока по веб-разработке.

Тема: {title}
Секция: {section}

Фрагмент урока:
---
{short_content}
---

ЗАДАЧА: Создай самый простой интерактивный пример по теме урока.

ФОРМАТ (верни ТОЛЬКО этот блок):

## Интерактивный пример

<Sandpack
  template="{template}"
  files={{{{
    "{file_name}": `
[КОД ФАЙЛА]
`
  }}}}
/>

ПРАВИЛА:
1. {file_desc}
2. Код должен быть МИНИМАЛЬНЫМ (20-50 строк макс)
3. Пример ИНТЕРАКТИВНЫЙ: кнопка, input, или изменения на click/hover
4. Комментарии на русском
5. Escape всё: \\${{}} для template literals, <\\/script> для тегов
6. Тёмная тема: background #282c34, color white

КРИТИЧЕСКИ ВАЖНО: Блок ДОЛЖЕН заканчиваться на `/>` (закрывающий тег Sandpack).
"""

def extract_sandpack_block(text):
    """Извлечь блок с Sandpack из ответа"""
    text = re.sub(r'```(?:html|jsx|mdx|tsx)?\n', '', text)
    text = re.sub(r'\n```\s*$', '', text, flags=re.MULTILINE)
    text = text.strip()
    
    # Ищем от ## до />
    patterns = [
        r'(## Интерактивный пример\s*\n+<Sandpack[\s\S]*?/>)',
        r'(<Sandpack[\s\S]*?/>)',
    ]
    for pattern in patterns:
        m = re.search(pattern, text)
        if m:
            block = m.group(1).strip()
            # Валидация: должен заканчиваться на />
            if not block.endswith("/>"):
                return None
            if not block.startswith("##"):
                block = "## Интерактивный пример\n\n" + block
            return "\n\n" + block
    return None

def generate_playground(content, section, template, filename, retries=3):
    """Генерация плейграунда с retry"""
    prompt = get_prompt_simplified(content, section, template, filename)
    
    for attempt in range(retries):
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,  # Меньше креативности = больше consistency
                    max_output_tokens=16384,  # Максимум для pro моделей
                )
            )
            result = response.text
            block = extract_sandpack_block(result)
            
            if block and "<Sandpack" in block and block.endswith("/>"):
                return block
            
            if attempt < retries - 1:
                print(f"  ⚠️  Попытка {attempt + 1}/{retries}: блок неполный, повтор через 2сек...")
                time.sleep(2)
            else:
                print(f"  ❌ Не получен полный блок после {retries} попыток")
                
        except Exception as e:
            if attempt < retries - 1:
                print(f"  ⚠️  Попытка {attempt + 1}/{retries}: {e}, повтор...")
                time.sleep(2)
            else:
                print(f"  ❌ API ошибка: {e}")
    
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
    msg = f"feat: add simplified Sandpack playgrounds — {section} batch {batch_num} ({len(files)} lessons)"
    result = subprocess.run(
        ["git", "commit", "-m", msg],
        cwd=REPO, capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"  ✅ Commit: {msg}")

def push():
    result = subprocess.run(
        ["git", "push", "origin", "main"],
        cwd=REPO, capture_output=True, text=True
    )
    if result.returncode == 0:
        print("  ✅ Pushed to origin/main")
    else:
        print(f"  ⚠️  Push: {result.stderr[:150]}")

def process_section(section, template, limit=None):
    section_path = os.path.join(PAGES, section)
    if not os.path.exists(section_path):
        print(f"⚠️  Папка {section_path} не существует")
        return 0
    
    mdx_files = sorted([
        f for f in os.listdir(section_path)
        if f.endswith(".mdx") and not f.startswith("_")
    ])
    
    # Фильтруем уже готовые
    needs_playground = []
    for fname in mdx_files:
        path = os.path.join(section_path, fname)
        with open(path) as f:
            content = f.read()
        if not has_playground(content):
            needs_playground.append((fname, path, content))
    
    if limit:
        needs_playground = needs_playground[:limit]
    
    print(f"\n{'='*60}")
    print(f"📂 {section} (template: {template})")
    print(f"   Всего: {len(mdx_files)} | Нужны плейграунды: {len(needs_playground)}")
    
    if not needs_playground:
        print(f"   ✅ Все уроки готовы!")
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
            print(f"  ✅ Добавлен")
        else:
            print(f"  ❌ Пропущен")
        
        # Коммит каждые N файлов
        if len(batch_files) >= BATCH_SIZE:
            commit_batch(batch_files, batch_num, section)
            push()
            batch_files = []
            batch_num += 1
            time.sleep(3)
        
        time.sleep(1.5)
    
    # Остаток
    if batch_files:
        commit_batch(batch_files, batch_num, section)
        push()
    
    return total_added

def main():
    print(f"🚀 YashaSchool Playground Generator v2")
    print(f"   Model: {MODEL}")
    print(f"   Секции: {', '.join(SECTIONS.keys())}")
    print(f"   Стратегия: упрощённые плейграунды (1 файл)\n")
    
    # Args: [section] [--limit N]
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
        print(f"   ТЕСТ: максимум {limit} уроков\n")
    
    total = 0
    started = start_section is None
    
    for section, template in SECTIONS.items():
        if start_section and section == start_section:
            started = True
        if not started:
            continue
        
        added = process_section(section, template, limit=limit)
        total += added
    
    print(f"\n{'='*60}")
    print(f"🎉 Готово! Добавлено: {total} плейграундов")
    
    # Уведомление
    subprocess.run([
        "openclaw", "system", "event",
        "--text", f"Done: добавлено {total} упрощённых плейграундов (v2, {MODEL})",
        "--mode", "now"
    ])

if __name__ == "__main__":
    main()
