import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import { applyHandlers } from './handlers';

const APP_PORT = 4000;

// app initialization
const app = express();

// app basic middlewares
app.use(cors());
app.use(helmet());
app.use(json());

applyHandlers(app);

// app listener
app.listen(APP_PORT, () => {
    console.log(`Server started on port: ${APP_PORT}`);
});