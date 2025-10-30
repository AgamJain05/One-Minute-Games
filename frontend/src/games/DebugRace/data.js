export const DEBUG_CHALLENGES = [
  {
    code: 'if (x = 5) { console.log("x is 5"); }',
    problem: 'Comparison not working',
    options: ['Change = to ==', 'Add semicolon', 'Use var instead', 'Remove braces'],
    fix: 'Change = to =='
  },
  {
    code: 'for (let i = 0; i <= arr.length; i++) { arr[i]; }',
    problem: 'Array out of bounds',
    options: ['Change <= to <', 'Start at 1', 'Use i--', 'Remove loop'],
    fix: 'Change <= to <'
  },
  {
    code: 'const result = fetchData(); console.log(result);',
    problem: 'Undefined result',
    options: ['Add await', 'Use var', 'Add .then()', 'Both Add await'],
    fix: 'Add await'
  },
  {
    code: 'obj.hasOwnProperty(key) ? obj.key : null',
    problem: 'Always returns undefined',
    options: ['Use obj[key]', 'Use obj.key', 'Remove ternary', 'Add quotes'],
    fix: 'Use obj[key]'
  },
  {
    code: 'function test() { this.value = 5; }; const t = test();',
    problem: 'Value not set',
    options: ['Use new keyword', 'Use arrow function', 'Add return', 'Use var'],
    fix: 'Use new keyword'
  },
  {
    code: 'const arr = [1,2,3]; arr.map(x => x * 2);',
    problem: 'Array not modified',
    options: ['Assign to variable', 'Use forEach', 'Add return', 'Use push'],
    fix: 'Assign to variable'
  },
  {
    code: 'setTimeout(function() { console.log(this.name); }, 1000);',
    problem: 'this is undefined',
    options: ['Use arrow function', 'Bind this', 'Use var', 'Both Use arrow function'],
    fix: 'Use arrow function'
  },
  {
    code: 'const x = "5"; const y = 3; console.log(x + y);',
    problem: 'Getting "53" instead of 8',
    options: ['Parse x to int', 'Parse y to string', 'Use -', 'Use *'],
    fix: 'Parse x to int'
  },
  {
    code: 'try { riskyOp(); } catch (e) {}',
    problem: 'Silent failures',
    options: ['Log the error', 'Remove try-catch', 'Add finally', 'Use throw'],
    fix: 'Log the error'
  },
  {
    code: 'const count = 0; count++;',
    problem: 'Cannot reassign const',
    options: ['Use let instead', 'Use var', 'Remove const', 'Both Use let instead'],
    fix: 'Use let instead'
  }
];





