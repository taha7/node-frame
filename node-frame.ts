import http from 'http';
import { HandlerFn, RoutesMapper } from './types';
import { RequestHandler } from './request-handler';

export class App {
  private server: http.Server;
  private routes: RoutesMapper;
  private middlewares: Array<HandlerFn>;
  constructor() {
    this.middlewares = [];
    this.routes = {
      GET: {},
      POST: {},
      PATCH: {},
      DELETE: {},
      PUT: {},
      HEAD: {},
      OPTIONS: {},
    };
    this.server = http.createServer((req, res) =>
      new RequestHandler(req, res, this.routes).handle()
    );
  }
  public use(...middlewares: Array<HandlerFn>) {
    middlewares.forEach((middleware) => this.middlewares.push(middleware));
  }
  public get(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('GET', path, [...this.middlewares, ...handlers]);
  }
  public post(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('POST', path, [...this.middlewares, ...handlers]);
  }
  public patch(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('PATCH', path, [...this.middlewares, ...handlers]);
  }
  public put(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('PUT', path, [...this.middlewares, ...handlers]);
  }
  public delete(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('DELETE', path, [...this.middlewares, ...handlers]);
  }
  public options(path: string, ...handlers: Array<HandlerFn>) {
    this.registerMultipleHandlers('OPTIONS', path, [...this.middlewares, ...handlers]);
  }
  public listen(port: number, callback: () => void) {
    this.server.listen(port, callback);
  }
  private registerMultipleHandlers(
    method: keyof RoutesMapper,
    path: string,
    handlers: Array<HandlerFn>
  ) {
    if (!this.routes[method][path]?.length) {
      this.routes[method][path] = [];
    }
    this.routes[method][path].push(...handlers);
  }
}
