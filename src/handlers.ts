import { Application, Request, Response, NextFunction } from "express";

const helloWordlHandler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).send({
        message: 'Hello World!'
    });
};

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).send({
        error: err.message || 'Something went wrong!'
    });
}

export const applyHandlers = (app: Application) => {
    app.get('/hello', helloWordlHandler);
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
        const path = req.baseUrl;
        const method = req.method;
        next(new Error(`${method.toUpperCase()} is not supported on path: ${path}`));
        return;
    });
    app.use(errorHandler);
};