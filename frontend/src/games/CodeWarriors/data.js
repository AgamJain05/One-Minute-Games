export const CHARACTERS = [
  {
    id: 'algorithm',
    name: 'Algorithm Master',
    avatar: '🧠',
    attacks: [
      { name: 'Binary Search', damage: 25, manaCost: 20, requiresQuiz: true },
      { name: 'Quick Sort', damage: 30, manaCost: 30, requiresQuiz: true },
      { name: 'Code Review', damage: 15, manaCost: 10, requiresQuiz: false }
    ]
  },
  {
    id: 'database',
    name: 'Database Guru',
    avatar: '🗄️',
    attacks: [
      { name: 'SQL Injection', damage: 28, manaCost: 25, requiresQuiz: true },
      { name: 'Query Optimize', damage: 22, manaCost: 20, requiresQuiz: true },
      { name: 'Index Scan', damage: 18, manaCost: 15, requiresQuiz: false }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Ninja',
    avatar: '🎨',
    attacks: [
      { name: 'DOM Manipulation', damage: 26, manaCost: 22, requiresQuiz: true },
      { name: 'CSS Flex Attack', damage: 24, manaCost: 20, requiresQuiz: true },
      { name: 'React Hook', damage: 20, manaCost: 15, requiresQuiz: false }
    ]
  }
];

export const QUIZ_QUESTIONS = {
  algorithm: [
    // EASY Questions (Expected: 8-10 seconds)
    {
      question: 'What does O(1) mean?',
      options: ['Constant time', 'Linear time', 'Logarithmic time', 'Quadratic time'],
      answer: 'Constant time',
      difficulty: 'easy',
      expectedTime: 10
    },
    {
      question: 'What is the time complexity of accessing an array element by index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
      answer: 'O(1)',
      difficulty: 'easy',
      expectedTime: 10
    },
    // MEDIUM Questions (Expected: 5-7 seconds)
    {
      question: 'What is the time complexity of binary search?',
      options: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'],
      answer: 'O(log n)',
      difficulty: 'medium',
      expectedTime: 7
    },
    {
      question: 'Quick sort average case complexity?',
      options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
      answer: 'O(n log n)',
      difficulty: 'medium',
      expectedTime: 7
    },
    // HARD Questions (Expected: 3-5 seconds)
    {
      question: 'Worst case time complexity of finding median in unsorted array?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
      answer: 'O(n)',
      difficulty: 'hard',
      expectedTime: 5
    },
    {
      question: 'Space complexity of merge sort?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
      answer: 'O(n)',
      difficulty: 'hard',
      expectedTime: 5
    }
  ],
  database: [
    // EASY Questions
    {
      question: 'What does SQL stand for?',
      options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'],
      answer: 'Structured Query Language',
      difficulty: 'easy',
      expectedTime: 10
    },
    {
      question: 'Which command is used to retrieve data?',
      options: ['SELECT', 'GET', 'RETRIEVE', 'FETCH'],
      answer: 'SELECT',
      difficulty: 'easy',
      expectedTime: 10
    },
    // MEDIUM Questions
    {
      question: 'Which JOIN returns all rows from both tables?',
      options: ['FULL OUTER JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'],
      answer: 'FULL OUTER JOIN',
      difficulty: 'medium',
      expectedTime: 7
    },
    {
      question: 'What does ACID stand for?',
      options: ['Atomicity Consistency Isolation Durability', 'All Create Insert Delete', 'Auto Complete Index Data', 'None'],
      answer: 'Atomicity Consistency Isolation Durability',
      difficulty: 'medium',
      expectedTime: 7
    },
    // HARD Questions
    {
      question: 'Which isolation level prevents dirty reads but allows phantom reads?',
      options: ['READ COMMITTED', 'READ UNCOMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
      answer: 'READ COMMITTED',
      difficulty: 'hard',
      expectedTime: 5
    },
    {
      question: 'What is the default isolation level in PostgreSQL?',
      options: ['READ COMMITTED', 'SERIALIZABLE', 'REPEATABLE READ', 'READ UNCOMMITTED'],
      answer: 'READ COMMITTED',
      difficulty: 'hard',
      expectedTime: 5
    }
  ],
  frontend: [
    // EASY Questions
    {
      question: 'What does HTML stand for?',
      options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTool Multi Language', 'None'],
      answer: 'HyperText Markup Language',
      difficulty: 'easy',
      expectedTime: 10
    },
    {
      question: 'Which tag is used for the largest heading?',
      options: ['<h1>', '<h6>', '<head>', '<header>'],
      answer: '<h1>',
      difficulty: 'easy',
      expectedTime: 10
    },
    // MEDIUM Questions
    {
      question: 'Which hook is used for side effects in React?',
      options: ['useEffect', 'useState', 'useContext', 'useMemo'],
      answer: 'useEffect',
      difficulty: 'medium',
      expectedTime: 7
    },
    {
      question: 'What does CSS Flexbox justify-content do?',
      options: ['Aligns items horizontally', 'Aligns items vertically', 'Sets item size', 'Changes direction'],
      answer: 'Aligns items horizontally',
      difficulty: 'medium',
      expectedTime: 7
    },
    // HARD Questions
    {
      question: 'Which React hook is used to optimize expensive calculations?',
      options: ['useMemo', 'useEffect', 'useState', 'useCallback'],
      answer: 'useMemo',
      difficulty: 'hard',
      expectedTime: 5
    },
    {
      question: 'What is the purpose of React.StrictMode?',
      options: ['Identifies potential problems', 'Improves performance', 'Adds type checking', 'Enables hot reload'],
      answer: 'Identifies potential problems',
      difficulty: 'hard',
      expectedTime: 5
    }
  ]
};

