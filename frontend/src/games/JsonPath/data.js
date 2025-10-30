export const JSON_CHALLENGES = [
  {
    json: { user: { name: 'Alice', age: 30 } },
    question: 'Access the user name',
    options: ['user.name', 'name.user', 'user[name]', 'name'],
    answer: 'user.name'
  },
  {
    json: { users: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Carol' }] },
    question: 'Access the first user name',
    options: ['users[0].name', 'users.0.name', 'users[name][0]', 'name.users[0]'],
    answer: 'users[0].name'
  },
  {
    json: { data: { items: { products: ['A', 'B', 'C'] } } },
    question: 'Access the first product',
    options: ['data.items.products[0]', 'products[0].items', 'data[0].products', 'items.data[0]'],
    answer: 'data.items.products[0]'
  },
  {
    json: { config: { server: { port: 3000 } } },
    question: 'Access the port number',
    options: ['config.server.port', 'server.config.port', 'port.server', 'config.port'],
    answer: 'config.server.port'
  },
  {
    json: { store: { books: [{ title: 'JS Guide', price: 29 }] } },
    question: 'Access the book price',
    options: ['store.books[0].price', 'books.price[0]', 'price.books[0]', 'store[0].price'],
    answer: 'store.books[0].price'
  },
  {
    json: { person: { address: { city: 'NYC', zip: '10001' } } },
    question: 'Access the city',
    options: ['person.address.city', 'address.city', 'city.address', 'person.city'],
    answer: 'person.address.city'
  },
  {
    json: { api: { endpoints: { users: '/api/users' } } },
    question: 'Access the users endpoint',
    options: ['api.endpoints.users', 'endpoints.users', 'users.api', 'api.users'],
    answer: 'api.endpoints.users'
  },
  {
    json: { results: [{ score: 95 }, { score: 87 }] },
    question: 'Access second score',
    options: ['results[1].score', 'score[1]', 'results.score[1]', 'score.results[1]'],
    answer: 'results[1].score'
  },
  {
    json: { app: { settings: { theme: 'dark' } } },
    question: 'Access the theme',
    options: ['app.settings.theme', 'theme.settings', 'settings.theme', 'app.theme'],
    answer: 'app.settings.theme'
  },
  {
    json: { db: { connection: { host: 'localhost', port: 5432 } } },
    question: 'Access the host',
    options: ['db.connection.host', 'connection.host', 'host.db', 'db.host'],
    answer: 'db.connection.host'
  }
];





