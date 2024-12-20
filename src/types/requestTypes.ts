import { IncomingMessage, ServerResponse } from "http"

type RequesHandler = (req: IncomingMessage, res: ServerResponse) => void;

export interface RouteHandlers{
    GET?:RequesHandler;
    POST?:RequesHandler;
    PATCH?:RequesHandler;
    DELETE?:RequesHandler;
}