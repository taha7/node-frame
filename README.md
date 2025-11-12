# Node Frame 🚀

A lightweight, Express-like web framework for Node.js built with TypeScript. Node Frame provides a clean, minimal API for building HTTP servers with middleware support, route parameters, and JSON responses.

## ✨ Features

- 🎯 **Express-like API** - Familiar routing and middleware patterns
- 🔧 **TypeScript First** - Built with TypeScript for excellent developer experience
- ⚡ **Lightweight** - Minimal dependencies, maximum performance
- 🛡️ **Type Safe** - Full TypeScript support with proper type inference
- 🔀 **Middleware Support** - Express-style middleware with execution order
- 📍 **Route Parameters** - Dynamic route parameters with type safety
- 📦 **JSON Response** - Built-in JSON response helpers

## 📦 Installation

```bash
npm install node-frame
```

## 🚀 Quick Start

```typescript
import app from 'node-frame';

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 📖 Usage Examples

### Basic Routes

```typescript
import app from 'node-frame';

// GET route
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

// POST route
app.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

// Other HTTP methods
app.patch('/users/:id', (req, res) => {
  res.json({ message: `Updated user ${req.params.get('id')}` });
});

app.delete('/users/:id', (req, res) => {
  res.json({ message: `Deleted user ${req.params.get('id')}` });
});
```

### Route Parameters

```typescript
// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.get('id');
  res.json({ userId });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const userId = req.params.get('userId');
  const postId = req.params.get('postId');

  res.json({
    userId,
    postId,
    message: `Post ${postId} from user ${userId}`,
  });
});
```

### Middleware

Middleware functions execute in the order they are registered and only affect routes registered **after** them (Express-style behavior).

```typescript
// Global middleware - affects all routes below
app.use((req, res) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
});

app.use((req, res) => {
  res.setHeader('X-Powered-By', 'Node-Frame');
});

// Routes registered after middleware will be affected
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Middleware registered here only affects routes below
app.use((req, res) => {
  console.log('This middleware only affects routes registered after this point');
});

app.get('/api/admin', (req, res) => {
  res.json({ admin: true });
});
```

### Route-Specific Middleware

```typescript
// Authentication middleware example
const authMiddleware = (req, res) => {
  // Check authentication logic here
  console.log('Checking authentication...');
};

const adminMiddleware = (req, res) => {
  // Check admin permissions
  console.log('Checking admin permissions...');
};

// Multiple handlers for a single route (middleware + route handler)
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Multiple middleware + handler
app.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: 'Admin area' });
});
```

### Error Handling

```typescript
// Basic error handling in routes
app.get('/api/data', (req, res) => {
  try {
    // Your logic here
    const data = { message: 'Success' };
    res.json(data);
  } catch (error) {
    res.statusCode = 500;
    res.json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((req, res) => {
  console.error(`Error handling request: ${req.method} ${req.url}`);
});
```

### Complete Example

```typescript
import app from 'node-frame';

// Global logging middleware
app.use((req, res) => {
  console.log(`📝 ${req.method} ${req.url} - ${new Date().toISOString()}`);
});

// CORS middleware
app.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/users', (req, res) => {
  // Mock data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];
  res.json({ users, count: users.length });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.get('id');
  const user = { id: userId, name: 'John Doe', email: 'john@example.com' };
  res.json({ user });
});

app.post('/api/users', (req, res) => {
  // In a real app, you'd parse req.body here
  res.statusCode = 201;
  res.json({
    message: 'User created successfully',
    user: { id: Date.now(), name: 'New User' },
  });
});

// Authentication middleware (example)
app.use((req, res) => {
  // This middleware affects only routes registered below
  const authHeader = req.headers.authorization;
  if (!authHeader && req.url?.startsWith('/api/admin')) {
    res.statusCode = 401;
    return res.json({ error: 'Unauthorized' });
  }
});

// Protected admin routes
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 100,
    totalPosts: 500,
    serverUptime: process.uptime(),
  });
});

// 404 handler (put this last)
app.get('*', (req, res) => {
  res.statusCode = 404;
  res.json({ error: 'Route not found' });
});

// Start server
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
});
```

## 🔧 API Reference

### App Methods

- `app.get(path, ...handlers)` - Register GET route
- `app.post(path, ...handlers)` - Register POST route
- `app.patch(path, ...handlers)` - Register PATCH route
- `app.put(path, ...handlers)` - Register PUT route
- `app.delete(path, ...handlers)` - Register DELETE route
- `app.options(path, ...handlers)` - Register OPTIONS route
- `app.use(...middlewares)` - Register middleware
- `app.listen(port, callback)` - Start server

### Request Object (Extended)

- `req.method` - HTTP method
- `req.url` - Request URL
- `req.headers` - Request headers
- `req.params` - Route parameters Map
- `req.params.get(key)` - Get route parameter

### Response Object (Extended)

- `res.json(data)` - Send JSON response
- `res.statusCode` - Set status code
- `res.setHeader(name, value)` - Set response header
- `res.end(data)` - End response

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run watch

# Build TypeScript
npm run build

# Run built server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Express.js
- Built with TypeScript and Node.js
