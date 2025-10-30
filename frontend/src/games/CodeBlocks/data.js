export const CODE_BLOCKS_PROBLEMS = [
  {
    description: 'Arrange these lines to create a valid function:',
    blocks: [
      'function calculateSum(arr) {',
      '  let sum = 0;',
      '  for (let i = 0; i < arr.length; i++) {',
      '    sum += arr[i];',
      '  }',
      '  return sum;',
      '}'
    ]
  },
  {
    description: 'Put these async/await lines in correct order:',
    blocks: [
      'async function fetchData() {',
      '  try {',
      '    const response = await fetch(url);',
      '    const data = await response.json();',
      '    return data;',
      '  } catch (error) {',
      '    console.error(error);',
      '  }',
      '}'
    ]
  },
  {
    description: 'Arrange to create a valid class:',
    blocks: [
      'class User {',
      '  constructor(name, email) {',
      '    this.name = name;',
      '    this.email = email;',
      '  }',
      '  greet() {',
      '    return `Hello, ${this.name}!`;',
      '  }',
      '}'
    ]
  },
  {
    description: 'Order these lines for a valid if-else:',
    blocks: [
      'function checkAge(age) {',
      '  if (age >= 18) {',
      '    return "Adult";',
      '  } else {',
      '    return "Minor";',
      '  }',
      '}'
    ]
  },
  {
    description: 'Arrange to create a valid arrow function:',
    blocks: [
      'const multiply = (a, b) => {',
      '  const result = a * b;',
      '  return result;',
      '};'
    ]
  },
  {
    description: 'Put these array method lines in order:',
    blocks: [
      'const numbers = [1, 2, 3, 4, 5];',
      'const doubled = numbers',
      '  .map(n => n * 2)',
      '  .filter(n => n > 5);',
      'console.log(doubled);'
    ]
  },
  {
    description: 'Arrange to create a valid promise:',
    blocks: [
      'const promise = new Promise((resolve, reject) => {',
      '  setTimeout(() => {',
      '    resolve("Success!");',
      '  }, 1000);',
      '});'
    ]
  },
  {
    description: 'Order these loop lines correctly:',
    blocks: [
      'const items = ["a", "b", "c"];',
      'for (const item of items) {',
      '  console.log(item.toUpperCase());',
      '}'
    ]
  },
  {
    description: 'Arrange to create valid object destructuring:',
    blocks: [
      'const user = {',
      '  name: "Alice",',
      '  age: 30',
      '};',
      'const { name, age } = user;',
      'console.log(name, age);'
    ]
  },
  {
    description: 'Put these switch statement lines in order:',
    blocks: [
      'function getDay(num) {',
      '  switch(num) {',
      '    case 1: return "Monday";',
      '    case 2: return "Tuesday";',
      '    default: return "Unknown";',
      '  }',
      '}'
    ]
  }
];





