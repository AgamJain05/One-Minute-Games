export const OUTPUT_QUESTIONS = [
  {
    code: 'console.log(typeof null);',
    options: ['"object"', '"null"', '"undefined"', '"number"'],
    answer: '"object"'
  },
  {
    code: 'console.log(0.1 + 0.2 === 0.3);',
    options: ['true', 'false', 'NaN', 'undefined'],
    answer: 'false'
  },
  {
    code: 'console.log("5" + 3);',
    options: ['"53"', '8', '"8"', 'NaN'],
    answer: '"53"'
  },
  {
    code: 'console.log("5" - 3);',
    options: ['2', '"2"', 'NaN', '"53"'],
    answer: '2'
  },
  {
    code: 'console.log([1, 2, 3] + [4, 5, 6]);',
    options: ['"1,2,34,5,6"', '[1,2,3,4,5,6]', 'NaN', 'undefined'],
    answer: '"1,2,34,5,6"'
  },
  {
    code: 'let x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x.length);',
    options: ['4', '3', 'undefined', 'Error'],
    answer: '4'
  },
  {
    code: 'console.log(!!"false" == !!"true");',
    options: ['true', 'false', 'undefined', 'Error'],
    answer: 'true'
  },
  {
    code: 'console.log([] == ![]);',
    options: ['true', 'false', 'undefined', 'Error'],
    answer: 'true'
  },
  {
    code: 'console.log(typeof NaN);',
    options: ['"number"', '"NaN"', '"undefined"', '"object"'],
    answer: '"number"'
  },
  {
    code: 'console.log(1 + "2" + "2");',
    options: ['"122"', '5', '"14"', 'NaN'],
    answer: '"122"'
  },
  {
    code: 'console.log(1 + +"2" + "2");',
    options: ['"32"', '5', '"122"', 'NaN'],
    answer: '"32"'
  },
  {
    code: 'console.log("1" - - "1");',
    options: ['2', '0', '"11"', 'NaN'],
    answer: '2'
  },
  {
    code: 'console.log([] + {} );',
    options: ['"[object Object]"', '{}', '[]', 'undefined'],
    answer: '"[object Object]"'
  },
  {
    code: 'console.log(true + false);',
    options: ['1', '0', 'true', 'false'],
    answer: '1'
  },
  {
    code: 'console.log([...[1, 2], ...[3, 4]]);',
    options: ['[1, 2, 3, 4]', '[1, 2, [3, 4]]', '[[1, 2], [3, 4]]', 'Error'],
    answer: '[1, 2, 3, 4]'
  },
  {
    code: 'let a = {x: 1};\nlet b = {x: 1};\nconsole.log(a == b);',
    options: ['false', 'true', 'undefined', 'Error'],
    answer: 'false'
  },
  {
    code: 'console.log(null == undefined);',
    options: ['true', 'false', 'null', 'undefined'],
    answer: 'true'
  },
  {
    code: 'console.log(null === undefined);',
    options: ['false', 'true', 'null', 'undefined'],
    answer: 'false'
  }
];





