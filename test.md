{
    middlewares: []
    GET: {
        middlewares
        /home: [handler, handler, handler]
    }
}

/posts/:id => /posts/
/posts/1

get('route1') 1
use(middleware) 2
get('/route2') 3

['route1', ]


const executeHandlers = async (handlers: HandlerFn[], req: FrameRequest, res: FrameResponse) => {
+         let idx = 0;
+         const next = (err?: any) => {
+           if (err) {
+             res.statusCode = 500;
+             return res.end("Internal Server Error");
+           }
+           if (idx >= handlers.length) return;
+           try {
+             handlers[idx++](req, res, next);
+           } catch (error) {
+             res.statusCode = 500;
+             res.end("Internal Server Error");
+           }
+         };
+         next();
+       };
+       return executeHandlers(handlers, req, adaptedResponse);
