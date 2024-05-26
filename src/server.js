import express from 'express';
import pino from "pino-http";
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';


const PORT = Number(env(ENV_VARS.PORT, 3005));

export const setupServer = () => {
    const app = express();

    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }));

    app.use(cors());

    app.use((req, res, next) => {
        console.log(`Time: ${new Date().toLocaleString()}`);
        next();
    });

    app.get('/', (req, res) => {
    // res.send('Hello world');
        res.json({
            message: 'Hello world!'
        });
    });

    app.use('*', notFoundMiddleware);

    app.use(errorHandlerMiddleware);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
