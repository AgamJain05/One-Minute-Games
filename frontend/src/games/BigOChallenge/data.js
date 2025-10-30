export const ALGORITHM_QUESTIONS = [
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
    code: `function findDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
    options: ['O(n²)', 'O(n)', 'O(log n)', 'O(1)'],
    answer: 'O(n²)'
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
    code: `function sumArray(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}`,
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    answer: 'O(n)'
  },
  {
    code: `function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
    options: ['O(√n)', 'O(n)', 'O(log n)', 'O(1)'],
    answer: 'O(√n)'
  },
  {
    code: `function printPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}`,
    options: ['O(n²)', 'O(n)', 'O(2n)', 'O(log n)'],
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
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    answer: 'O(n)'
  },
  {
    code: `function hasDuplicate(arr) {
  const seen = new Set();
  for (let item of arr) {
    if (seen.has(item)) return true;
    seen.add(item);
  }
  return false;
}`,
    options: ['O(n)', 'O(n²)', 'O(1)', 'O(log n)'],
    answer: 'O(n)'
  },
  {
    code: `function getMax(arr) {
  return Math.max(...arr);
}`,
    options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
    answer: 'O(n)'
  },
  {
    code: `function twoSum(arr, target) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(arr[i], i);
  }
}`,
    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    answer: 'O(n)'
  }
];





