import http from "http";

export type RequestExtensions = {
    params: Map<string, string>;
    addRouteParams: (params: Map<string, string>) => void;
};

export type ResponseExtensions = {
    json: <T>(data: T) => void;
};

export type ExtendedRequest = http.IncomingMessage & RequestExtensions;
export type ExtendedResponse = http.ServerResponse & ResponseExtensions;

export type HandlerFn = (req: ExtendedRequest, res: ExtendedResponse) => void

export type Methods = "GET" | "POST" | "PATCH" | "DELETE" | "PUT" | "HEAD" | "OPTIONS";

export type RoutesMapper = {
    [key in Methods]: Record<string, Array<HandlerFn>>;
}
