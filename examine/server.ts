import { App } from ".."

const app = new App();

app.get('/posts/:id/comments/:commentId/replies', (req, res) => {
    const postId = req.params.get('id');
    const commentId = req.params.get('commentId');
    console.log(`Fetching replies for comment ${commentId} on post ${postId}`);
    res.json({ postId, commentId, replies: [] });
});

app.get('/posts/:id', (req, res) => {
    const postId = req.params.get('id');
    console.log(`Fetching post with ID: ${postId}`);
    res.json({ postId, title: "Sample Post" });
});

app.use((req, res) => {
    console.log(`---------- before route middleware ${req.method} ${req.url}`);
});

app.get("/", (req, res) => {
    console.log("GET / called");
    res.json(req.headers);
}, (req, res) => {
    console.log("Second handler for GET /");
});

app.use((req, res) => {
    console.log('after route middleware');
}, (req, res) => {
    console.log(`---------- 2 after route middleware `);
})

app.get("/hello", (req, res) => {
    console.log("GET /hello called");
    res.json({ message: "Hello, World!" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

