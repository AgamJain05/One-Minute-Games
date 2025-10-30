export const REGEX_QUESTIONS = [
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





