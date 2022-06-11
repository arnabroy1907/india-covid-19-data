import { Application, Request, Response, NextFunction } from "express";
import { getCovidData } from "./covid-data";

const covidDataHandler = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const covidData = await getCovidData();
        return res.status(200).send(covidData);
    } catch (err) {
        next(err);
        return;
    }
}

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(500).send({
        error: err.message || 'Something went wrong!'
    });
}

export const applyHandlers = (app: Application) => {
    app.get('/api/covid-data', covidDataHandler);

    app.use('*', (req: Request, _res: Response, next: NextFunction) => {
        const path = req.baseUrl;
        const method = req.method;
        next(new Error(`${method.toUpperCase()} is not supported on path: ${path}`));
        return;
    });
    app.use(errorHandler);
};