import http from "http";
import { ExtendedRequest, ExtendedResponse, RequestExtensions } from "./types";

export function extendRequest(req: http.IncomingMessage): ExtendedRequest {
    const extended = req as ExtendedRequest

    extended.params = new Map<string, string>();
    extended.addRouteParams = function (params: Map<string, string>) {
        params.forEach((value, key) => {
            this.params.set(key, value);
        });
    };
    return extended;
}

export function extendResponse(res: http.ServerResponse): ExtendedResponse {
    const extended = res as ExtendedResponse;

    extended.json = function <T>(data: T) {
        this.setHeader("Content-Type", "application/json");
        try {
            this.end(JSON.stringify(data));
        } catch (error) {
            this.statusCode = 500;
            this.end("Internal Server Error");
        }
    };
    return extended;
}
