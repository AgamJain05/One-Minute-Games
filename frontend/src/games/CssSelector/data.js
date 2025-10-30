export const CSS_CHALLENGES = [
  {
    question: 'Select all elements with class "button"',
    options: ['.button', '#button', 'button', '*button'],
    answer: '.button'
  },
  {
    question: 'Select element with ID "header"',
    options: ['#header', '.header', 'header', '[header]'],
    answer: '#header'
  },
  {
    question: 'Select all paragraph elements',
    options: ['p', '.p', '#p', '[p]'],
    answer: 'p'
  },
  {
    question: 'Select all divs inside a section',
    options: ['section div', 'section > div', 'section.div', 'div section'],
    answer: 'section div'
  },
  {
    question: 'Select direct children divs of section',
    options: ['section > div', 'section div', 'section + div', 'section ~ div'],
    answer: 'section > div'
  },
  {
    question: 'Select first child of a list',
    options: ['li:first-child', 'li:first', 'li[first]', 'first-li'],
    answer: 'li:first-child'
  },
  {
    question: 'Select elements with attribute "data-id"',
    options: ['[data-id]', '.data-id', '#data-id', 'data-id'],
    answer: '[data-id]'
  },
  {
    question: 'Select links when hovering',
    options: ['a:hover', 'a.hover', 'a[hover]', 'hover-a'],
    answer: 'a:hover'
  },
  {
    question: 'Select every other row (odd)',
    options: ['tr:nth-child(odd)', 'tr:odd', 'tr[odd]', 'odd-tr'],
    answer: 'tr:nth-child(odd)'
  },
  {
    question: 'Select all elements',
    options: ['*', 'all', '.all', '#all'],
    answer: '*'
  },
  {
    question: 'Select paragraph with class "intro"',
    options: ['p.intro', 'p .intro', 'p#intro', 'p[intro]'],
    answer: 'p.intro'
  },
  {
    question: 'Select sibling div after p',
    options: ['p + div', 'p > div', 'p div', 'p ~ div'],
    answer: 'p + div'
  },
  {
    question: 'Select all following sibling divs',
    options: ['p ~ div', 'p + div', 'p > div', 'p div'],
    answer: 'p ~ div'
  },
  {
    question: 'Select input with type="text"',
    options: ['input[type="text"]', 'input.text', 'input#text', 'text-input'],
    answer: 'input[type="text"]'
  },
  {
    question: 'Select last child element',
    options: [':last-child', '.last-child', '#last-child', 'last'],
    answer: ':last-child'
  }
];





