import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import { applyHandlers } from './handlers';
import config from './config';

const APP_PORT = config.port;

// app initialization
const app = express();

// app basic middlewares
app.use(cors({
    origin: ['https://india-covid19-app.firebaseapp.com/', 'https://india-covid19-app.web.app/']
}));
app.use(helmet());
app.use(json());

// health check
app.get('/health', (req, res) => {
    return res.status(200).send({
        status: 'OK',
    })
});

applyHandlers(app);

// app listener
app.listen(APP_PORT, () => {
    console.log(`Server started on port: ${APP_PORT}`);
});