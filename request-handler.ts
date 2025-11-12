import http from 'http';
import { HandlerFn, Methods, RoutesMapper, ExtendedRequest, ExtendedResponse } from './types';
import { extendRequest, extendResponse } from './extensions';

export class RequestHandler {
  private req: ExtendedRequest;
  private res: ExtendedResponse;
  private routes: RoutesMapper;

  constructor(req: http.IncomingMessage, res: http.ServerResponse, routes: RoutesMapper) {
    /**
     * Apply extensions to original objects using separate extension classes
     */
    this.req = extendRequest(req);
    this.res = extendResponse(res);
    this.routes = routes;
  }
  public handle() {
    const { method, url } = this.req;
    console.log(`Handling request: ${method} ${url}`);
    /**
     * Getting the route handler based on method and URL
     */
    const handlers = this.findPathHandlers(method, url || '/');

    if (handlers.length === 0) {
      this.res.statusCode = 404;
      return this.res.end('Not Found');
    }

    /**
     * FIXME: This implementation doesn't handle errors
     * Also check if it handles async handlers
     */
    return handlers.forEach((handler) => handler(this.req, this.res));
  }

  private findPathHandlers(method: string | undefined, url: string): Array<HandlerFn> {
    if (!Object.prototype.hasOwnProperty.call(this.routes, method as string)) {
      return [];
    }
    const methodPaths = Object.keys(this.routes[method as Methods]);
    for (const path of methodPaths) {
      // match with regex and keep the name of the params
      const paramNames: Array<string> = [];
      const regexPath = path.replace(/:([^/]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });
      const regex = new RegExp(`^${regexPath}$`);
      const match = url.match(regex);
      if (match) {
        // extract params and attach to req.params
        const params = new Map();
        paramNames.forEach((name, index) => {
          params.set(name, match[index + 1]);
        });
        this.req.addRouteParams(params);
        return this.routes[method as Methods][path] as Array<HandlerFn>;
      }
    }

    return [];
  }
}
