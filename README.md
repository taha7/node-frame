# Node Frame 🚀

A lightweight, Express-like web framework for Node.js built with TypeScript. Node Frame provides a clean, minimal API for building HTTP servers with middleware support, route parameters, and JSON responses.

## ✨ Features

- 🎯 **Express-like API** - Familiar routing and middleware patterns
- 🔧 **TypeScript First** - Built with TypeScript for excellent developer experience
- ⚡ **Lightweight** - Minimal dependencies, maximum performance
- 🛡️ **Type Safe** - Full TypeScript support with proper type inference
- 🔀 **Middleware Support** - Sequential middleware execution
- 📍 **Route Parameters** - Dynamic route parameters (`:param`)
- 📦 **JSON Response** - Built-in JSON response helper
- 🌐 **HTTP Methods** - Support for GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

## 📦 Installation

\`\`\`bash
npm install @taha7/node-frame
\`\`\`

## 🚀 Quick Start

\`\`\`typescript
import { App } from '@taha7/node-frame';

const app = new App();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## 📖 API Examples

### HTTP Methods

\`\`\`typescript
import { App } from '@taha7/node-frame';

const app = new App();

// All HTTP methods are supported
app.get('/users', (req, res) => {
  res.json({ users: [] });
});

app.post('/users', (req, res) => {
  res.json({ message: 'User created' });
});

app.put('/users/:id', (req, res) => {
  const id = req.params.get('id');
  res.json({ message: \`User \${id} updated\` });
});

app.patch('/users/:id', (req, res) => {
  const id = req.params.get('id');
  res.json({ message: \`User \${id} patched\` });
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.get('id');
  res.json({ message: \`User \${id} deleted\` });
});
\`\`\`

### Route Parameters

\`\`\`typescript
// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.get('id');
  res.json({ userId });
});

// Multiple parameters
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  const postId = req.params.get('postId');
  const commentId = req.params.get('commentId');
  
  res.json({ 
    postId, 
    commentId,
    message: \`Comment \${commentId} on post \${postId}\` 
  });
});

// Nested parameters
app.get('/posts/:id/comments/:commentId/replies', (req, res) => {
  const postId = req.params.get('id');
  const commentId = req.params.get('commentId');
  
  res.json({ 
    postId, 
    commentId, 
    replies: [] 
  });
});
\`\`\`

### Middleware

Middleware functions execute sequentially for routes registered **after** them:

\`\`\`typescript
// Global middleware - affects all routes registered below
app.use((req, res) => {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
});

app.use((req, res) => {
  res.setHeader('X-Powered-By', 'Node-Frame');
});

// Routes registered after middleware are affected
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
\`\`\`

### Route-Specific Handlers

Multiple handlers can be chained for a single route:

\`\`\`typescript
// Authentication middleware
const authMiddleware = (req, res) => {
  console.log('Checking authentication...');
  // Auth logic here
};

const adminMiddleware = (req, res) => {
  console.log('Checking admin permissions...');
  // Admin check here
};

// Multiple handlers for one route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected' });
});

// Chain multiple middleware + final handler
app.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: 'Admin area', user: 'admin' });
});
\`\`\`

### JSON Responses

The built-in \`json()\` method automatically sets content-type and serializes data:

\`\`\`typescript
app.get('/api/data', (req, res) => {
  // Automatically sets Content-Type: application/json
  res.json({
    success: true,
    data: { id: 1, name: 'Example' },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/array', (req, res) => {
  res.json([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]);
});
\`\`\`

## 📝 Types

Node Frame is fully typed. Here are the key types:

\`\`\`typescript
import { ExtendedRequest, ExtendedResponse, HandlerFn } from '@taha7/node-frame';

// Request with params support
const handler: HandlerFn = (req: ExtendedRequest, res: ExtendedResponse) => {
  // req.params.get(key) - Get route parameter
  // res.json(data) - Send JSON response
  
  const id = req.params.get('id'); // string | undefined
  res.json({ id });
};
\`\`\`

## 🔄 Complete Example

\`\`\`typescript
import { App } from '@taha7/node-frame';

const app = new App();

// Logging middleware
app.use((req, res) => {
  console.log(\`📝 \${req.method} \${req.url}\`);
});

// CORS middleware
app.use((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
});

// Auth middleware
const requireAuth = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.statusCode = 401;
    res.json({ error: 'Authorization required' });
    return;
  }
  console.log('✅ User authenticated');
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Node Frame API',
    version: '1.0.0',
    endpoints: ['/api/users', '/api/posts/:id']
  });
});

app.get('/api/users', requireAuth, (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]
  });
});

app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.get('id');
  res.json({
    id: postId,
    title: \`Post \${postId}\`,
    content: 'This is a sample post',
    author: 'Node Frame'
  });
});

app.post('/api/posts', requireAuth, (req, res) => {
  res.json({
    message: 'Post created successfully',
    id: Math.floor(Math.random() * 1000)
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Node Frame server running on http://localhost:\${PORT}\`);
});
\`\`\`

## 🔧 API Reference

### App Methods

- \`app.get(path, ...handlers)\` - Register GET route
- \`app.post(path, ...handlers)\` - Register POST route
- \`app.patch(path, ...handlers)\` - Register PATCH route
- \`app.put(path, ...handlers)\` - Register PUT route
- \`app.delete(path, ...handlers)\` - Register DELETE route
- \`app.options(path, ...handlers)\` - Register OPTIONS route
- \`app.use(...middlewares)\` - Register middleware
- \`app.listen(port, callback)\` - Start server

### Request Object (Extended)

- \`req.method\` - HTTP method
- \`req.url\` - Request URL
- \`req.headers\` - Request headers
- \`req.params\` - Route parameters Map
- \`req.params.get(key)\` - Get route parameter

### Response Object (Extended)

- \`res.json(data)\` - Send JSON response
- \`res.statusCode\` - Set status code
- \`res.setHeader(name, value)\` - Set response header
- \`res.end(data)\` - End response

## 🛠️ Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build TypeScript
npm run build

# Run built server
npm start
\`\`\`

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
