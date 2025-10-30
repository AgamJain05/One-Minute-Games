export const SQL_CHALLENGES = [
  {
    description: 'Get all users sorted by name',
    clauses: [
      'SELECT *',
      'FROM users',
      'ORDER BY name',
    ]
  },
  {
    description: 'Get active users with age greater than 18',
    clauses: [
      'SELECT *',
      'FROM users',
      'WHERE active = true',
      'AND age > 18',
    ]
  },
  {
    description: 'Count users per country',
    clauses: [
      'SELECT country, COUNT(*)',
      'FROM users',
      'GROUP BY country',
    ]
  },
  {
    description: 'Get user emails where status is pending',
    clauses: [
      'SELECT email',
      'FROM users',
      'WHERE status = "pending"',
    ]
  },
  {
    description: 'Get top 5 highest paid employees',
    clauses: [
      'SELECT *',
      'FROM employees',
      'ORDER BY salary DESC',
      'LIMIT 5',
    ]
  },
  {
    description: 'Get products with price between 10 and 50',
    clauses: [
      'SELECT name, price',
      'FROM products',
      'WHERE price BETWEEN 10 AND 50',
    ]
  },
  {
    description: 'Join users with orders',
    clauses: [
      'SELECT users.name, orders.total',
      'FROM users',
      'JOIN orders ON users.id = orders.user_id',
    ]
  },
  {
    description: 'Get average order value per customer',
    clauses: [
      'SELECT customer_id, AVG(total)',
      'FROM orders',
      'GROUP BY customer_id',
      'HAVING AVG(total) > 100',
    ]
  },
  {
    description: 'Update user status',
    clauses: [
      'UPDATE users',
      'SET status = "active"',
      'WHERE id = 1',
    ]
  },
  {
    description: 'Delete old records',
    clauses: [
      'DELETE FROM logs',
      'WHERE created_at < "2023-01-01"',
    ]
  },
  {
    description: 'Get distinct categories',
    clauses: [
      'SELECT DISTINCT category',
      'FROM products',
      'ORDER BY category',
    ]
  },
  {
    description: 'Get users who joined this year',
    clauses: [
      'SELECT *',
      'FROM users',
      'WHERE YEAR(created_at) = 2024',
    ]
  },
  {
    description: 'Count orders by status',
    clauses: [
      'SELECT status, COUNT(*) as count',
      'FROM orders',
      'GROUP BY status',
      'ORDER BY count DESC',
    ]
  },
  {
    description: 'Get customer names with their order count',
    clauses: [
      'SELECT customers.name, COUNT(orders.id)',
      'FROM customers',
      'LEFT JOIN orders ON customers.id = orders.customer_id',
      'GROUP BY customers.id',
    ]
  },
  {
    description: 'Find users with names starting with A',
    clauses: [
      'SELECT *',
      'FROM users',
      'WHERE name LIKE "A%"',
    ]
  }
];





