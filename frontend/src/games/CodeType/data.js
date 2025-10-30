export const CODE_SNIPPETS = [
  {
    language: 'JavaScript',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
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
    code: `const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};`
  },
  // Add all 15+ snippets from your existing code here...
];





