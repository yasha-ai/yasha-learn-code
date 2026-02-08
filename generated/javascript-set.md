## JavaScript: Set - Уникальный набор данных

Set в JavaScript – это структура данных, которая позволяет хранить только уникальные значения, независимо от их типа. Он полезен, когда вам нужно быстро проверить наличие элемента или удалить дубликаты из массива.

### Что такое Set?

Set – это объект, который хранит коллекцию значений, где каждое значение может встречаться только один раз. Порядок добавления элементов в Set сохраняется.

```javascript
// Создание нового Set
const mySet = new Set();

// Добавление элементов
mySet.add(1);
mySet.add(2);
mySet.add(3);
mySet.add(1); // Этот элемент не будет добавлен, так как он уже есть

console.log(mySet); // Set(3) { 1, 2, 3 }
```

### Основные методы Set

*   `add(value)`: Добавляет новое значение в Set.
*   `delete(value)`: Удаляет значение из Set. Возвращает `true`, если значение было удалено, и `false` в противном случае.
*   `has(value)`: Проверяет, есть ли значение в Set. Возвращает `true` или `false`.
*   `clear()`: Удаляет все элементы из Set.
*   `size`: Возвращает количество элементов в Set.

```javascript
const mySet = new Set([1, 2, 3]);

console.log(mySet.has(2)); // true
console.log(mySet.delete(2)); // true
console.log(mySet.has(2)); // false
console.log(mySet.size); // 2

mySet.clear();
console.log(mySet.size); // 0
```

### Итерация по Set

Вы можете перебирать элементы Set с помощью цикла `for...of` или метода `forEach`.

```javascript
const mySet = new Set(['apple', 'banana', 'cherry']);

// Используем for...of
for (const item of mySet) {
  console.log(item);
}

// Используем forEach
mySet.forEach(item => {
  console.log(item);
});
```

### Преобразование Set в массив

Иногда вам может потребоваться преобразовать Set обратно в массив. Это можно сделать с помощью оператора расширения (`...`).

```javascript
const mySet = new Set([1, 2, 3]);
const myArray = [...mySet];

console.log(myArray); // [1, 2, 3]
```

### Жизненный пример

Set часто используется для удаления дубликатов из массивов. Например, при получении данных с сервера, которые могут содержать повторяющиеся записи.

```javascript
const data = [1, 2, 2, 3, 4, 4, 5];

// Удаляем дубликаты с помощью Set
const uniqueData = [...new Set(data)];

console.log(uniqueData); // [1, 2, 3, 4, 5]
```

В React часто применяют Set для отслеживания выбранных элементов в списке. Например, пользователь выбирает несколько элементов из списка, и нужно хранить только уникальные идентификаторы этих элементов.

```javascript
// Пример в React (псевдокод)
const [selectedItems, setSelectedItems] = React.useState(new Set());

const handleItemClick = (itemId) => {
  setSelectedItems(prevItems => {
    const newItems = new Set(prevItems);
    if (newItems.has(itemId)) {
      newItems.delete(itemId);
    } else {
      newItems.add(itemId);
    }
    return newItems;
  });
};
```

### Ключевые моменты

*   Set хранит только уникальные значения.
*   Порядок добавления элементов сохраняется.
*   Основные методы: `add`, `delete`, `has`, `clear`, `size`.
*   Можно итерировать с помощью `for...of` и `forEach`.
*   Легко преобразуется в массив с помощью оператора расширения.
*   Часто используется для удаления дубликатов и отслеживания уникальных элементов.
