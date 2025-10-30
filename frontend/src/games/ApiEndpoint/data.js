// ===== API ENDPOINT RUSH: STORY-DRIVEN API DESIGN =====
// Real scenarios that make you THINK like a backend developer

export const API_SCENARIOS = [
  // ===== USER MANAGEMENT SCENARIOS =====
  {
    id: 1,
    category: '👥 Users',
    difficulty: 'beginner',
    story: 'You have a database with 5 users. Your frontend wants to display all of them on the dashboard.',
    problem: 'What endpoint should the frontend call?',
    context: {
      database: '5 users stored',
      action: 'Retrieve all users',
      dataFlow: 'Database → Backend → Frontend'
    },
    answer: {
      method: 'GET',
      path: '/users',
      fullEndpoint: 'GET /users'
    },
    wrongAnswers: [
      { method: 'POST', path: '/users', fullEndpoint: 'POST /users' },
      { method: 'GET', path: '/user', fullEndpoint: 'GET /user' },
      { method: 'FETCH', path: '/users', fullEndpoint: 'FETCH /users' }
    ],
    explanation: '🎯 GET = Retrieve data. Plural /users means all users. No body needed.',
    why: 'GET is for reading/fetching data without changing anything. Use plural for collections.',
    example: {
      request: 'GET /users',
      response: '[\n  { id: 1, name: "Alice" },\n  { id: 2, name: "Bob" },\n  { id: 3, name: "Charlie" }\n]'
    },
    tip: '💡 GET = "Go get me the data" (no changes)',
    commonMistake: 'Using POST instead of GET (POST is for creating, not reading)'
  },

  {
    id: 2,
    category: '👥 Users',
    difficulty: 'beginner',
    story: 'A new person named Sarah fills out your registration form with name, email, and password.',
    problem: 'What endpoint should your app hit to save Sarah to the database?',
    context: {
      database: 'Empty slot ready',
      action: 'Add new user',
      dataFlow: 'Frontend → Backend → Database'
    },
    answer: {
      method: 'POST',
      path: '/users',
      fullEndpoint: 'POST /users'
    },
    wrongAnswers: [
      { method: 'GET', path: '/users', fullEndpoint: 'GET /users' },
      { method: 'PUT', path: '/users', fullEndpoint: 'PUT /users' },
      { method: 'CREATE', path: '/users', fullEndpoint: 'CREATE /users' }
    ],
    explanation: '🎯 POST = Create new data. /users collection gets a new member.',
    why: 'POST creates new resources. Data goes in the request body. Server assigns the ID.',
    example: {
      request: 'POST /users\nBody: {\n  "name": "Sarah",\n  "email": "sarah@email.com",\n  "password": "***"\n}',
      response: '{\n  "id": 6,\n  "name": "Sarah",\n  "email": "sarah@email.com"\n}'
    },
    tip: '💡 POST = "Put this new thing in the collection"',
    commonMistake: 'Using PUT (PUT is for replacing existing data, not creating)'
  },

  {
    id: 3,
    category: '👥 Users',
    difficulty: 'beginner',
    story: 'You know Alice has user ID 3. You need to show her profile with just her data.',
    problem: 'What endpoint fetches only Alice\'s information?',
    context: {
      database: 'User #3 = Alice',
      action: 'Get specific user',
      dataFlow: 'Know ID → Fetch one user'
    },
    answer: {
      method: 'GET',
      path: '/users/3',
      fullEndpoint: 'GET /users/3'
    },
    wrongAnswers: [
      { method: 'GET', path: '/user/3', fullEndpoint: 'GET /user/3' },
      { method: 'POST', path: '/users/3', fullEndpoint: 'POST /users/3' },
      { method: 'GET', path: '/users?id=3', fullEndpoint: 'GET /users?id=3' }
    ],
    explanation: '🎯 GET /users/:id follows REST convention. :id is a route parameter (placeholder).',
    why: 'The ID in the URL path identifies which specific user. GET fetches it.',
    example: {
      request: 'GET /users/3',
      response: '{\n  "id": 3,\n  "name": "Alice",\n  "email": "alice@email.com"\n}'
    },
    tip: '💡 /users/:id pattern is RESTful standard for "one specific item"',
    commonMistake: 'Using /user (singular) or query params ?id=3 instead of path param'
  },

  {
    id: 4,
    category: '👥 Users',
    difficulty: 'intermediate',
    story: 'Bob (user #2) got married and changed his name, email, AND profile pic. All his data needs updating.',
    problem: 'What endpoint completely replaces Bob\'s information?',
    context: {
      database: 'User #2 exists',
      action: 'Replace ALL fields',
      dataFlow: 'New complete data → Replace old data'
    },
    answer: {
      method: 'PUT',
      path: '/users/2',
      fullEndpoint: 'PUT /users/2'
    },
    wrongAnswers: [
      { method: 'PATCH', path: '/users/2', fullEndpoint: 'PATCH /users/2' },
      { method: 'POST', path: '/users/2', fullEndpoint: 'POST /users/2' },
      { method: 'UPDATE', path: '/users/2', fullEndpoint: 'UPDATE /users/2' }
    ],
    explanation: '🎯 PUT = Complete replacement. Send ALL fields, even unchanged ones.',
    why: 'PUT replaces the entire resource. PATCH updates parts. PUT is "here\'s the whole new version".',
    example: {
      request: 'PUT /users/2\nBody: {\n  "name": "Bob Smith",\n  "email": "bob.new@email.com",\n  "profilePic": "new.jpg"\n}',
      response: '{\n  "id": 2,\n  "name": "Bob Smith",\n  "email": "bob.new@email.com"\n}'
    },
    tip: '💡 PUT = "Put this complete new version here" (replace all)',
    commonMistake: 'Confusing PUT (full replace) with PATCH (partial update)'
  },

  {
    id: 5,
    category: '👥 Users',
    difficulty: 'intermediate',
    story: 'Charlie (user #5) only wants to change his email. Name and everything else stays the same.',
    problem: 'What endpoint updates just Charlie\'s email?',
    context: {
      database: 'User #5 exists',
      action: 'Update ONLY email',
      dataFlow: 'One field changed → Rest unchanged'
    },
    answer: {
      method: 'PATCH',
      path: '/users/5',
      fullEndpoint: 'PATCH /users/5'
    },
    wrongAnswers: [
      { method: 'PUT', path: '/users/5', fullEndpoint: 'PUT /users/5' },
      { method: 'POST', path: '/users/5/email', fullEndpoint: 'POST /users/5/email' },
      { method: 'UPDATE', path: '/users/5', fullEndpoint: 'UPDATE /users/5' }
    ],
    explanation: '🎯 PATCH = Partial update. Send only the fields that changed.',
    why: 'PATCH is efficient - only send what changed. PUT would require all fields.',
    example: {
      request: 'PATCH /users/5\nBody: {\n  "email": "charlie.new@email.com"\n}',
      response: '{\n  "id": 5,\n  "name": "Charlie",\n  "email": "charlie.new@email.com"\n}'
    },
    tip: '💡 PATCH = "Patch up this one thing" (partial update)',
    commonMistake: 'Using PUT when only one field changes (wastes bandwidth)'
  },

  {
    id: 6,
    category: '👥 Users',
    difficulty: 'beginner',
    story: 'User #7 violated terms of service. Your admin needs to remove them from the database permanently.',
    problem: 'What endpoint deletes user #7?',
    context: {
      database: 'User #7 exists',
      action: 'Remove forever',
      dataFlow: 'Delete from database'
    },
    answer: {
      method: 'DELETE',
      path: '/users/7',
      fullEndpoint: 'DELETE /users/7'
    },
    wrongAnswers: [
      { method: 'POST', path: '/users/7/delete', fullEndpoint: 'POST /users/7/delete' },
      { method: 'REMOVE', path: '/users/7', fullEndpoint: 'REMOVE /users/7' },
      { method: 'PUT', path: '/users/7', fullEndpoint: 'PUT /users/7' }
    ],
    explanation: '🎯 DELETE = Remove resource. Simple and destructive.',
    why: 'DELETE is straightforward - the HTTP method IS the action. No body needed.',
    example: {
      request: 'DELETE /users/7',
      response: '{\n  "message": "User deleted",\n  "id": 7\n}'
    },
    tip: '⚠️ DELETE is permanent! Often requires authentication/authorization.',
    commonMistake: 'Using POST /users/7/delete instead of DELETE method'
  },

  // ===== BLOG POST SCENARIOS =====
  {
    id: 7,
    category: '📝 Posts',
    difficulty: 'intermediate',
    story: 'Alice (user #3) has written 12 blog posts. You want to show all HER posts on her profile.',
    problem: 'What endpoint gets Alice\'s posts?',
    context: {
      database: 'User #3 has 12 posts',
      action: 'Get posts for specific user',
      dataFlow: 'User → Their posts'
    },
    answer: {
      method: 'GET',
      path: '/users/3/posts',
      fullEndpoint: 'GET /users/3/posts'
    },
    wrongAnswers: [
      { method: 'GET', path: '/posts?userId=3', fullEndpoint: 'GET /posts?userId=3' },
      { method: 'GET', path: '/posts/user/3', fullEndpoint: 'GET /posts/user/3' },
      { method: 'POST', path: '/users/3/posts', fullEndpoint: 'POST /users/3/posts' }
    ],
    explanation: '🎯 Nested route /users/:id/posts shows relationship: "posts belonging to user".',
    why: 'RESTful design: resources can be nested to show ownership/relationships.',
    example: {
      request: 'GET /users/3/posts',
      response: '[\n  { id: 1, title: "My First Post", userId: 3 },\n  { id: 2, title: "Second Post", userId: 3 }\n]'
    },
    tip: '💡 Nested routes show relationships: /parent/:id/children',
    commonMistake: 'Using query params ?userId=3 instead of nested route (both work, but nested is clearer)'
  },

  {
    id: 8,
    category: '📝 Posts',
    difficulty: 'intermediate',
    story: 'Bob (user #2) just wrote a new blog post "My Journey" and wants to publish it under his account.',
    problem: 'What endpoint creates Bob\'s new post?',
    context: {
      database: 'Bob = user #2',
      action: 'Create post for Bob',
      dataFlow: 'New post → Bob\'s collection'
    },
    answer: {
      method: 'POST',
      path: '/users/2/posts',
      fullEndpoint: 'POST /users/2/posts'
    },
    wrongAnswers: [
      { method: 'POST', path: '/posts', fullEndpoint: 'POST /posts' },
      { method: 'PUT', path: '/users/2/posts', fullEndpoint: 'PUT /users/2/posts' },
      { method: 'CREATE', path: '/users/2/posts', fullEndpoint: 'CREATE /users/2/posts' }
    ],
    explanation: '🎯 POST to nested route creates a resource under the parent (user).',
    why: 'The route clearly shows: "create a post for user 2". Relationship is explicit.',
    example: {
      request: 'POST /users/2/posts\nBody: {\n  "title": "My Journey",\n  "content": "..."\n}',
      response: '{\n  "id": 13,\n  "title": "My Journey",\n  "userId": 2\n}'
    },
    tip: '💡 POST to /parent/:id/children creates under that parent',
    commonMistake: 'Using POST /posts with userId in body (works but less RESTful)'
  },

  {
    id: 9,
    category: '📝 Posts',
    difficulty: 'intermediate',
    story: 'You need to show post #42 in detail view. You already know the post ID.',
    problem: 'What\'s the simplest endpoint to get post #42?',
    context: {
      database: 'Post #42 exists',
      action: 'Get one specific post',
      dataFlow: 'ID known → Fetch post'
    },
    answer: {
      method: 'GET',
      path: '/posts/42',
      fullEndpoint: 'GET /posts/42'
    },
    wrongAnswers: [
      { method: 'GET', path: '/post/42', fullEndpoint: 'GET /post/42' },
      { method: 'POST', path: '/posts/42', fullEndpoint: 'POST /posts/42' },
      { method: 'GET', path: '/users/:userId/posts/42', fullEndpoint: 'GET /users/:userId/posts/42' }
    ],
    explanation: '🎯 Direct access by ID. No need for parent route if you know the ID.',
    why: 'If you know the post ID, go straight there. Nested routes are for filtering by parent.',
    example: {
      request: 'GET /posts/42',
      response: '{\n  "id": 42,\n  "title": "The Answer",\n  "content": "...",\n  "userId": 3\n}'
    },
    tip: '💡 Direct ID access is simpler when you know the exact ID',
    commonMistake: 'Over-nesting routes when direct access is simpler'
  },

  // ===== SEARCH & FILTER SCENARIOS =====
  {
    id: 10,
    category: '🔍 Search',
    difficulty: 'intermediate',
    story: 'Your search bar needs to find all users whose name contains "john" (John, Johnny, Johnson, etc).',
    problem: 'What endpoint searches users by name?',
    context: {
      database: '100 users total',
      action: 'Filter by name pattern',
      dataFlow: 'Search term → Filtered results'
    },
    answer: {
      method: 'GET',
      path: '/users?search=john',
      fullEndpoint: 'GET /users?search=john'
    },
    wrongAnswers: [
      { method: 'POST', path: '/users/search', fullEndpoint: 'POST /users/search' },
      { method: 'SEARCH', path: '/users', fullEndpoint: 'SEARCH /users' },
      { method: 'GET', path: '/search/users?name=john', fullEndpoint: 'GET /search/users?name=john' }
    ],
    explanation: '🎯 GET with query params (?key=value) for filtering collections.',
    why: 'Query params filter data without changing the resource. GET is still reading.',
    example: {
      request: 'GET /users?search=john',
      response: '[\n  { id: 5, name: "John Doe" },\n  { id: 12, name: "Johnny" },\n  { id: 23, name: "Johnson" }\n]'
    },
    tip: '💡 Query params (?) = filters, sorting, pagination on GET requests',
    commonMistake: 'Creating POST /search endpoint (search is reading, not creating!)'
  },

  {
    id: 11,
    category: '🔍 Search',
    difficulty: 'advanced',
    story: 'You want to show page 2 of users (10 per page) sorted by signup date, newest first.',
    problem: 'What endpoint gets this paginated, sorted data?',
    context: {
      database: '100 total users',
      action: 'Page 2, sort by date',
      dataFlow: 'Filter + Sort + Paginate'
    },
    answer: {
      method: 'GET',
      path: '/users?page=2&limit=10&sort=createdAt&order=desc',
      fullEndpoint: 'GET /users?page=2&limit=10&sort=createdAt&order=desc'
    },
    wrongAnswers: [
      { method: 'GET', path: '/users/page/2', fullEndpoint: 'GET /users/page/2' },
      { method: 'POST', path: '/users/paginate', fullEndpoint: 'POST /users/paginate' },
      { method: 'GET', path: '/users?page=2', fullEndpoint: 'GET /users?page=2' }
    ],
    explanation: '🎯 Multiple query params combine filters. Standard pagination pattern.',
    why: 'Query params keep the URL semantic and RESTful. Easy to bookmark/share.',
    example: {
      request: 'GET /users?page=2&limit=10&sort=createdAt&order=desc',
      response: '{\n  "users": [...],\n  "page": 2,\n  "total": 100\n}'
    },
    tip: '💡 Common params: page, limit, sort, order, filter, search',
    commonMistake: 'Putting pagination in path (/users/page/2) instead of query params'
  },

  // ===== AUTHENTICATION SCENARIOS =====
  {
    id: 12,
    category: '🔐 Auth',
    difficulty: 'intermediate',
    story: 'Sarah enters her email and password on your login form. You need to verify and create a session.',
    problem: 'What endpoint handles login?',
    context: {
      database: 'Check credentials',
      action: 'Authenticate user',
      dataFlow: 'Credentials → Verify → Token'
    },
    answer: {
      method: 'POST',
      path: '/auth/login',
      fullEndpoint: 'POST /auth/login'
    },
    wrongAnswers: [
      { method: 'GET', path: '/auth/login', fullEndpoint: 'GET /auth/login' },
      { method: 'POST', path: '/login', fullEndpoint: 'POST /login' },
      { method: 'AUTH', path: '/login', fullEndpoint: 'AUTH /login' }
    ],
    explanation: '🎯 POST because credentials in body, /auth namespace for auth routes.',
    why: 'POST hides credentials in body (not URL). Creates session/token. Auth grouped under /auth.',
    example: {
      request: 'POST /auth/login\nBody: {\n  "email": "sarah@email.com",\n  "password": "***"\n}',
      response: '{\n  "token": "jwt...",\n  "user": { "id": 6, "name": "Sarah" }\n}'
    },
    tip: '🔒 Never use GET for login (passwords would be in URL!)',
    commonMistake: 'Using GET (exposes passwords in URL/logs) or omitting /auth namespace'
  },

  {
    id: 13,
    category: '🔐 Auth',
    difficulty: 'intermediate',
    story: 'John wants to create an account with email, password, and username.',
    problem: 'What endpoint registers a new user?',
    context: {
      database: 'Create user + credentials',
      action: 'Sign up',
      dataFlow: 'New credentials → Validate → Create'
    },
    answer: {
      method: 'POST',
      path: '/auth/register',
      fullEndpoint: 'POST /auth/register'
    },
    wrongAnswers: [
      { method: 'POST', path: '/users', fullEndpoint: 'POST /users' },
      { method: 'POST', path: '/register', fullEndpoint: 'POST /register' },
      { method: 'CREATE', path: '/auth/register', fullEndpoint: 'CREATE /auth/register' }
    ],
    explanation: '🎯 POST /auth/register separates auth logic from user CRUD.',
    why: 'Registration has special logic (password hashing, validation). Keep auth separate.',
    example: {
      request: 'POST /auth/register\nBody: {\n  "email": "john@email.com",\n  "password": "***",\n  "username": "john"\n}',
      response: '{\n  "token": "jwt...",\n  "user": { "id": 15, "username": "john" }\n}'
    },
    tip: '💡 /auth/register vs POST /users: register handles auth logic, /users is CRUD',
    commonMistake: 'Using POST /users (works but mixes concerns - auth should be separate)'
  },

  // ===== RELATIONSHIP SCENARIOS =====
  {
    id: 14,
    category: '💬 Comments',
    difficulty: 'advanced',
    story: 'You want to display all comments on post #42. Comments are nested under posts.',
    problem: 'What endpoint gets comments for post #42?',
    context: {
      database: 'Post #42 has 8 comments',
      action: 'Get comments for post',
      dataFlow: 'Post → Its comments'
    },
    answer: {
      method: 'GET',
      path: '/posts/42/comments',
      fullEndpoint: 'GET /posts/42/comments'
    },
    wrongAnswers: [
      { method: 'GET', path: '/comments?postId=42', fullEndpoint: 'GET /comments?postId=42' },
      { method: 'GET', path: '/comments/post/42', fullEndpoint: 'GET /comments/post/42' },
      { method: 'POST', path: '/posts/42/comments', fullEndpoint: 'POST /posts/42/comments' }
    ],
    explanation: '🎯 Nested route shows relationship: comments belong to post.',
    why: 'RESTful hierarchy: posts contain comments. URL structure mirrors data structure.',
    example: {
      request: 'GET /posts/42/comments',
      response: '[\n  { id: 1, text: "Great post!", postId: 42 },\n  { id: 2, text: "Agreed!", postId: 42 }\n]'
    },
    tip: '💡 Nested routes: /parent/:id/child shows ownership',
    commonMistake: 'Flat structure /comments?postId=42 (works but less semantic)'
  },

  {
    id: 15,
    category: '💬 Comments',
    difficulty: 'advanced',
    story: 'User #5 wants to add a comment "Nice article!" to post #42.',
    problem: 'What endpoint creates this comment?',
    context: {
      database: 'Post #42 exists',
      action: 'Add comment to post',
      dataFlow: 'New comment → Post #42'
    },
    answer: {
      method: 'POST',
      path: '/posts/42/comments',
      fullEndpoint: 'POST /posts/42/comments'
    },
    wrongAnswers: [
      { method: 'POST', path: '/comments', fullEndpoint: 'POST /comments' },
      { method: 'PUT', path: '/posts/42/comments', fullEndpoint: 'PUT /posts/42/comments' },
      { method: 'POST', path: '/users/5/comments', fullEndpoint: 'POST /users/5/comments' }
    ],
    explanation: '🎯 POST to nested route creates child under parent.',
    why: 'Clear relationship: creating a comment ON post 42. UserId goes in body/auth.',
    example: {
      request: 'POST /posts/42/comments\nBody: {\n  "text": "Nice article!",\n  "userId": 5\n}',
      response: '{\n  "id": 9,\n  "text": "Nice article!",\n  "postId": 42,\n  "userId": 5\n}'
    },
    tip: '💡 POST /parent/:id/children creates a child of that parent',
    commonMistake: 'Using POST /comments with postId in body (less clear ownership)'
  }
];

// ===== API DESIGN PRINCIPLES =====
export const API_PRINCIPLES = [
  {
    principle: 'HTTP Methods',
    rules: {
      'GET': 'Read/fetch data (no changes)',
      'POST': 'Create new resource',
      'PUT': 'Replace entire resource',
      'PATCH': 'Update parts of resource',
      'DELETE': 'Remove resource'
    },
    mnemonic: '📖 GET it, 📝 POST it, 🔄 PUT it back, 🩹 PATCH it up, 🗑️ DELETE it'
  },
  {
    principle: 'URL Structure',
    rules: {
      'Plural nouns': '/users, /posts (not /user)',
      'Path params': '/users/:id (specific item)',
      'Query params': '/users?search=john (filters)',
      'Nested routes': '/users/:id/posts (relationships)'
    },
    mnemonic: '🏗️ Build URLs like folder trees'
  },
  {
    principle: 'REST Best Practices',
    rules: {
      'Nouns, not verbs': '/users not /getUsers',
      'Consistent naming': 'Always plural or always singular',
      'Logical nesting': 'Max 2-3 levels deep',
      'Use query params': 'For filters, not path params'
    },
    mnemonic: '🎯 RESTful = Predictable = Easy to use'
  }
];

// ===== COMMON MISTAKES =====
export const COMMON_MISTAKES = [
  {
    mistake: 'Using GET with body',
    why: 'GET requests shouldn\'t have a body. Use query params instead.',
    correct: 'GET /users?search=john',
    wrong: 'GET /users with body: { search: "john" }'
  },
  {
    mistake: 'POST for search/filter',
    why: 'Search is reading data, not creating. Use GET.',
    correct: 'GET /users?search=john',
    wrong: 'POST /users/search'
  },
  {
    mistake: 'Verbs in URLs',
    why: 'REST uses nouns + HTTP methods. Method IS the verb.',
    correct: 'DELETE /users/5',
    wrong: 'POST /users/5/delete or GET /deleteUser?id=5'
  },
  {
    mistake: 'Singular resource names',
    why: 'Collections are plural. Individual items still use plural route.',
    correct: '/users/5 (from /users collection)',
    wrong: '/user/5'
  },
  {
    mistake: 'Passwords in GET params',
    why: 'URLs are logged/cached. Credentials must be in body.',
    correct: 'POST /auth/login with body',
    wrong: 'GET /login?password=123'
  }
];

// ===== QUICK REFERENCE =====
export const HTTP_METHODS_GUIDE = {
  'GET': {
    purpose: 'Retrieve/Read data',
    hasBody: false,
    idempotent: true,
    safe: true,
    examples: ['GET /users', 'GET /users/3', 'GET /posts?search=api']
  },
  'POST': {
    purpose: 'Create new resource',
    hasBody: true,
    idempotent: false,
    safe: false,
    examples: ['POST /users', 'POST /auth/login', 'POST /posts/5/comments']
  },
  'PUT': {
    purpose: 'Replace entire resource',
    hasBody: true,
    idempotent: true,
    safe: false,
    examples: ['PUT /users/3', 'PUT /posts/42']
  },
  'PATCH': {
    purpose: 'Update parts of resource',
    hasBody: true,
    idempotent: true,
    safe: false,
    examples: ['PATCH /users/3', 'PATCH /posts/42']
  },
  'DELETE': {
    purpose: 'Remove resource',
    hasBody: false,
    idempotent: true,
    safe: false,
    examples: ['DELETE /users/3', 'DELETE /posts/42']
  }
};

export default API_SCENARIOS;
