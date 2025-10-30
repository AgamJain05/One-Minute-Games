// =============================================
// GLOBAL STATE & UTILITIES
// =============================================

let currentChallenge = null;
let timerInterval = null;
let timeRemaining = 60;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateBestScores();
    updateStreak();
});

// Navigation
function startChallenge(type) {
    currentChallenge = type;
    hideAllScreens();
    document.getElementById(`${type}-screen`).classList.add('active');
}

function goHome() {
    hideAllScreens();
    document.getElementById('home-screen').classList.add('active');
    currentChallenge = null;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Timer
function startTimer(callback) {
    timeRemaining = 60;
    const timerElement = document.getElementById(`${currentChallenge}-timer`);
    timerElement.textContent = timeRemaining;
    timerElement.classList.remove('warning');
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = timeRemaining;
        
        if (timeRemaining <= 10) {
            timerElement.classList.add('warning');
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            callback();
        }
    }, 1000);
}

// Local Storage Functions
function saveScore(challenge, score) {
    const key = `${challenge}-best`;
    const currentBest = localStorage.getItem(key);
    
    if (!currentBest || score > parseFloat(currentBest)) {
        localStorage.setItem(key, score);
        updateBestScores();
    }
}

function updateBestScores() {
    const challenges = ['codetype', 'bugspot', 'terminal', 'output', 'regex', 'http', 'algorithm', 'git', 'codeblocks', 'sql', 'flexbox', 'datastructure', 'colorcode', 'cssselector', 'binaryconv', 'jsonpath', 'debugrace', 'apibuilder'];
    
    challenges.forEach(challenge => {
        const key = `${challenge}-best`;
        const best = localStorage.getItem(key);
        const element = document.getElementById(`${challenge}-best`);
        
        if (best && element) {
            element.textContent = `Best: ${best}`;
        }
    });
}

function loadStats() {
    const totalChallenges = localStorage.getItem('total-challenges') || 0;
    const totalTime = localStorage.getItem('total-time') || 0;
    
    document.getElementById('total-challenges').textContent = totalChallenges;
    document.getElementById('total-time').textContent = totalTime;
}

function incrementStats() {
    const totalChallenges = parseInt(localStorage.getItem('total-challenges') || 0) + 1;
    const totalTime = parseInt(localStorage.getItem('total-time') || 0) + 1;
    
    localStorage.setItem('total-challenges', totalChallenges);
    localStorage.setItem('total-time', totalTime);
    loadStats();
    
    // Update last played date for streak
    const today = new Date().toDateString();
    localStorage.setItem('last-played', today);
    updateStreak();
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem('last-played');
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let currentStreak = parseInt(localStorage.getItem('current-streak') || 0);
    
    if (lastPlayed === today) {
        // Already played today
    } else if (lastPlayed === yesterday) {
        // Played yesterday, continue streak
        currentStreak++;
        localStorage.setItem('current-streak', currentStreak);
    } else if (!lastPlayed) {
        // First time playing
        currentStreak = 0;
    } else {
        // Streak broken
        currentStreak = 0;
        localStorage.setItem('current-streak', currentStreak);
    }
    
    document.getElementById('current-streak').textContent = currentStreak;
}

// Utility function to shuffle array
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// =============================================
// CHALLENGE 1: CODETYPE
// =============================================

const codeSnippets = [
    {
        language: 'JavaScript',
        code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`
    },
    {
        language: 'Python',
        code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
    },
    {
        language: 'JavaScript',
        code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`
    },
    {
        language: 'TypeScript',
        code: `interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): Promise<User> => {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}`
    },
    {
        language: 'JavaScript',
        code: `class BinarySearchTree {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
  
  insert(value) {
    if (value < this.value) {
      if (this.left === null) {
        this.left = new BinarySearchTree(value);
      } else {
        this.left.insert(value);
      }
    } else {
      if (this.right === null) {
        this.right = new BinarySearchTree(value);
      } else {
        this.right.insert(value);
      }
    }
  }
}`
    },
    {
        language: 'JavaScript',
        code: `const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};`
    },
    {
        language: 'Python',
        code: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        return self.items.pop() if self.items else None
    
    def peek(self):
        return self.items[-1] if self.items else None`
    },
    {
        language: 'JavaScript',
        code: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    return cache[key] = fn.apply(this, args);
  };
}`
    },
    {
        language: 'TypeScript',
        code: `type ApiResponse<T> = {
  data: T;
  error: string | null;
  loading: boolean;
};

async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { data, error: null, loading: false };
  } catch (err) {
    return { data: null, error: err.message, loading: false };
  }
}`
    },
    {
        language: 'JavaScript',
        code: `const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};`
    },
    {
        language: 'Python',
        code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    {
        language: 'JavaScript',
        code: `class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  
  append(value) {
    const node = { value, next: null };
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }
}`
    },
    {
        language: 'Python',
        code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
    },
    {
        language: 'JavaScript',
        code: `const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
  );
};`
    },
    {
        language: 'TypeScript',
        code: `class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  peek(): T | undefined {
    return this.items[0];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}`
    }
];

let codetypeState = {
    code: '',
    startTime: null,
};

function startCodetypeChallenge() {
    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    codetypeState = {
        code: snippet.code,
        startTime: Date.now(),
    };
    
    document.getElementById('codetype-results').classList.add('hidden');
    document.getElementById('codetype-start').classList.add('hidden');
    document.getElementById('code-language').textContent = snippet.language;
    document.getElementById('code-text').textContent = snippet.code;
    
    const input = document.getElementById('code-input');
    input.value = '';
    input.disabled = false;
    input.focus();
    
    startTimer(endCodetypeChallenge);
}

function endCodetypeChallenge() {
    const input = document.getElementById('code-input');
    input.disabled = true;
    
    const typedCode = input.value;
    const correctChars = typedCode.split('').filter((char, i) => char === codetypeState.code[i]).length;
    const totalChars = typedCode.length;
    const minutes = (Date.now() - codetypeState.startTime) / 60000;
    const cpm = Math.round(correctChars / minutes);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    const score = Math.round(cpm * (accuracy / 100));
    
    document.getElementById('codetype-cpm').textContent = cpm;
    document.getElementById('codetype-accuracy').textContent = `${accuracy}%`;
    document.getElementById('codetype-score').textContent = score;
    document.getElementById('codetype-results').classList.remove('hidden');
    
    saveScore('codetype', score);
    incrementStats();
}

// =============================================
// CHALLENGE 2: BUG SPOTTER
// =============================================

const buggyCode = [
    {
        code: [
            'function addNumbers(a, b) {',
            '  return a + b',
            '}',
            '',
            'const result = addNumbers(5, "10");',
            'console.log(result);'
        ],
        bugs: [4] // Line with type coercion bug
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
        bugs: [4] // Missing argument (NaN result)
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
        bugs: [1] // Wrong initial value (fails with negative numbers)
    },
    {
        code: [
            'const data = JSON.parse(response);',
            'if (data.users.length > 0) {',
            '  console.log(data.users[0].name);',
            '}'
        ],
        bugs: [1] // No null check before accessing
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
        bugs: [7] // value doesn\'t exist on div
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
        bugs: [0] // const can\'t be reassigned
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

let bugspotState = {
    currentCode: null,
    score: 0,
    totalAttempts: 0,
    correctAttempts: 0,
};

function startBugspotChallenge() {
    bugspotState = {
        currentCode: null,
        score: 0,
        totalAttempts: 0,
        correctAttempts: 0,
    };
    
    document.getElementById('bugspot-results').classList.add('hidden');
    document.getElementById('bugspot-start').classList.add('hidden');
    document.getElementById('bugspot-score').textContent = '0';
    
    generateBugProblem();
    startTimer(endBugspotChallenge);
}

function generateBugProblem() {
    const problem = buggyCode[Math.floor(Math.random() * buggyCode.length)];
    bugspotState.currentCode = problem;
    
    const codeDisplay = document.getElementById('bugspot-code');
    codeDisplay.innerHTML = '';
    
    problem.code.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'code-line';
        lineDiv.textContent = line || ' ';
        lineDiv.dataset.lineNumber = index;
        lineDiv.onclick = () => checkBugLine(index);
        codeDisplay.appendChild(lineDiv);
    });
}

function checkBugLine(lineNumber) {
    if (!timerInterval) return;
    
    bugspotState.totalAttempts++;
    
    const lineElement = document.querySelector(`[data-line-number="${lineNumber}"]`);
    
    if (bugspotState.currentCode.bugs.includes(lineNumber)) {
        bugspotState.score++;
        bugspotState.correctAttempts++;
        lineElement.classList.add('found');
        document.getElementById('bugspot-score').textContent = bugspotState.score;
        
        setTimeout(() => {
            if (timerInterval) {
                generateBugProblem();
            }
        }, 500);
    } else {
        lineElement.style.background = 'rgba(239, 68, 68, 0.2)';
        setTimeout(() => {
            if (lineElement && !lineElement.classList.contains('found')) {
                lineElement.style.background = '';
            }
        }, 300);
    }
}

function endBugspotChallenge() {
    const accuracy = bugspotState.totalAttempts > 0 
        ? Math.round((bugspotState.correctAttempts / bugspotState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('bugspot-found').textContent = bugspotState.score;
    document.getElementById('bugspot-accuracy').textContent = `${accuracy}%`;
    document.getElementById('bugspot-results').classList.remove('hidden');
    
    saveScore('bugspot', bugspotState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 3: TERMINAL MASTER
// =============================================

const terminalCommands = [
    { question: 'List all files and directories', options: ['ls', 'cd', 'pwd', 'mkdir'], answer: 'ls' },
    { question: 'Change directory', options: ['cd', 'ls', 'mv', 'rm'], answer: 'cd' },
    { question: 'Print working directory', options: ['pwd', 'cd', 'ls', 'echo'], answer: 'pwd' },
    { question: 'Create a new directory', options: ['mkdir', 'touch', 'rm', 'mv'], answer: 'mkdir' },
    { question: 'Remove a file', options: ['rm', 'rmdir', 'del', 'mv'], answer: 'rm' },
    { question: 'Copy a file', options: ['cp', 'mv', 'copy', 'clone'], answer: 'cp' },
    { question: 'Move or rename a file', options: ['mv', 'cp', 'rename', 'move'], answer: 'mv' },
    { question: 'Display file contents', options: ['cat', 'ls', 'show', 'read'], answer: 'cat' },
    { question: 'Search for text in files', options: ['grep', 'find', 'search', 'locate'], answer: 'grep' },
    { question: 'Find files and directories', options: ['find', 'locate', 'search', 'grep'], answer: 'find' },
    { question: 'Change file permissions', options: ['chmod', 'chown', 'perms', 'access'], answer: 'chmod' },
    { question: 'Display disk usage', options: ['df', 'du', 'disk', 'space'], answer: 'df' },
    { question: 'Show running processes', options: ['ps', 'top', 'proc', 'tasks'], answer: 'ps' },
    { question: 'Download file from URL', options: ['wget', 'curl', 'download', 'get'], answer: 'wget' },
    { question: 'Archive files', options: ['tar', 'zip', 'archive', 'compress'], answer: 'tar' },
];

let terminalState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startTerminalChallenge() {
    terminalState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('terminal-results').classList.add('hidden');
    document.getElementById('terminal-start').classList.add('hidden');
    document.getElementById('terminal-score').textContent = '0';
    
    generateTerminalQuestion();
    startTimer(endTerminalChallenge);
}

function generateTerminalQuestion() {
    const question = terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
    terminalState.currentQuestion = question;
    
    document.getElementById('terminal-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('terminal-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray(question.options);
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkTerminalAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkTerminalAnswer(selected) {
    if (!timerInterval) return;
    
    terminalState.totalAttempts++;
    const buttons = document.querySelectorAll('#terminal-options .option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === terminalState.currentQuestion.answer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selected && selected !== terminalState.currentQuestion.answer) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === terminalState.currentQuestion.answer) {
        terminalState.score++;
        document.getElementById('terminal-score').textContent = terminalState.score;
    }
    
    setTimeout(() => {
        if (timerInterval) {
            generateTerminalQuestion();
        }
    }, 800);
}

function endTerminalChallenge() {
    const accuracy = terminalState.totalAttempts > 0 
        ? Math.round((terminalState.score / terminalState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('terminal-correct').textContent = terminalState.score;
    document.getElementById('terminal-accuracy').textContent = `${accuracy}%`;
    document.getElementById('terminal-results').classList.remove('hidden');
    
    saveScore('terminal', terminalState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 4: OUTPUT PREDICTOR
// =============================================

const outputQuestions = [
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
        code: 'console.log("5" * "2");',
        options: ['10', '"10"', '"52"', 'NaN'],
        answer: '10'
    },
    {
        code: 'console.log([] + null + 1);',
        options: ['"null1"', '1', '"1"', 'NaN'],
        answer: '"null1"'
    }
];

let outputState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startOutputChallenge() {
    outputState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('output-results').classList.add('hidden');
    document.getElementById('output-start').classList.add('hidden');
    document.getElementById('output-score').textContent = '0';
    
    generateOutputQuestion();
    startTimer(endOutputChallenge);
}

function generateOutputQuestion() {
    const question = outputQuestions[Math.floor(Math.random() * outputQuestions.length)];
    outputState.currentQuestion = question;
    
    document.getElementById('output-code').textContent = question.code;
    
    const optionsContainer = document.getElementById('output-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray(question.options);
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkOutputAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkOutputAnswer(selected) {
    if (!timerInterval) return;
    
    outputState.totalAttempts++;
    const buttons = document.querySelectorAll('#output-options .option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === outputState.currentQuestion.answer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selected && selected !== outputState.currentQuestion.answer) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === outputState.currentQuestion.answer) {
        outputState.score++;
        document.getElementById('output-score').textContent = outputState.score;
    }
    
    setTimeout(() => {
        if (timerInterval) {
            generateOutputQuestion();
        }
    }, 800);
}

function endOutputChallenge() {
    const accuracy = outputState.totalAttempts > 0 
        ? Math.round((outputState.score / outputState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('output-correct').textContent = outputState.score;
    document.getElementById('output-accuracy').textContent = `${accuracy}%`;
    document.getElementById('output-results').classList.remove('hidden');
    
    saveScore('output', outputState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 5: REGEX MATCHER
// =============================================

const regexQuestions = [
    { pattern: /^\d{3}-\d{3}-\d{4}$/, string: '123-456-7890', matches: true },
    { pattern: /^\d{3}-\d{3}-\d{4}$/, string: '123-45-6789', matches: false },
    { pattern: /^[a-zA-Z]+$/, string: 'Hello', matches: true },
    { pattern: /^[a-zA-Z]+$/, string: 'Hello123', matches: false },
    { pattern: /\d+/, string: 'abc123def', matches: true },
    { pattern: /^\w+@\w+\.\w+$/, string: 'test@email.com', matches: true },
    { pattern: /^\w+@\w+\.\w+$/, string: 'invalid.email', matches: false },
    { pattern: /^#[0-9A-Fa-f]{6}$/, string: '#FF5733', matches: true },
    { pattern: /^#[0-9A-Fa-f]{6}$/, string: '#GGG', matches: false },
    { pattern: /cat|dog/, string: 'I have a cat', matches: true },
    { pattern: /cat|dog/, string: 'I have a bird', matches: false },
    { pattern: /^https?:\/\/.+/, string: 'https://example.com', matches: true },
    { pattern: /^https?:\/\/.+/, string: 'ftp://example.com', matches: false },
    { pattern: /^\d{5}(-\d{4})?$/, string: '12345', matches: true },
    { pattern: /^\d{5}(-\d{4})?$/, string: '12345-6789', matches: true },
    { pattern: /^\d{5}(-\d{4})?$/, string: '123456', matches: false },
    { pattern: /^\S+@\S+\.\S+$/, string: 'user@domain.co.uk', matches: true },
    { pattern: /^[A-Z][a-z]+$/, string: 'Hello', matches: true },
    { pattern: /^[A-Z][a-z]+$/, string: 'hello', matches: false },
    { pattern: /\b\d{2}\/\d{2}\/\d{4}\b/, string: 'Date: 12/25/2023', matches: true },
    { pattern: /\b\d{2}\/\d{2}\/\d{4}\b/, string: 'Date: 1/1/23', matches: false }
];

let regexState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startRegexChallenge() {
    regexState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('regex-results').classList.add('hidden');
    document.getElementById('regex-start').classList.add('hidden');
    document.getElementById('regex-score').textContent = '0';
    document.getElementById('regex-options').classList.remove('hidden');
    
    generateRegexQuestion();
    startTimer(endRegexChallenge);
}

function generateRegexQuestion() {
    const question = regexQuestions[Math.floor(Math.random() * regexQuestions.length)];
    regexState.currentQuestion = question;
    
    document.getElementById('regex-pattern').textContent = question.pattern.toString();
    document.getElementById('regex-string').textContent = `"${question.string}"`;
}

function submitRegexAnswer(userAnswer) {
    if (!timerInterval) return;
    
    regexState.totalAttempts++;
    
    const isCorrect = userAnswer === regexState.currentQuestion.matches;
    
    if (isCorrect) {
        regexState.score++;
        document.getElementById('regex-score').textContent = regexState.score;
    }
    
    // Visual feedback
    const stringElement = document.getElementById('regex-string');
    stringElement.style.borderColor = isCorrect ? 'var(--success-color)' : 'var(--danger-color)';
    
    setTimeout(() => {
        if (timerInterval) {
            stringElement.style.borderColor = 'var(--border-color)';
            generateRegexQuestion();
        }
    }, 400);
}

function endRegexChallenge() {
    const accuracy = regexState.totalAttempts > 0 
        ? Math.round((regexState.score / regexState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('regex-options').classList.add('hidden');
    document.getElementById('regex-correct').textContent = regexState.score;
    document.getElementById('regex-accuracy').textContent = `${accuracy}%`;
    document.getElementById('regex-results').classList.remove('hidden');
    
    saveScore('regex', regexState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 6: HTTP STATUS QUIZ
// =============================================

const httpStatuses = [
    { code: '200', options: ['OK', 'Created', 'Accepted', 'No Content'], answer: 'OK' },
    { code: '201', options: ['Created', 'OK', 'Accepted', 'No Content'], answer: 'Created' },
    { code: '204', options: ['No Content', 'Not Found', 'OK', 'Bad Request'], answer: 'No Content' },
    { code: '301', options: ['Moved Permanently', 'Found', 'Temporary Redirect', 'Permanent Redirect'], answer: 'Moved Permanently' },
    { code: '302', options: ['Found', 'Moved Permanently', 'Not Found', 'Bad Request'], answer: 'Found' },
    { code: '400', options: ['Bad Request', 'Unauthorized', 'Forbidden', 'Not Found'], answer: 'Bad Request' },
    { code: '401', options: ['Unauthorized', 'Forbidden', 'Bad Request', 'Not Found'], answer: 'Unauthorized' },
    { code: '403', options: ['Forbidden', 'Unauthorized', 'Not Found', 'Bad Request'], answer: 'Forbidden' },
    { code: '404', options: ['Not Found', 'Forbidden', 'Bad Request', 'Gone'], answer: 'Not Found' },
    { code: '500', options: ['Internal Server Error', 'Bad Gateway', 'Service Unavailable', 'Gateway Timeout'], answer: 'Internal Server Error' },
    { code: '502', options: ['Bad Gateway', 'Internal Server Error', 'Service Unavailable', 'Gateway Timeout'], answer: 'Bad Gateway' },
    { code: '503', options: ['Service Unavailable', 'Bad Gateway', 'Internal Server Error', 'Gateway Timeout'], answer: 'Service Unavailable' },
    { code: '202', options: ['Accepted', 'Created', 'OK', 'No Content'], answer: 'Accepted' },
    { code: '304', options: ['Not Modified', 'Moved Permanently', 'Found', 'Temporary Redirect'], answer: 'Not Modified' },
    { code: '307', options: ['Temporary Redirect', 'Moved Permanently', 'Found', 'Permanent Redirect'], answer: 'Temporary Redirect' },
    { code: '308', options: ['Permanent Redirect', 'Moved Permanently', 'Temporary Redirect', 'Found'], answer: 'Permanent Redirect' },
    { code: '410', options: ['Gone', 'Not Found', 'Forbidden', 'Bad Request'], answer: 'Gone' },
    { code: '429', options: ['Too Many Requests', 'Bad Request', 'Unauthorized', 'Forbidden'], answer: 'Too Many Requests' },
    { code: '504', options: ['Gateway Timeout', 'Bad Gateway', 'Service Unavailable', 'Internal Server Error'], answer: 'Gateway Timeout' }
];

let httpState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startHttpChallenge() {
    httpState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('http-results').classList.add('hidden');
    document.getElementById('http-start').classList.add('hidden');
    document.getElementById('http-score').textContent = '0';
    
    generateHttpQuestion();
    startTimer(endHttpChallenge);
}

function generateHttpQuestion() {
    const question = httpStatuses[Math.floor(Math.random() * httpStatuses.length)];
    httpState.currentQuestion = question;
    
    document.getElementById('http-code').textContent = question.code;
    
    const optionsContainer = document.getElementById('http-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray(question.options);
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkHttpAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkHttpAnswer(selected) {
    if (!timerInterval) return;
    
    httpState.totalAttempts++;
    const buttons = document.querySelectorAll('#http-options .option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === httpState.currentQuestion.answer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selected && selected !== httpState.currentQuestion.answer) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === httpState.currentQuestion.answer) {
        httpState.score++;
        document.getElementById('http-score').textContent = httpState.score;
    }
    
    setTimeout(() => {
        if (timerInterval) {
            generateHttpQuestion();
        }
    }, 800);
}

function endHttpChallenge() {
    const accuracy = httpState.totalAttempts > 0 
        ? Math.round((httpState.score / httpState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('http-correct').textContent = httpState.score;
    document.getElementById('http-accuracy').textContent = `${accuracy}%`;
    document.getElementById('http-results').classList.remove('hidden');
    
    saveScore('http', httpState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 7: ALGORITHM / BIG-O
// =============================================

const algorithmQuestions = [
    {
        code: `function search(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        answer: 'O(n)'
    },
    {
        code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
}`,
        options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(log n)'],
        answer: 'O(n²)'
    },
    {
        code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
        options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
        answer: 'O(log n)'
    },
    {
        code: `function getFirst(arr) {
  return arr[0];
}`,
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 'O(1)'
    },
    {
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        answer: 'O(n log n)'
    },
    {
        code: `function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}`,
        options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(2n)'],
        answer: 'O(n²)'
    },
    {
        code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        answer: 'O(n log n)'
    },
    {
        code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        options: ['O(2ⁿ)', 'O(n)', 'O(n²)', 'O(log n)'],
        answer: 'O(2ⁿ)'
    },
    {
        code: `function findSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
        options: ['O(n)', 'O(1)', 'O(n²)', 'O(log n)'],
        answer: 'O(n)'
    },
    {
        code: `function hasValue(obj, key) {
  return key in obj;
}`,
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 'O(1)'
    },
    {
        code: `function printTriangle(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      console.log('*');
    }
  }
}`,
        options: ['O(n²)', 'O(n)', 'O(n log n)', 'O(1)'],
        answer: 'O(n²)'
    },
    {
        code: `function binaryTreeHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(
    binaryTreeHeight(node.left),
    binaryTreeHeight(node.right)
  );
}`,
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        answer: 'O(n)'
    },
    {
        code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
        answer: 'O(n²)'
    },
    {
        code: `function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
        options: ['O(√n)', 'O(n)', 'O(log n)', 'O(n²)'],
        answer: 'O(√n)'
    },
    {
        code: `function reverseArray(arr) {
  const reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}`,
        options: ['O(n)', 'O(1)', 'O(n²)', 'O(log n)'],
        answer: 'O(n)'
    }
];

let algorithmState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startAlgorithmChallenge() {
    algorithmState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('algorithm-results').classList.add('hidden');
    document.getElementById('algorithm-start').classList.add('hidden');
    document.getElementById('algorithm-score').textContent = '0';
    
    generateAlgorithmQuestion();
    startTimer(endAlgorithmChallenge);
}

function generateAlgorithmQuestion() {
    const question = algorithmQuestions[Math.floor(Math.random() * algorithmQuestions.length)];
    algorithmState.currentQuestion = question;
    
    document.getElementById('algorithm-code').textContent = question.code;
    
    const optionsContainer = document.getElementById('algorithm-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray(question.options);
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkAlgorithmAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkAlgorithmAnswer(selected) {
    if (!timerInterval) return;
    
    algorithmState.totalAttempts++;
    const buttons = document.querySelectorAll('#algorithm-options .option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === algorithmState.currentQuestion.answer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selected && selected !== algorithmState.currentQuestion.answer) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === algorithmState.currentQuestion.answer) {
        algorithmState.score++;
        document.getElementById('algorithm-score').textContent = algorithmState.score;
    }
    
    setTimeout(() => {
        if (timerInterval) {
            generateAlgorithmQuestion();
        }
    }, 1000);
}

function endAlgorithmChallenge() {
    const accuracy = algorithmState.totalAttempts > 0 
        ? Math.round((algorithmState.score / algorithmState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('algorithm-correct').textContent = algorithmState.score;
    document.getElementById('algorithm-accuracy').textContent = `${accuracy}%`;
    document.getElementById('algorithm-results').classList.remove('hidden');
    
    saveScore('algorithm', algorithmState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 8: GIT COMMANDS
// =============================================

const gitCommands = [
    { question: 'Initialize a new Git repository', options: ['git init', 'git start', 'git new', 'git create'], answer: 'git init' },
    { question: 'Stage all changes', options: ['git add .', 'git stage .', 'git commit -a', 'git push'], answer: 'git add .' },
    { question: 'Commit staged changes', options: ['git commit -m "message"', 'git save', 'git push', 'git add'], answer: 'git commit -m "message"' },
    { question: 'Push to remote repository', options: ['git push', 'git upload', 'git send', 'git sync'], answer: 'git push' },
    { question: 'Pull from remote repository', options: ['git pull', 'git fetch', 'git download', 'git sync'], answer: 'git pull' },
    { question: 'Create a new branch', options: ['git branch name', 'git checkout name', 'git new name', 'git create name'], answer: 'git branch name' },
    { question: 'Switch to a different branch', options: ['git checkout branch', 'git switch branch', 'git branch branch', 'git change branch'], answer: 'git checkout branch' },
    { question: 'Merge a branch', options: ['git merge branch', 'git join branch', 'git combine branch', 'git add branch'], answer: 'git merge branch' },
    { question: 'View commit history', options: ['git log', 'git history', 'git commits', 'git show'], answer: 'git log' },
    { question: 'Check repository status', options: ['git status', 'git info', 'git state', 'git check'], answer: 'git status' },
    { question: 'Clone a repository', options: ['git clone url', 'git copy url', 'git download url', 'git fetch url'], answer: 'git clone url' },
    { question: 'Discard changes in working directory', options: ['git checkout -- file', 'git reset file', 'git undo file', 'git revert file'], answer: 'git checkout -- file' },
    { question: 'Stash current changes', options: ['git stash', 'git save', 'git hide', 'git store'], answer: 'git stash' },
    { question: 'Show diff of unstaged changes', options: ['git diff', 'git compare', 'git changes', 'git show'], answer: 'git diff' },
    { question: 'Delete a branch', options: ['git branch -d name', 'git delete name', 'git remove name', 'git rm name'], answer: 'git branch -d name' },
    { question: 'View remote repositories', options: ['git remote -v', 'git remotes', 'git list remotes', 'git show remote'], answer: 'git remote -v' },
    { question: 'Undo last commit (keep changes)', options: ['git reset HEAD~1', 'git undo', 'git revert HEAD', 'git rm HEAD'], answer: 'git reset HEAD~1' },
    { question: 'Tag a specific commit', options: ['git tag name', 'git label name', 'git mark name', 'git version name'], answer: 'git tag name' },
    { question: 'Fetch changes without merging', options: ['git fetch', 'git pull --no-merge', 'git download', 'git get'], answer: 'git fetch' }
];

let gitState = {
    score: 0,
    totalAttempts: 0,
    currentQuestion: null,
};

function startGitChallenge() {
    gitState = {
        score: 0,
        totalAttempts: 0,
        currentQuestion: null,
    };
    
    document.getElementById('git-results').classList.add('hidden');
    document.getElementById('git-start').classList.add('hidden');
    document.getElementById('git-score').textContent = '0';
    
    generateGitQuestion();
    startTimer(endGitChallenge);
}

function generateGitQuestion() {
    const question = gitCommands[Math.floor(Math.random() * gitCommands.length)];
    gitState.currentQuestion = question;
    
    document.getElementById('git-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('git-options');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray(question.options);
    
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => checkGitAnswer(option);
        optionsContainer.appendChild(btn);
    });
}

function checkGitAnswer(selected) {
    if (!timerInterval) return;
    
    gitState.totalAttempts++;
    const buttons = document.querySelectorAll('#git-options .option-btn');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === gitState.currentQuestion.answer) {
            btn.classList.add('correct');
        }
        if (btn.textContent === selected && selected !== gitState.currentQuestion.answer) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === gitState.currentQuestion.answer) {
        gitState.score++;
        document.getElementById('git-score').textContent = gitState.score;
    }
    
    setTimeout(() => {
        if (timerInterval) {
            generateGitQuestion();
        }
    }, 800);
}

function endGitChallenge() {
    const accuracy = gitState.totalAttempts > 0 
        ? Math.round((gitState.score / gitState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('git-correct').textContent = gitState.score;
    document.getElementById('git-accuracy').textContent = `${accuracy}%`;
    document.getElementById('git-results').classList.remove('hidden');
    
    saveScore('git', gitState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 9: CODE BLOCKS ARRANGER
// =============================================

const codeBlocksProblems = [
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
    }
];

let codeblocksState = {
    score: 0,
    totalAttempts: 0,
    currentProblem: null,
    correctOrder: [],
};

function startCodeblocksChallenge() {
    codeblocksState = {
        score: 0,
        totalAttempts: 0,
        currentProblem: null,
        correctOrder: [],
    };
    
    document.getElementById('codeblocks-results').classList.add('hidden');
    document.getElementById('codeblocks-start').classList.add('hidden');
    document.getElementById('codeblocks-check').classList.remove('hidden');
    document.getElementById('codeblocks-score').textContent = '0';
    
    generateCodeblocksProblem();
    startTimer(endCodeblocksChallenge);
}

function generateCodeblocksProblem() {
    const problem = codeBlocksProblems[Math.floor(Math.random() * codeBlocksProblems.length)];
    codeblocksState.currentProblem = problem;
    codeblocksState.correctOrder = [...problem.blocks];
    
    document.getElementById('codeblocks-task').textContent = problem.description;
    
    const container = document.getElementById('codeblocks-container');
    container.innerHTML = '';
    
    const shuffled = shuffleArray([...problem.blocks]);
    
    shuffled.forEach((block, index) => {
        const item = document.createElement('div');
        item.className = 'draggable-item';
        item.textContent = block;
        item.draggable = true;
        item.dataset.block = block;
        item.dataset.index = index;
        
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        
        container.appendChild(item);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== e.target) {
        const container = e.target.parentNode;
        const allItems = [...container.children];
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(e.target);
        
        if (draggedIndex < targetIndex) {
            e.target.parentNode.insertBefore(draggedElement, e.target.nextSibling);
        } else {
            e.target.parentNode.insertBefore(draggedElement, e.target);
        }
    }
    
    return false;
}

function checkCodeblocksOrder() {
    if (!timerInterval) return;
    
    codeblocksState.totalAttempts++;
    
    const container = document.getElementById('codeblocks-container');
    const items = [...container.children];
    const currentOrder = items.map(item => item.dataset.block);
    
    let isCorrect = true;
    items.forEach((item, index) => {
        item.classList.remove('correct-position', 'wrong-position');
        if (item.dataset.block === codeblocksState.correctOrder[index]) {
            item.classList.add('correct-position');
        } else {
            item.classList.add('wrong-position');
            isCorrect = false;
        }
    });
    
    if (isCorrect) {
        codeblocksState.score++;
        document.getElementById('codeblocks-score').textContent = codeblocksState.score;
        
        setTimeout(() => {
            if (timerInterval) {
                generateCodeblocksProblem();
            }
        }, 1000);
    } else {
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 300);
    }
}

function endCodeblocksChallenge() {
    const accuracy = codeblocksState.totalAttempts > 0 
        ? Math.round((codeblocksState.score / codeblocksState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('codeblocks-check').classList.add('hidden');
    document.getElementById('codeblocks-correct').textContent = codeblocksState.score;
    document.getElementById('codeblocks-accuracy').textContent = `${accuracy}%`;
    document.getElementById('codeblocks-results').classList.remove('hidden');
    
    saveScore('codeblocks', codeblocksState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 10: SQL QUERY BUILDER
// =============================================

const sqlProblems = [
    {
        description: 'Get all users older than 25:',
        query: ['SELECT *', 'FROM users', 'WHERE age > 25']
    },
    {
        description: 'Get usernames and emails, ordered by username:',
        query: ['SELECT username, email', 'FROM users', 'ORDER BY username']
    },
    {
        description: 'Count all active users:',
        query: ['SELECT COUNT(*)', 'FROM users', 'WHERE status = "active"']
    },
    {
        description: 'Join users and orders tables:',
        query: ['SELECT users.name, orders.total', 'FROM users', 'JOIN orders ON users.id = orders.user_id']
    },
    {
        description: 'Get top 10 products by price:',
        query: ['SELECT *', 'FROM products', 'ORDER BY price DESC', 'LIMIT 10']
    }
];

let sqlState = {
    score: 0,
    totalAttempts: 0,
    currentProblem: null,
    droppedClauses: [],
};

function startSqlChallenge() {
    sqlState = {
        score: 0,
        totalAttempts: 0,
        currentProblem: null,
        droppedClauses: [],
    };
    
    document.getElementById('sql-results').classList.add('hidden');
    document.getElementById('sql-start').classList.add('hidden');
    document.getElementById('sql-check').classList.remove('hidden');
    document.getElementById('sql-score').textContent = '0';
    
    generateSqlProblem();
    startTimer(endSqlChallenge);
}

function generateSqlProblem() {
    const problem = sqlProblems[Math.floor(Math.random() * sqlProblems.length)];
    sqlState.currentProblem = problem;
    sqlState.droppedClauses = [];
    
    document.getElementById('sql-task').textContent = problem.description;
    
    const dropzone = document.getElementById('sql-dropzone');
    dropzone.innerHTML = '<div class="dropzone-placeholder">Drop SQL clauses here</div>';
    dropzone.addEventListener('dragover', handleSqlDragOver);
    dropzone.addEventListener('drop', handleSqlDrop);
    
    const optionsContainer = document.getElementById('sql-options');
    optionsContainer.innerHTML = '';
    
    const shuffled = shuffleArray([...problem.query]);
    
    shuffled.forEach(clause => {
        const item = document.createElement('div');
        item.className = 'sql-clause';
        item.textContent = clause;
        item.draggable = true;
        item.dataset.clause = clause;
        
        item.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        });
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        optionsContainer.appendChild(item);
    });
}

function handleSqlDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.currentTarget.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleSqlDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropzone = e.currentTarget;
    dropzone.classList.remove('drag-over');
    
    if (draggedElement && draggedElement.classList.contains('sql-clause')) {
        const placeholder = dropzone.querySelector('.dropzone-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        const clause = draggedElement.dataset.clause;
        if (!sqlState.droppedClauses.includes(clause)) {
            const dropped = draggedElement.cloneNode(true);
            dropped.classList.add('in-dropzone');
            dropped.draggable = false;
            dropzone.appendChild(dropped);
            
            sqlState.droppedClauses.push(clause);
            draggedElement.style.display = 'none';
        }
    }
    
    return false;
}

function checkSqlQuery() {
    if (!timerInterval) return;
    
    sqlState.totalAttempts++;
    
    const isCorrect = JSON.stringify(sqlState.droppedClauses) === JSON.stringify(sqlState.currentProblem.query);
    
    const dropzone = document.getElementById('sql-dropzone');
    
    if (isCorrect) {
        sqlState.score++;
        document.getElementById('sql-score').textContent = sqlState.score;
        dropzone.classList.add('success-pulse');
        
        setTimeout(() => {
            dropzone.classList.remove('success-pulse');
            if (timerInterval) {
                generateSqlProblem();
            }
        }, 1000);
    } else {
        dropzone.classList.add('shake');
        setTimeout(() => dropzone.classList.remove('shake'), 300);
    }
}

function endSqlChallenge() {
    const accuracy = sqlState.totalAttempts > 0 
        ? Math.round((sqlState.score / sqlState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('sql-check').classList.add('hidden');
    document.getElementById('sql-correct').textContent = sqlState.score;
    document.getElementById('sql-accuracy').textContent = `${accuracy}%`;
    document.getElementById('sql-results').classList.remove('hidden');
    
    saveScore('sql', sqlState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 11: FLEXBOX FRENZY
// =============================================

const flexboxLayouts = [
    { items: ['A', 'B', 'C'], justify: 'flex-start', align: 'center' },
    { items: ['1', '2', '3', '4'], justify: 'space-between', align: 'center' },
    { items: ['X', 'Y'], justify: 'center', align: 'center' },
    { items: ['A', 'B', 'C', 'D'], justify: 'space-around', align: 'flex-start' },
    { items: ['1', '2', '3'], justify: 'flex-end', align: 'center' },
];

let flexboxState = {
    score: 0,
    totalAttempts: 0,
    currentLayout: null,
    yourItems: [],
};

function startFlexboxChallenge() {
    flexboxState = {
        score: 0,
        totalAttempts: 0,
        currentLayout: null,
        yourItems: [],
    };
    
    document.getElementById('flexbox-results').classList.add('hidden');
    document.getElementById('flexbox-start').classList.add('hidden');
    document.getElementById('flexbox-check').classList.remove('hidden');
    document.getElementById('flexbox-score').textContent = '0';
    
    generateFlexboxLayout();
    startTimer(endFlexboxChallenge);
}

function generateFlexboxLayout() {
    const layout = flexboxLayouts[Math.floor(Math.random() * flexboxLayouts.length)];
    flexboxState.currentLayout = layout;
    flexboxState.yourItems = [];
    
    // Target layout
    const target = document.getElementById('flexbox-target');
    target.innerHTML = '';
    target.style.justifyContent = layout.justify;
    target.style.alignItems = layout.align;
    
    layout.items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flexbox-item target-item';
        div.textContent = item;
        target.appendChild(div);
    });
    
    // Your layout
    const yours = document.getElementById('flexbox-yours');
    yours.innerHTML = '';
    yours.addEventListener('dragover', handleFlexboxDragOver);
    yours.addEventListener('drop', handleFlexboxDrop);
    
    // Shuffle items for dragging
    const shuffled = shuffleArray([...layout.items]);
    shuffled.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flexbox-item';
        div.textContent = item;
        div.draggable = true;
        div.dataset.item = item;
        
        div.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        });
        div.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        yours.appendChild(div);
    });
}

function handleFlexboxDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleFlexboxDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const yours = e.currentTarget;
    yours.classList.remove('drag-over');
    
    if (draggedElement && draggedElement !== e.target) {
        const allItems = [...yours.children];
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(e.target);
        
        if (targetIndex >= 0) {
            if (draggedIndex < targetIndex) {
                yours.insertBefore(draggedElement, e.target.nextSibling);
            } else {
                yours.insertBefore(draggedElement, e.target);
            }
        }
    }
    
    return false;
}

function checkFlexboxLayout() {
    if (!timerInterval) return;
    
    flexboxState.totalAttempts++;
    
    const yours = document.getElementById('flexbox-yours');
    const items = [...yours.children].map(item => item.dataset.item);
    
    const isCorrect = JSON.stringify(items) === JSON.stringify(flexboxState.currentLayout.items);
    
    if (isCorrect) {
        flexboxState.score++;
        document.getElementById('flexbox-score').textContent = flexboxState.score;
        yours.classList.add('success-pulse');
        
        setTimeout(() => {
            yours.classList.remove('success-pulse');
            if (timerInterval) {
                generateFlexboxLayout();
            }
        }, 1000);
    } else {
        yours.classList.add('shake');
        setTimeout(() => yours.classList.remove('shake'), 300);
    }
}

function endFlexboxChallenge() {
    const accuracy = flexboxState.totalAttempts > 0 
        ? Math.round((flexboxState.score / flexboxState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('flexbox-check').classList.add('hidden');
    document.getElementById('flexbox-correct').textContent = flexboxState.score;
    document.getElementById('flexbox-accuracy').textContent = `${accuracy}%`;
    document.getElementById('flexbox-results').classList.remove('hidden');
    
    saveScore('flexbox', flexboxState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 12: DATA STRUCTURE BUILDER
// =============================================

const dsProblems = [
    { type: 'array', description: 'Build an array: [5, 3, 8, 1]', values: [5, 3, 8, 1] },
    { type: 'stack', description: 'Build a stack (bottom to top): 1, 2, 3', values: [1, 2, 3] },
    { type: 'queue', description: 'Build a queue (front to back): A, B, C', values: ['A', 'B', 'C'] },
    { type: 'array', description: 'Build an array: [2, 4, 6, 8]', values: [2, 4, 6, 8] },
];

let datastructureState = {
    score: 0,
    totalAttempts: 0,
    currentProblem: null,
    builtStructure: [],
};

function startDatastructureChallenge() {
    datastructureState = {
        score: 0,
        totalAttempts: 0,
        currentProblem: null,
        builtStructure: [],
    };
    
    document.getElementById('datastructure-results').classList.add('hidden');
    document.getElementById('datastructure-start').classList.add('hidden');
    document.getElementById('datastructure-score').textContent = '0';
    
    generateDatastructureProblem();
    startTimer(endDatastructureChallenge);
}

function generateDatastructureProblem() {
    const problem = dsProblems[Math.floor(Math.random() * dsProblems.length)];
    datastructureState.currentProblem = problem;
    datastructureState.builtStructure = [];
    
    document.getElementById('ds-instructions').textContent = problem.description;
    
    const visualization = document.getElementById('ds-visualization');
    visualization.innerHTML = '';
    visualization.addEventListener('dragover', handleDsDragOver);
    visualization.addEventListener('drop', handleDsDrop);
    
    const elements = document.getElementById('ds-elements');
    elements.innerHTML = '';
    
    const shuffled = shuffleArray([...problem.values]);
    
    shuffled.forEach(value => {
        const element = document.createElement('div');
        element.className = 'ds-element';
        element.textContent = value;
        element.draggable = true;
        element.dataset.value = value;
        
        element.addEventListener('dragstart', (e) => {
            draggedElement = e.target;
            e.target.classList.add('dragging');
        });
        element.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        elements.appendChild(element);
    });
}

function handleDsDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.currentTarget.classList.add('drag-over');
    return false;
}

function handleDsDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const visualization = e.currentTarget;
    visualization.classList.remove('drag-over');
    
    if (draggedElement && draggedElement.classList.contains('ds-element')) {
        const value = draggedElement.dataset.value;
        
        const node = document.createElement('div');
        node.className = 'ds-node';
        node.textContent = value;
        visualization.appendChild(node);
        
        datastructureState.builtStructure.push(value);
        draggedElement.style.display = 'none';
        
        // Check if complete
        if (datastructureState.builtStructure.length === datastructureState.currentProblem.values.length) {
            setTimeout(() => checkDatastructure(), 300);
        }
    }
    
    return false;
}

function checkDatastructure() {
    if (!timerInterval) return;
    
    datastructureState.totalAttempts++;
    
    const isCorrect = JSON.stringify(datastructureState.builtStructure) === 
                      JSON.stringify(datastructureState.currentProblem.values);
    
    const visualization = document.getElementById('ds-visualization');
    
    if (isCorrect) {
        datastructureState.score++;
        document.getElementById('datastructure-score').textContent = datastructureState.score;
        visualization.classList.add('success-pulse');
        
        setTimeout(() => {
            visualization.classList.remove('success-pulse');
            if (timerInterval) {
                generateDatastructureProblem();
            }
        }, 1500);
    } else {
        visualization.classList.add('shake');
        setTimeout(() => {
            visualization.classList.remove('shake');
            if (timerInterval) {
                generateDatastructureProblem();
            }
        }, 1000);
    }
}

function endDatastructureChallenge() {
    const accuracy = datastructureState.totalAttempts > 0 
        ? Math.round((datastructureState.score / datastructureState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('datastructure-built').textContent = datastructureState.score;
    document.getElementById('datastructure-accuracy').textContent = `${accuracy}%`;
    document.getElementById('datastructure-results').classList.remove('hidden');
    
    saveScore('datastructure', datastructureState.score);
    incrementStats();
}

// =============================================
// UTILITY: Particle Effects
// =============================================

function createParticles(x, y, count = 5) {
    const container = document.body;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// =============================================
// CHALLENGE 13: COLOR CODE MATCHER
// =============================================

const colors = [
    { hex: '#FF0000', rgb: 'rgb(255, 0, 0)', name: 'Red' },
    { hex: '#00FF00', rgb: 'rgb(0, 255, 0)', name: 'Green' },
    { hex: '#0000FF', rgb: 'rgb(0, 0, 255)', name: 'Blue' },
    { hex: '#FFFF00', rgb: 'rgb(255, 255, 0)', name: 'Yellow' },
    { hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', name: 'Magenta' },
    { hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', name: 'Cyan' },
    { hex: '#FFA500', rgb: 'rgb(255, 165, 0)', name: 'Orange' },
    { hex: '#800080', rgb: 'rgb(128, 0, 128)', name: 'Purple' },
    { hex: '#FFC0CB', rgb: 'rgb(255, 192, 203)', name: 'Pink' },
    { hex: '#808080', rgb: 'rgb(128, 128, 128)', name: 'Gray' },
];

let colorcodeState = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    currentColor: null,
    options: [],
};

function startColorCodeChallenge() {
    colorcodeState = {
        score: 0,
        combo: 0,
        maxCombo: 0,
        currentColor: null,
        options: [],
    };
    
    document.getElementById('colorcode-results').classList.add('hidden');
    document.getElementById('colorcode-start').classList.add('hidden');
    document.getElementById('colorcode-score').textContent = '0';
    document.getElementById('colorcode-combo').textContent = '';
    
    generateColorQuestion();
    startTimer(endColorCodeChallenge);
}

function generateColorQuestion() {
    const correct = colors[Math.floor(Math.random() * colors.length)];
    colorcodeState.currentColor = correct;
    
    // Random format
    const format = Math.random() > 0.5 ? 'hex' : 'rgb';
    document.getElementById('color-code-display').textContent = correct[format];
    
    // Generate options
    const options = [correct];
    while (options.length < 4) {
        const option = colors[Math.floor(Math.random() * colors.length)];
        if (!options.includes(option)) {
            options.push(option);
        }
    }
    
    colorcodeState.options = shuffleArray(options);
    
    const container = document.getElementById('color-options');
    container.innerHTML = '';
    
    colorcodeState.options.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = color.hex;
        swatch.onclick = () => checkColorAnswer(color);
        container.appendChild(swatch);
    });
}

function checkColorAnswer(selected) {
    if (!timerInterval) return;
    
    const swatch = event.target;
    
    if (selected === colorcodeState.currentColor) {
        colorcodeState.score++;
        colorcodeState.combo++;
        colorcodeState.maxCombo = Math.max(colorcodeState.maxCombo, colorcodeState.combo);
        
        swatch.classList.add('correct');
        document.getElementById('colorcode-score').textContent = colorcodeState.score;
        
        if (colorcodeState.combo > 1) {
            const comboDisplay = document.getElementById('colorcode-combo');
            comboDisplay.textContent = `🔥 ${colorcodeState.combo}x COMBO!`;
        }
        
        // Create particles
        const rect = swatch.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
        
        setTimeout(() => {
            if (timerInterval) {
                generateColorQuestion();
            }
        }, 500);
    } else {
        colorcodeState.combo = 0;
        swatch.classList.add('incorrect');
        document.getElementById('colorcode-combo').textContent = '';
        
        setTimeout(() => swatch.classList.remove('incorrect'), 300);
    }
}

function endColorCodeChallenge() {
    document.getElementById('colorcode-correct').textContent = colorcodeState.score;
    document.getElementById('colorcode-maxcombo').textContent = `${colorcodeState.maxCombo}x`;
    document.getElementById('colorcode-results').classList.remove('hidden');
    
    saveScore('colorcode', colorcodeState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 14: CSS SELECTOR NINJA
// =============================================

const cssSelectors = [
    { selector: '.button', description: 'Select all elements with class "button"' },
    { selector: '#header', description: 'Select element with id "header"' },
    { selector: 'div', description: 'Select all div elements' },
    { selector: 'div.active', description: 'Select divs with class "active"' },
    { selector: '.container > .item', description: 'Direct children with class "item"' },
];

let cssselectorState = {
    score: 0,
    totalAttempts: 0,
    currentSelector: null,
    selectedElements: [],
};

function startCssSelectorChallenge() {
    cssselectorState = {
        score: 0,
        totalAttempts: 0,
        currentSelector: null,
        selectedElements: [],
    };
    
    document.getElementById('cssselector-results').classList.add('hidden');
    document.getElementById('cssselector-start').classList.add('hidden');
    document.getElementById('cssselector-score').textContent = '0';
    
    generateSelectorQuestion();
    startTimer(endCssSelectorChallenge);
}

function generateSelectorQuestion() {
    const question = cssSelectors[Math.floor(Math.random() * cssSelectors.length)];
    cssselectorState.currentSelector = question;
    cssselectorState.selectedElements = [];
    cssselectorState.totalAttempts++;
    
    document.getElementById('selector-display').textContent = question.selector;
    
    const preview = document.getElementById('html-preview');
    preview.innerHTML = `
        <div class="html-element" data-matches="false">&lt;div class="container"&gt;</div>
        <div class="html-element" data-matches="true">&lt;div class="button"&gt;</div>
        <div class="html-element" data-matches="false">&lt;span&gt;</div>
        <div class="html-element" data-matches="true">&lt;button class="button"&gt;</div>
        <div class="html-element" data-matches="false">&lt;div id="header"&gt;</div>
    `;
    
    preview.querySelectorAll('.html-element').forEach(el => {
        el.onclick = () => selectElement(el);
    });
}

function selectElement(element) {
    if (element.classList.contains('selected') || element.classList.contains('wrong')) return;
    
    const matches = element.dataset.matches === 'true';
    
    if (matches) {
        element.classList.add('selected');
        cssselectorState.selectedElements.push(element);
        
        // Check if all correct elements selected
        const allCorrect = document.querySelectorAll('.html-element[data-matches="true"]');
        if (cssselectorState.selectedElements.length === allCorrect.length) {
            cssselectorState.score++;
            document.getElementById('cssselector-score').textContent = cssselectorState.score;
            
            setTimeout(() => {
                if (timerInterval) {
                    generateSelectorQuestion();
                }
            }, 1000);
        }
    } else {
        element.classList.add('wrong');
        setTimeout(() => element.classList.remove('wrong'), 500);
    }
}

function endCssSelectorChallenge() {
    const accuracy = cssselectorState.totalAttempts > 0 
        ? Math.round((cssselectorState.score / cssselectorState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('cssselector-correct').textContent = cssselectorState.score;
    document.getElementById('cssselector-accuracy').textContent = `${accuracy}%`;
    document.getElementById('cssselector-results').classList.remove('hidden');
    
    saveScore('cssselector', cssselectorState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 15: BINARY BLITZ
// =============================================

let binaryState = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    currentNumber: 0,
    bits: [0,0,0,0,0,0,0,0],
};

function startBinaryChallenge() {
    binaryState = {
        score: 0,
        combo: 0,
        maxCombo: 0,
        currentNumber: 0,
        bits: [0,0,0,0,0,0,0,0],
    };
    
    document.getElementById('binaryconv-results').classList.add('hidden');
    document.getElementById('binaryconv-start').classList.add('hidden');
    document.getElementById('binaryconv-submit').classList.remove('hidden');
    document.getElementById('binaryconv-score').textContent = '0';
    document.getElementById('binaryconv-combo').textContent = '';
    
    generateBinaryQuestion();
    startTimer(endBinaryChallenge);
}

function generateBinaryQuestion() {
    binaryState.currentNumber = Math.floor(Math.random() * 256);
    binaryState.bits = [0,0,0,0,0,0,0,0];
    
    document.getElementById('decimal-display').textContent = binaryState.currentNumber;
    
    const grid = document.getElementById('binary-grid');
    grid.innerHTML = '';
    
    for (let i = 7; i >= 0; i--) {
        const bit = document.createElement('div');
        bit.className = 'binary-bit';
        bit.textContent = '0';
        bit.dataset.power = Math.pow(2, i);
        bit.dataset.index = i;
        bit.onclick = () => toggleBit(i);
        grid.appendChild(bit);
    }
    
    updateBinaryPreview();
}

function toggleBit(index) {
    binaryState.bits[index] = binaryState.bits[index] === 0 ? 1 : 0;
    
    const bits = document.querySelectorAll('.binary-bit');
    bits[7 - index].textContent = binaryState.bits[index];
    bits[7 - index].classList.toggle('active', binaryState.bits[index] === 1);
    
    updateBinaryPreview();
}

function updateBinaryPreview() {
    const preview = binaryState.bits.join('');
    document.getElementById('binary-preview').textContent = preview;
}

function submitBinaryAnswer() {
    if (!timerInterval) return;
    
    const userValue = parseInt(binaryState.bits.join(''), 2);
    
    if (userValue === binaryState.currentNumber) {
        binaryState.score++;
        binaryState.combo++;
        binaryState.maxCombo = Math.max(binaryState.maxCombo, binaryState.combo);
        
        document.getElementById('binaryconv-score').textContent = binaryState.score;
        
        if (binaryState.combo > 1) {
            const comboDisplay = document.getElementById('binaryconv-combo');
            comboDisplay.textContent = `🔥 ${binaryState.combo}x`;
        }
        
        setTimeout(() => {
            if (timerInterval) {
                generateBinaryQuestion();
            }
        }, 500);
    } else {
        binaryState.combo = 0;
        document.getElementById('binaryconv-combo').textContent = '';
        
        const grid = document.getElementById('binary-grid');
        grid.classList.add('shake');
        setTimeout(() => grid.classList.remove('shake'), 300);
    }
}

function endBinaryChallenge() {
    document.getElementById('binaryconv-submit').classList.add('hidden');
    document.getElementById('binaryconv-correct').textContent = binaryState.score;
    document.getElementById('binaryconv-maxcombo').textContent = `${binaryState.maxCombo}x`;
    document.getElementById('binaryconv-results').classList.remove('hidden');
    
    saveScore('binaryconv', binaryState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 16: JSON PATH FINDER
// =============================================

const jsonObjects = [
    {
        obj: { user: { name: 'John', age: 30 } },
        paths: ['user.name', 'user.age', 'name', 'age'],
        target: 'John',
        correct: 'user.name'
    },
    {
        obj: { data: { items: [1, 2, 3] } },
        paths: ['data.items', 'items', 'data[0]', 'items[0]'],
        target: '[1,2,3]',
        correct: 'data.items'
    },
];

let jsonpathState = {
    score: 0,
    totalAttempts: 0,
};

function startJsonPathChallenge() {
    jsonpathState = {
        score: 0,
        totalAttempts: 0,
    };
    
    document.getElementById('jsonpath-results').classList.add('hidden');
    document.getElementById('jsonpath-start').classList.add('hidden');
    document.getElementById('jsonpath-score').textContent = '0';
    
    generateJsonQuestion();
    startTimer(endJsonPathChallenge);
}

function generateJsonQuestion() {
    const question = jsonObjects[Math.floor(Math.random() * jsonObjects.length)];
    jsonpathState.currentQuestion = question;
    
    const display = document.getElementById('json-display');
    display.innerHTML = JSON.stringify(question.obj, null, 2)
        .replace(question.target, `<span class="json-value target">${question.target}</span>`);
    
    const paths = document.getElementById('json-paths');
    paths.innerHTML = '';
    
    question.paths.forEach(path => {
        const btn = document.createElement('button');
        btn.className = 'json-path-option';
        btn.textContent = path;
        btn.onclick = () => checkJsonPath(path, btn);
        paths.appendChild(btn);
    });
}

function checkJsonPath(path, button) {
    if (!timerInterval) return;
    
    jsonpathState.totalAttempts++;
    
    if (path === jsonpathState.currentQuestion.correct) {
        jsonpathState.score++;
        button.classList.add('correct');
        document.getElementById('jsonpath-score').textContent = jsonpathState.score;
        
        setTimeout(() => {
            if (timerInterval) {
                generateJsonQuestion();
            }
        }, 800);
    } else {
        button.classList.add('incorrect');
        setTimeout(() => button.classList.remove('incorrect'), 500);
    }
}

function endJsonPathChallenge() {
    const accuracy = jsonpathState.totalAttempts > 0 
        ? Math.round((jsonpathState.score / jsonpathState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('jsonpath-correct').textContent = jsonpathState.score;
    document.getElementById('jsonpath-accuracy').textContent = `${accuracy}%`;
    document.getElementById('jsonpath-results').classList.remove('hidden');
    
    saveScore('jsonpath', jsonpathState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 17: DEBUG RACE
// =============================================

const debugProblems = [
    {
        code: 'const x = 10;\nif (x = 5) {\n  console.log("Equal");\n}',
        fixes: ['Change = to ===', 'Change x to y', 'Remove if statement', 'Add else'],
        correct: 'Change = to ==='
    },
    {
        code: 'const arr = [1, 2, 3];\nfor (let i = 0; i <= arr.length; i++) {\n  console.log(arr[i]);\n}',
        fixes: ['Change <= to <', 'Change i++ to i--', 'Remove loop', 'Add break'],
        correct: 'Change <= to <'
    },
];

let debugraceState = {
    score: 0,
    startTime: null,
};

function startDebugRaceChallenge() {
    debugraceState = {
        score: 0,
        startTime: Date.now(),
    };
    
    document.getElementById('debugrace-results').classList.add('hidden');
    document.getElementById('debugrace-start').classList.add('hidden');
    document.getElementById('debugrace-score').textContent = '0';
    
    generateDebugProblem();
    startTimer(endDebugRaceChallenge);
}

function generateDebugProblem() {
    const problem = debugProblems[Math.floor(Math.random() * debugProblems.length)];
    debugraceState.currentProblem = problem;
    
    document.getElementById('buggy-code').textContent = problem.code;
    
    const options = document.getElementById('fix-options');
    options.innerHTML = '';
    
    shuffleArray(problem.fixes).forEach(fix => {
        const btn = document.createElement('button');
        btn.className = 'fix-option';
        btn.textContent = fix;
        btn.onclick = () => checkDebugFix(fix, btn);
        options.appendChild(btn);
    });
}

function checkDebugFix(fix, button) {
    if (!timerInterval) return;
    
    if (fix === debugraceState.currentProblem.correct) {
        debugraceState.score++;
        button.classList.add('correct');
        document.getElementById('debugrace-score').textContent = debugraceState.score;
        
        // Update speed meter
        const avgTime = (Date.now() - debugraceState.startTime) / debugraceState.score / 1000;
        const speedMeter = document.getElementById('debugrace-speed');
        if (avgTime < 3) speedMeter.textContent = '🚀';
        else if (avgTime < 5) speedMeter.textContent = '🔥';
        else speedMeter.textContent = '⚡';
        
        setTimeout(() => {
            if (timerInterval) {
                generateDebugProblem();
            }
        }, 800);
    } else {
        button.classList.add('incorrect');
        setTimeout(() => button.classList.remove('incorrect'), 500);
    }
}

function endDebugRaceChallenge() {
    const avgTime = debugraceState.score > 0 
        ? Math.round((Date.now() - debugraceState.startTime) / debugraceState.score / 1000) 
        : 0;
    
    let rank = 'Beginner';
    if (avgTime < 3) rank = 'Expert 🚀';
    else if (avgTime < 5) rank = 'Pro 🔥';
    else if (avgTime < 8) rank = 'Intermediate ⚡';
    
    document.getElementById('debugrace-fixed').textContent = debugraceState.score;
    document.getElementById('debugrace-rank').textContent = rank;
    document.getElementById('debugrace-results').classList.remove('hidden');
    
    saveScore('debugrace', debugraceState.score);
    incrementStats();
}

// =============================================
// CHALLENGE 18: API ENDPOINT BUILDER
// =============================================

const apiTasks = [
    {
        task: 'Get all users',
        method: 'GET',
        endpoint: '/api/users'
    },
    {
        task: 'Create a new user',
        method: 'POST',
        endpoint: '/api/users'
    },
    {
        task: 'Update user with ID 5',
        method: 'PUT',
        endpoint: '/api/users/5'
    },
    {
        task: 'Delete user with ID 10',
        method: 'DELETE',
        endpoint: '/api/users/10'
    },
];

let apibuilderState = {
    score: 0,
    totalAttempts: 0,
    selectedMethod: null,
    selectedEndpoint: null,
    currentTask: null,
};

function startApiBuilderChallenge() {
    apibuilderState = {
        score: 0,
        totalAttempts: 0,
        selectedMethod: null,
        selectedEndpoint: null,
        currentTask: null,
    };
    
    document.getElementById('apibuilder-results').classList.add('hidden');
    document.getElementById('apibuilder-start').classList.add('hidden');
    document.getElementById('apibuilder-submit').classList.remove('hidden');
    document.getElementById('apibuilder-score').textContent = '0';
    
    generateApiTask();
    startTimer(endApiBuilderChallenge);
}

function generateApiTask() {
    const task = apiTasks[Math.floor(Math.random() * apiTasks.length)];
    apibuilderState.currentTask = task;
    apibuilderState.selectedMethod = null;
    apibuilderState.selectedEndpoint = null;
    
    document.getElementById('api-task').textContent = task.task;
    
    // Method buttons
    const methodSelector = document.getElementById('method-selector');
    methodSelector.innerHTML = '';
    ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => {
        const btn = document.createElement('button');
        btn.className = `method-btn ${method}`;
        btn.textContent = method;
        btn.onclick = () => selectMethod(method, btn);
        methodSelector.appendChild(btn);
    });
    
    // Endpoint buttons
    const endpointSelector = document.getElementById('endpoint-selector');
    endpointSelector.innerHTML = '';
    ['/api/users', '/api/users/5', '/api/users/10', '/api/products'].forEach(endpoint => {
        const btn = document.createElement('button');
        btn.className = 'endpoint-btn';
        btn.textContent = endpoint;
        btn.onclick = () => selectEndpoint(endpoint, btn);
        endpointSelector.appendChild(btn);
    });
    
    updateApiPreview();
}

function selectMethod(method, button) {
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    apibuilderState.selectedMethod = method;
    updateApiPreview();
}

function selectEndpoint(endpoint, button) {
    document.querySelectorAll('.endpoint-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    apibuilderState.selectedEndpoint = endpoint;
    updateApiPreview();
}

function updateApiPreview() {
    const preview = document.getElementById('api-preview');
    if (apibuilderState.selectedMethod && apibuilderState.selectedEndpoint) {
        preview.innerHTML = `
            <span class="api-method ${apibuilderState.selectedMethod}">${apibuilderState.selectedMethod}</span>
            <span>${apibuilderState.selectedEndpoint}</span>
        `;
    } else {
        preview.textContent = 'Select method and endpoint...';
    }
}

function submitApiEndpoint() {
    if (!timerInterval || !apibuilderState.selectedMethod || !apibuilderState.selectedEndpoint) return;
    
    apibuilderState.totalAttempts++;
    
    const isCorrect = 
        apibuilderState.selectedMethod === apibuilderState.currentTask.method &&
        apibuilderState.selectedEndpoint === apibuilderState.currentTask.endpoint;
    
    if (isCorrect) {
        apibuilderState.score++;
        document.getElementById('apibuilder-score').textContent = apibuilderState.score;
        
        const preview = document.getElementById('api-preview');
        preview.classList.add('success-pulse');
        
        setTimeout(() => {
            preview.classList.remove('success-pulse');
            if (timerInterval) {
                generateApiTask();
            }
        }, 1000);
    } else {
        const preview = document.getElementById('api-preview');
        preview.classList.add('shake');
        setTimeout(() => preview.classList.remove('shake'), 300);
    }
}

function endApiBuilderChallenge() {
    const accuracy = apibuilderState.totalAttempts > 0 
        ? Math.round((apibuilderState.score / apibuilderState.totalAttempts) * 100) 
        : 0;
    
    document.getElementById('apibuilder-submit').classList.add('hidden');
    document.getElementById('apibuilder-correct').textContent = apibuilderState.score;
    document.getElementById('apibuilder-accuracy').textContent = `${accuracy}%`;
    document.getElementById('apibuilder-results').classList.remove('hidden');
    
    saveScore('apibuilder', apibuilderState.score);
    incrementStats();
}

// =============================================
// CODE WARRIORS - 2-PLAYER BATTLE GAME
// =============================================

const CHARACTER_CLASSES = {
    algorithm: {
        name: 'Algorithm Master',
        avatar: '🧠',
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        attacks: [
            { name: 'Quick Sort', icon: '⚡', damage: 15, manaCost: 10, quiz: true, concept: 'sorting' },
            { name: 'Binary Search', icon: '🔍', damage: 20, manaCost: 15, quiz: true, concept: 'search' },
            { name: 'Hash Attack', icon: '#️⃣', damage: 25, manaCost: 20, quiz: false },
            { name: 'Optimize Code', icon: '💎', damage: 0, manaCost: 15, heal: 20 },
        ]
    },
    database: {
        name: 'Database Guru',
        avatar: '🗄️',
        health: 150,
        maxHealth: 150,
        mana: 40,
        maxMana: 40,
        attacks: [
            { name: 'SQL Injection', icon: '💉', damage: 30, manaCost: 20, quiz: false },
            { name: 'Index Strike', icon: '📊', damage: 20, manaCost: 15, quiz: true, concept: 'database' },
            { name: 'JOIN Attack', icon: '🔗', damage: 25, manaCost: 18, quiz: false },
            { name: 'Backup Shield', icon: '🛡️', damage: 0, manaCost: 12, defense: 15 },
        ]
    },
    frontend: {
        name: 'Frontend Ninja',
        avatar: '🎨',
        health: 120,
        maxHealth: 120,
        mana: 45,
        maxMana: 45,
        attacks: [
            { name: 'CSS Crush', icon: '🎨', damage: 18, manaCost: 12, quiz: false },
            { name: 'React Render', icon: '⚛️', damage: 22, manaCost: 16, quiz: true, concept: 'frontend' },
            { name: 'DOM Manipulation', icon: '🌐', damage: 20, manaCost: 14, quiz: false },
            { name: 'Responsive Heal', icon: '📱', damage: 0, manaCost: 10, heal: 15 },
        ]
    }
};

const QUIZ_QUESTIONS = {
    sorting: [
        {
            question: 'What is the average time complexity of Quick Sort?',
            options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
            correct: 'O(n log n)'
        },
        {
            question: 'Which sorting algorithm is most efficient for small datasets?',
            options: ['Insertion Sort', 'Merge Sort', 'Heap Sort', 'Quick Sort'],
            correct: 'Insertion Sort'
        }
    ],
    search: [
        {
            question: 'Binary Search requires the array to be:',
            options: ['Sorted', 'Unsorted', 'Circular', 'Sparse'],
            correct: 'Sorted'
        },
        {
            question: 'What is the time complexity of Binary Search?',
            options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
            correct: 'O(log n)'
        }
    ],
    database: [
        {
            question: 'Which SQL clause filters results?',
            options: ['WHERE', 'SELECT', 'FROM', 'ORDER BY'],
            correct: 'WHERE'
        },
        {
            question: 'What does ACID stand for in databases?',
            options: ['Atomicity, Consistency, Isolation, Durability', 'Array, Class, Index, Data', 'Access, Control, Index, Delete', 'Auto, Create, Insert, Drop'],
            correct: 'Atomicity, Consistency, Isolation, Durability'
        }
    ],
    frontend: [
        {
            question: 'What does the Virtual DOM do in React?',
            options: ['Improves performance by minimizing real DOM updates', 'Stores component state', 'Handles routing', 'Manages API calls'],
            correct: 'Improves performance by minimizing real DOM updates'
        },
        {
            question: 'Which CSS property is used for flexbox?',
            options: ['display: flex', 'position: flex', 'layout: flex', 'flex: display'],
            correct: 'display: flex'
        }
    ]
};

let battleState = {
    player1: null,
    player2: null,
    currentTurn: 1,
    round: 1,
    selectedAttack: null,
    battleActive: false,
    player1Selected: false,
    player2Selected: false,
};

function startCodeWarriorsChallenge() {
    // Reset state
    battleState = {
        player1: null,
        player2: null,
        currentTurn: 1,
        round: 1,
        selectedAttack: null,
        battleActive: false,
        player1Selected: false,
        player2Selected: false,
    };
    
    // Show character selection
    document.getElementById('character-select').classList.remove('hidden');
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('battle-results').classList.add('hidden');
    document.getElementById('battle-start-btn').classList.add('hidden');
    
    // Reset character selections
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
}

function selectCharacter(player, characterType) {
    const character = JSON.parse(JSON.stringify(CHARACTER_CLASSES[characterType]));
    
    if (player === 1) {
        battleState.player1 = character;
        battleState.player1Selected = true;
        // Visual feedback
        document.querySelectorAll('.player-select:first-child .character-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.character-card').classList.add('selected');
    } else {
        battleState.player2 = character;
        battleState.player2Selected = true;
        // Visual feedback
        document.querySelectorAll('.player-select:last-child .character-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.character-card').classList.add('selected');
    }
    
    // Show start button if both selected
    if (battleState.player1Selected && battleState.player2Selected) {
        document.getElementById('battle-start-btn').classList.remove('hidden');
    }
}

function startBattle() {
    battleState.battleActive = true;
    
    // Hide selection, show battle
    document.getElementById('character-select').classList.add('hidden');
    document.getElementById('battle-screen').classList.remove('hidden');
    
    // Initialize battle UI
    initializeBattleUI();
    
    // Show first player's attacks
    showAttackOptions();
    
    // Don't start timer for battle game - it's turn-based
}

function initializeBattleUI() {
    // Player 1
    document.getElementById('player1-name').textContent = `Player 1 - ${battleState.player1.name}`;
    document.getElementById('player1-avatar').textContent = battleState.player1.avatar;
    updateHealthBar(1);
    updateManaBar(1);
    
    // Player 2
    document.getElementById('player2-name').textContent = `Player 2 - ${battleState.player2.name}`;
    document.getElementById('player2-avatar').textContent = battleState.player2.avatar;
    updateHealthBar(2);
    updateManaBar(2);
    
    // Reset log
    document.getElementById('battle-log').innerHTML = '<div class="log-message">Battle Start! Choose your move!</div>';
    
    updateTurnIndicator();
}

function updateHealthBar(player) {
    const character = player === 1 ? battleState.player1 : battleState.player2;
    const healthBar = document.getElementById(`player${player}-health`).querySelector('.health-fill');
    const healthText = document.getElementById(`player${player}-health`).nextElementSibling;
    
    const healthPercent = (character.health / character.maxHealth) * 100;
    healthBar.style.width = `${healthPercent}%`;
    healthText.textContent = `${Math.max(0, character.health)} / ${character.maxHealth}`;
}

function updateManaBar(player) {
    const character = player === 1 ? battleState.player1 : battleState.player2;
    const manaBar = document.getElementById(`player${player}-mana`).querySelector('.mana-fill');
    const manaText = document.getElementById(`player${player}-mana`).nextElementSibling;
    
    const manaPercent = (character.mana / character.maxMana) * 100;
    manaBar.style.width = `${manaPercent}%`;
    manaText.textContent = `${Math.max(0, character.mana)} / ${character.maxMana}`;
}

function updateTurnIndicator() {
    const indicator = document.getElementById('turn-indicator');
    const currentPlayer = battleState.currentTurn === 1 ? battleState.player1 : battleState.player2;
    indicator.textContent = `Player ${battleState.currentTurn}'s Turn - ${currentPlayer.name}`;
}

function showAttackOptions() {
    const currentPlayer = battleState.currentTurn === 1 ? battleState.player1 : battleState.player2;
    const attackGrid = document.getElementById('attack-grid');
    attackGrid.innerHTML = '';
    
    currentPlayer.attacks.forEach((attack, index) => {
        const canUse = currentPlayer.mana >= attack.manaCost;
        const attackBtn = document.createElement('div');
        attackBtn.className = `attack-btn ${!canUse ? 'disabled' : ''}`;
        attackBtn.innerHTML = `
            <div class="attack-icon">${attack.icon}</div>
            <div class="attack-name">${attack.name}</div>
            <div class="attack-cost">💧 ${attack.manaCost}</div>
            <div class="attack-damage">${attack.damage > 0 ? `⚔️ ${attack.damage}` : attack.heal ? `💚 +${attack.heal}` : `🛡️ +${attack.defense}`}</div>
        `;
        
        if (canUse) {
            attackBtn.onclick = () => useAttack(attack);
        }
        
        attackGrid.appendChild(attackBtn);
    });
}

function useAttack(attack) {
    battleState.selectedAttack = attack;
    
    // If attack requires quiz, show quiz
    if (attack.quiz) {
        showQuiz(attack.concept);
    } else {
        executeAttack(true);
    }
}

function showQuiz(concept) {
    const questions = QUIZ_QUESTIONS[concept];
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    document.getElementById('attack-panel').classList.add('hidden');
    document.getElementById('quiz-panel').classList.remove('hidden');
    
    document.getElementById('quiz-question').textContent = question.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.onclick = () => answerQuiz(option === question.correct);
        optionsContainer.appendChild(btn);
    });
}

function answerQuiz(correct) {
    document.getElementById('quiz-panel').classList.add('hidden');
    document.getElementById('attack-panel').classList.remove('hidden');
    
    executeAttack(correct);
}

function executeAttack(success) {
    const attacker = battleState.currentTurn === 1 ? battleState.player1 : battleState.player2;
    const defender = battleState.currentTurn === 1 ? battleState.player2 : battleState.player1;
    const attack = battleState.selectedAttack;
    
    // Deduct mana
    attacker.mana -= attack.manaCost;
    updateManaBar(battleState.currentTurn);
    
    // Calculate damage (reduced if quiz failed)
    let finalDamage = attack.damage;
    if (attack.quiz && !success) {
        finalDamage = Math.floor(finalDamage * 0.5);
        addBattleLog(`Quiz failed! Attack power reduced!`, 'damage');
    }
    
    // Apply effect
    if (attack.damage > 0) {
        // Attack
        defender.health -= finalDamage;
        updateHealthBar(battleState.currentTurn === 1 ? 2 : 1);
        addBattleLog(`Player ${battleState.currentTurn} used ${attack.name}! Dealt ${finalDamage} damage!`, 'damage');
        
        // Animate
        animateAttack(battleState.currentTurn);
        animateHit(battleState.currentTurn === 1 ? 2 : 1);
    } else if (attack.heal) {
        // Heal
        attacker.health = Math.min(attacker.maxHealth, attacker.health + attack.heal);
        updateHealthBar(battleState.currentTurn);
        addBattleLog(`Player ${battleState.currentTurn} used ${attack.name}! Healed ${attack.heal} HP!`, 'heal');
    } else if (attack.defense) {
        addBattleLog(`Player ${battleState.currentTurn} used ${attack.name}! Defense increased!`, 'heal');
    }
    
    // Check for winner
    if (checkWinner()) {
        return;
    }
    
    // Switch turn
    switchTurn();
}

function animateAttack(player) {
    const avatar = document.getElementById(`player${player}-avatar`);
    avatar.classList.add('attacking');
    setTimeout(() => avatar.classList.remove('attacking'), 500);
}

function animateHit(player) {
    const avatar = document.getElementById(`player${player}-avatar`);
    avatar.classList.add('hit');
    setTimeout(() => avatar.classList.remove('hit'), 300);
}

function addBattleLog(message, type = '') {
    const log = document.getElementById('battle-log');
    const msgDiv = document.createElement('div');
    msgDiv.className = `log-message ${type}`;
    msgDiv.textContent = message;
    log.appendChild(msgDiv);
    log.scrollTop = log.scrollHeight;
}

function switchTurn() {
    battleState.currentTurn = battleState.currentTurn === 1 ? 2 : 1;
    
    // Regenerate some mana
    const currentPlayer = battleState.currentTurn === 1 ? battleState.player1 : battleState.player2;
    currentPlayer.mana = Math.min(currentPlayer.maxMana, currentPlayer.mana + 5);
    updateManaBar(battleState.currentTurn);
    
    updateTurnIndicator();
    showAttackOptions();
    
    if (battleState.currentTurn === 1) {
        battleState.round++;
        document.getElementById('round-counter').textContent = `Round ${battleState.round}`;
    }
}

function checkWinner() {
    if (battleState.player1.health <= 0 || battleState.player2.health <= 0) {
        const winner = battleState.player1.health > 0 ? 1 : 2;
        endBattle(winner);
        return true;
    }
    return false;
}

function endBattle(winner) {
    battleState.battleActive = false;
    
    document.getElementById('battle-screen').classList.add('hidden');
    document.getElementById('battle-results').classList.remove('hidden');
    
    const winnerCharacter = winner === 1 ? battleState.player1 : battleState.player2;
    document.getElementById('winner-announcement').textContent = `🏆 Player ${winner} Wins! 🏆`;
    document.getElementById('winner-announcement').style.color = winner === 1 ? '#10b981' : '#f59e0b';
    
    // Show final stats
    document.getElementById('player1-final-stats').innerHTML = `
        <p>HP: ${Math.max(0, battleState.player1.health)}/${battleState.player1.maxHealth}</p>
        <p>Mana: ${battleState.player1.mana}/${battleState.player1.maxMana}</p>
        <p>Character: ${battleState.player1.name}</p>
    `;
    
    document.getElementById('player2-final-stats').innerHTML = `
        <p>HP: ${Math.max(0, battleState.player2.health)}/${battleState.player2.maxHealth}</p>
        <p>Mana: ${battleState.player2.mana}/${battleState.player2.maxMana}</p>
        <p>Character: ${battleState.player2.name}</p>
    `;
    
    incrementStats();
}
