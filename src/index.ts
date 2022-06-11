import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import { applyHandlers } from './handlers';
import config from './config';

const APP_PORT = config.port;

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