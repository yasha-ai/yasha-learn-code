## CSS: Subgrid – Идеальное выравнивание в сложных сетках

Subgrid – это мощная функция CSS Grid Layout, позволяющая вложенным grid-контейнерам наследовать структуру сетки родительского элемента. Это значительно упрощает создание сложных макетов, где необходимо выравнивать элементы между разными уровнями вложенности.

### Что такое Subgrid?

Представьте, что у вас есть grid-контейнер, внутри которого находится еще один grid-контейнер. Обычно, внутренний контейнер создает свою собственную сетку, независимую от родительской. Subgrid позволяет внутреннему контейнеру "подчиниться" сетке родителя, используя его линии сетки. Это значит, что элементы внутри внутреннего контейнера могут выравниваться с элементами в родительском контейнере.

### Практический пример

Допустим, у нас есть следующая HTML-структура:

```html
<div class="grid-container">
  <div class="item header">Header</div>
  <div class="item sidebar">Sidebar</div>
  <div class="item content">
    <div class="subgrid-container">
      <div class="subitem">Item 1</div>
      <div class="subitem">Item 2</div>
    </div>
  </div>
  <div class="item footer">Footer</div>
</div>
```

Теперь стилизуем это:

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 3fr; /* Два столбца: sidebar и content */
  grid-template-rows: auto 1fr auto; /* Три строки: header, content, footer */
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  height: 500px;
}

.header { grid-area: header; background-color: #eee; }
.sidebar { grid-area: sidebar; background-color: #ddd; }
.content { grid-area: content; background-color: #ccc; }
.footer { grid-area: footer; background-color: #bbb; }

.subgrid-container {
  display: grid;
  grid-column: 2; /* Размещаем в колонке content родительского grid */
  grid-row: 2; /* Размещаем в строке content родительского grid */
  grid-template-columns: subgrid; /* Важно: объявляем subgrid */
  grid-template-rows: subgrid;    /* Важно: объявляем subgrid */
}

.subitem {
  background-color: lightblue;
  border: 1px solid blue;
}

.subitem:nth-child(1) {
  grid-column: 1; /* Размещаем в первой колонке родительской сетки */
  grid-row: 1;    /* Размещаем в первой строке родительской сетки */
}

.subitem:nth-child(2) {
  grid-column: 2; /* Размещаем во второй колонке родительской сетки */
  grid-row: 1;    /* Размещаем в первой строке родительской сетки */
}

.item {
  padding: 10px;
  border: 1px solid black;
}
```

В этом примере `.subgrid-container` наследует столбцы и строки родительского `.grid-container`.  `.subitem` теперь могут позиционироваться относительно сетки родителя.  Обратите внимание на `grid-template-columns: subgrid;` и `grid-template-rows: subgrid;`. Это ключевые строки, которые делают subgrid возможным.

### Жизненный пример

Subgrid часто используется в сложных интерфейсах, таких как панели управления, где необходимо выравнивать элементы в разных секциях.  Например, таблицы с фиксированными заголовками и столбцами.  В различных design systems и UI-библиотеках (например, Material UI, Ant Design, Chakra UI) subgrid может использоваться для построения сложных layouts, где требуется точное выравнивание элементов друг относительно друга, даже если они находятся в разных компонентах. Представьте себе страницу интернет-магазина, где товары в разных категориях должны идеально выравниваться по вертикали и горизонтали, несмотря на разную высоту заголовков или описаний. Subgrid позволяет сделать это легко и эффективно.

### Ключевые моменты

*   **Наследование сетки:** Subgrid позволяет вложенным grid-контейнерам наследовать структуру сетки родителя.
*   **`grid-template-columns: subgrid;` и `grid-template-rows: subgrid;`:**  Эти свойства объявляют subgrid и позволяют вложенному grid-контейнеру использовать grid-линии родителя.
*   **Точное выравнивание:** Subgrid упрощает выравнивание элементов в сложных макетах.
*   **Поддержка браузерами:** Важно проверить совместимость с браузерами, прежде чем использовать subgrid в production. Хотя поддержка растет, старые браузеры могут не поддерживать эту функцию.
