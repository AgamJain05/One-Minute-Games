export const BUGGY_CODE = [
  {
    code: [
      'function addNumbers(a, b) {',
      '  return a + b',
      '}',
      '',
      'const result = addNumbers(5, "10");',
      'console.log(result);'
    ],
    bugs: [4] // Type coercion bug
  },
  {
    code: [
      'const arr = [1, 2, 3, 4, 5];',
      'for (let i = 0; i <= arr.length; i++) {',
      '  console.log(arr[i]);',
      '}'
    ],
    bugs: [1] // Off-by-one error
  },
  {
    code: [
      'function fetchUser() {',
      '  fetch("/api/user")',
      '    .then(response => response.json())',
      '    .then(data => console.log(data));',
      '}',
      '',
      'const user = fetchUser();',
      'console.log(user.name);'
    ],
    bugs: [7] // Using undefined value
  },
  {
    code: [
      'const obj = { name: "John", age: 30 };',
      'for (let key in obj) {',
      '  if (obj.hasOwnProperty(key)) {',
      '    console.log(obj.key);',
      '  }',
      '}'
    ],
    bugs: [3] // Using .key instead of [key]
  },
  {
    code: [
      'function factorial(n) {',
      '  if (n = 0) return 1;',
      '  return n * factorial(n - 1);',
      '}'
    ],
    bugs: [1] // Assignment instead of comparison
  },
  {
    code: [
      'const numbers = [1, 2, 3];',
      'const doubled = [];',
      'for (let i = 0; i < numbers.length; i++);',
      '  doubled.push(numbers[i] * 2);',
      '}',
      'console.log(doubled);'
    ],
    bugs: [2] // Semicolon after for loop
  },
  {
    code: [
      'function sum(a, b) {',
      '  return a + b',
      '}',
      '',
      'const total = sum(10);',
      'console.log(total);'
    ],
    bugs: [4] // Missing argument
  },
  {
    code: [
      'const user = {',
      '  name: "Alice",',
      '  getName: function() {',
      '    setTimeout(function() {',
      '      console.log(this.name);',
      '    }, 1000);',
      '  }',
      '};',
      'user.getName();'
    ],
    bugs: [4] // Lost this context
  },
  {
    code: [
      'const items = ["a", "b", "c"];',
      'items.forEach((item, index) => {',
      '  console.log(items[index + 1]);',
      '});'
    ],
    bugs: [2] // Accessing beyond array bounds
  },
  {
    code: [
      'function findMax(arr) {',
      '  let max = 0;',
      '  for (let i = 0; i < arr.length; i++) {',
      '    if (arr[i] > max) max = arr[i];',
      '  }',
      '  return max;',
      '}'
    ],
    bugs: [1] // Wrong initial value
  },
  {
    code: [
      'const data = JSON.parse(response);',
      'if (data.users.length > 0) {',
      '  console.log(data.users[0].name);',
      '}'
    ],
    bugs: [1] // No null check
  },
  {
    code: [
      'function createElement(tag) {',
      '  const el = document.createElement(tag);',
      '  el.innerText = "Hello";',
      '  return el;',
      '}',
      '',
      'const div = createElement("div");',
      'div.value = "test";'
    ],
    bugs: [7] // value doesn't exist on div
  },
  {
    code: [
      'const promise = fetch("/api/data");',
      'const data = promise.json();',
      'console.log(data);'
    ],
    bugs: [1] // Missing await
  },
  {
    code: [
      'function compare(a, b) {',
      '  return a = b;',
      '}',
      '',
      'if (compare(5, 10)) {',
      '  console.log("Equal");',
      '}'
    ],
    bugs: [1] // Assignment instead of comparison
  },
  {
    code: [
      'const count = 0;',
      'function increment() {',
      '  count++;',
      '}',
      'increment();',
      'console.log(count);'
    ],
    bugs: [0] // const can't be reassigned
  },
  {
    code: [
      'const words = ["hello", "world"];',
      'const result = words.map((word) => {',
      '  word.toUpperCase();',
      '});',
      'console.log(result);'
    ],
    bugs: [2] // Missing return statement
  }
];





