## HTML: Скелет. Урок: ARIA States and Properties

ARIA (Accessible Rich Internet Applications) - это набор атрибутов HTML, которые улучшают доступность веб-контента для людей с ограниченными возможностями. ARIA states и properties описывают текущее состояние и характеристики элементов, предоставляя дополнительную информацию для вспомогательных технологий, таких как скринридеры.

### Что такое ARIA States и Properties?

ARIA states (состояния) описывают *динамические* характеристики элемента, которые могут изменяться в результате взаимодействия пользователя.  Например, элемент может быть "выбран" (aria-selected), "развернут" (aria-expanded) или "отключен" (aria-disabled).

ARIA properties (свойства) описывают *статические* характеристики элемента, которые обычно не изменяются.  Например, "роль" элемента (aria-role), его описание (aria-describedby) или связь с другими элементами (aria-controls).

### Примеры кода

Давайте рассмотрим несколько примеров использования ARIA states и properties:

**Пример 1: Кнопка, которая переключает видимость контента**

```html
<button aria-expanded="false" aria-controls="myContent">Показать/Скрыть контент</button>
<div id="myContent" style="display: none;">
  Этот контент будет показан или скрыт при нажатии на кнопку.
</div>

<script>
  const button = document.querySelector('button');
  const content = document.getElementById('myContent');

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded); // Инвертируем состояние

    if (expanded) {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
</script>
```

В этом примере:

*   `aria-expanded="false"` указывает, что контент изначально скрыт.
*   `aria-controls="myContent"` связывает кнопку с элементом, который она контролирует.
*   JavaScript код обновляет значение `aria-expanded` при каждом нажатии на кнопку, сообщая скринридерам об изменении состояния.

**Пример 2: Вкладки (Tabs)**

```html
<div role="tablist" aria-label="Sample Tabs">
  <button role="tab" aria-selected="true" aria-controls="tabpanel-1" id="tab-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="tabpanel-2" id="tab-2">Tab 2</button>

  <div role="tabpanel" id="tabpanel-1" aria-labelledby="tab-1">
    Content for Tab 1.
  </div>
  <div role="tabpanel" id="tabpanel-2" aria-labelledby="tab-2" hidden>
    Content for Tab 2.
  </div>
</div>
```

В этом примере:

*   `role="tablist"` указывает, что это список вкладок.
*   `role="tab"` указывает, что это отдельная вкладка.
*   `aria-selected="true"` указывает, какая вкладка выбрана.
*   `aria-controls` связывает вкладку с ее панелью контента.
*   `aria-labelledby` связывает панель контента с соответствующей вкладкой.
*   `hidden` скрывает неактивную панель контента.  JavaScript код должен будет переключать `aria-selected` и `hidden` при выборе вкладки.

### Жизненный пример

Многие JavaScript фреймворки, такие как React, Angular и Vue.js, активно используют ARIA атрибуты для создания доступных компонентов.  Например, библиотеки компонентов UI часто включают в себя компоненты, такие как модальные окна, выпадающие списки и карусели, которые используют ARIA атрибуты для обеспечения доступности.  На веб-сайтах крупных компаний, таких как Google, Microsoft и Apple, также широко используются ARIA атрибуты для улучшения доступности их веб-контента.  Виджеты, созданные с использованием jQuery UI, также часто включают ARIA для улучшения доступности.

### Ключевые моменты

*   ARIA атрибуты улучшают доступность веб-контента для людей с ограниченными возможностями.
*   ARIA states описывают динамические характеристики элементов.
*   ARIA properties описывают статические характеристики элементов.
*   Использование ARIA атрибутов требует понимания их семантики и правильного применения.
*   Не используйте ARIA, чтобы исправлять ошибки HTML. ARIA предназначен для обогащения доступности, а не для замены правильной семантики.
