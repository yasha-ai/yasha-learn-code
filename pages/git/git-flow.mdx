## Git Flow: Организуем разработку как профессионалы

Git Flow – это популярная методология ветвления, которая помогает командам организовать процесс разработки, особенно в больших проектах. Он структурирует работу с ветками, делая релизы более предсказуемыми и упрощая параллельную разработку.

### Основные ветки Git Flow

Git Flow использует несколько основных веток, каждая из которых имеет свою роль:

*   **`main` (ранее `master`):** Содержит только стабильный, готовый к релизу код. Каждый коммит здесь – это релиз.
*   **`develop`:** Основная ветка для разработки. Здесь интегрируются все новые фичи.
*   **`feature/*`:** Ветки для разработки новых фич. Отходят от `develop` и сливаются обратно в `develop` после завершения работы.
*   **`release/*`:** Ветки для подготовки релизов. Отходят от `develop`, позволяют исправить баги перед релизом и подготовить метаданные (например, номер версии). Сливаются в `main` и `develop`.
*   **`hotfix/*`:** Ветки для срочных исправлений багов в production. Отходят от `main` и сливаются обратно в `main` и `develop`.

### Практические примеры

Предположим, мы работаем над сайтом.

1.  **Начало работы:**

    ```bash
    git checkout develop  # Переключаемся на ветку develop
    ```

2.  **Разработка новой фичи (например, форма обратной связи):**

    ```bash
    git checkout -b feature/contact-form  # Создаем и переключаемся на ветку feature
    # Пишем код для формы обратной связи...
    git add .
    git commit -m "feat: Add contact form"
    git checkout develop
    git merge feature/contact-form  # Сливаем feature в develop
    git branch -d feature/contact-form # Удаляем ветку feature
    git push origin develop
    ```

3.  **Подготовка релиза:**

    ```bash
    git checkout -b release/1.0.0  # Создаем ветку release
    # Исправляем баги, обновляем документацию...
    git add .
    git commit -m "chore: Prepare release 1.0.0"
    git checkout main
    git merge release/1.0.0  # Сливаем в main
    git tag -a 1.0.0 -m "Release 1.0.0" # Создаем тег для релиза
    git checkout develop
    git merge release/1.0.0  # Сливаем обратно в develop
    git branch -d release/1.0.0 # Удаляем ветку release
    git push origin main --tags
    git push origin develop
    ```

4.  **Срочное исправление бага в production:**

    ```bash
    git checkout -b hotfix/critical-bug main # Создаем ветку hotfix от main
    # Исправляем баг...
    git add .
    git commit -m "fix: Critical bug in production"
    git checkout main
    git merge hotfix/critical-bug  # Сливаем в main
    git tag -a 1.0.1 -m "Hotfix 1.0.1" # Создаем тег для hotfix
    git checkout develop
    git merge hotfix/critical-bug  # Сливаем обратно в develop
    git branch -d hotfix/critical-bug # Удаляем ветку hotfix
    git push origin main --tags
    git push origin develop
    ```

### Жизненный пример

Многие крупные проекты и фреймворки используют Git Flow или его вариации. Например, многие open-source проекты на GitHub, крупные веб-приложения, разрабатываемые командами, и даже некоторые фреймворки, такие как Symfony (хотя сейчас переходят к менее строгой модели), использовали Git Flow для организации процесса разработки и релизов. Это позволяет им поддерживать стабильную версию для пользователей и одновременно разрабатывать новые фичи.

### Ключевые моменты

*   Git Flow – это методология ветвления, а не инструмент.
*   `main` – для релизов, `develop` – для разработки.
*   `feature` ветки для разработки новых фич.
*   `release` ветки для подготовки релизов.
*   `hotfix` ветки для срочных исправлений.
*   Git Flow помогает организовать разработку, но может быть избыточным для небольших проектов.
*   Рассмотрите упрощенные варианты, такие как GitHub Flow, если Git Flow кажется слишком сложным.
