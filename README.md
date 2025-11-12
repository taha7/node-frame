# Node Frame 🚀

Lightweight, Express-like HTTP framework for Node.js written in TypeScript. Provides routing, middleware chaining, route params, and JSON helpers with a small surface area.

## ✨ Features

- Express-style routing (`get`, `post`, `put`, `patch`, `delete`, `options`)
- Middleware chaining (global + per-route)
- Dynamic route params (`:id`, etc.) via `req.params.get()`
- Built-in `res.json()` helper
- Fully typed API (TypeScript)
- Minimal footprint

## 📦 Installation

```bash
npm install @taha7/node-frame
```

## 🚀 Quick Start

```typescript
import { App } from '@taha7/node-frame';

const app = new App();

app.get('/', (_req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(3000, () => console.log('Server running on :3000'));
```

## 🧠 Core Concepts

### Routing & Params

```typescript
app.get('/users/:id', (req, res) => {
  const id = req.params.get('id');
  res.json({ id });
});

app.get('/posts/:postId/comments/:commentId', (req, res) => {
  res.json({
    postId: req.params.get('postId'),
    commentId: req.params.get('commentId'),
  });
});
```

### Middleware

Global middleware affects subsequently registered routes:

```typescript
app.use((req, _res) => {
  console.log(`${req.method} ${req.url}`);
});

app.use((_req, res) => {
  res.setHeader('X-Powered-By', 'Node-Frame');
});

app.get('/api/users', (_req, res) => {
  res.json({ users: [] });
});
```

### Chained Route Handlers

```typescript
const auth = (req, res) => {
  if (!req.headers.authorization) {
    res.statusCode = 401;
    return res.json({ error: 'Unauthorized' });
  }
};

const admin = (_req, _res) => {
  // verify admin role here
};

app.get('/protected', auth, (_req, res) => {
  res.json({ ok: true });
});

app.get('/admin', auth, admin, (_req, res) => {
  res.json({ area: 'admin' });
});
```

### JSON Responses

```typescript
app.get('/api/data', (_req, res) => {
  res.json({ success: true, time: Date.now() });
});
```

## 📝 Types Overview

```typescript
import { ExtendedRequest, ExtendedResponse, HandlerFn } from '@taha7/node-frame';

const handler: HandlerFn = (req: ExtendedRequest, res: ExtendedResponse) => {
  const id = req.params.get('id'); // string | undefined
  res.json({ id });
};
```

## 🔄 Complete Example

```typescript
import { App } from '@taha7/node-frame';

const app = new App();

// Logging
app.use((req) => console.log(`${req.method} ${req.url}`));

// Simple auth middleware
const requireAuth = (req, res) => {
  if (!req.headers.authorization) {
    res.statusCode = 401;
    return res.json({ error: 'Authorization required' });
  }
};

app.get('/', (_req, res) => {
  res.json({ message: 'Node Frame API', version: '1.0.0' });
});

app.get('/api/users', requireAuth, (_req, res) => {
  res.json({ users: [{ id: 1, name: 'Alice' }] });
});

app.post('/api/posts', requireAuth, (_req, res) => {
  res.json({ message: 'Created', id: Math.floor(Math.random() * 1000) });
});

app.get('/api/posts/:id', (req, res) => {
  res.json({ id: req.params.get('id'), title: 'Sample Post' });
});

app.listen(3000, () => console.log('Node Frame running on http://localhost:3000'));
```

## 🔧 API Reference

### App

- `app.get(path, ...handlers)`
- `app.post(path, ...handlers)`
- `app.put(path, ...handlers)`
- `app.patch(path, ...handlers)`
- `app.delete(path, ...handlers)`
- `app.options(path, ...handlers)`
- `app.use(...middlewares)` – register global middleware
- `app.listen(port, callback)`

### Request (`ExtendedRequest`)

- `method`, `url`, `headers`
- `params: Map<string,string>`
- `params.get(key)`

### Response (`ExtendedResponse`)

- `statusCode`
- `setHeader(name, value)`
- `json(data)` – sends JSON + sets `Content-Type`
- `end(data?)`

## 🛠️ Development

```bash
npm install
npm run dev
npm run build
npm start
```

## 📄 License

MIT

## 🤝 Contributing

PRs welcome! Open an issue to discuss larger changes.
