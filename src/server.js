import express from 'express';
import pino from "pino-http";
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import contactsRouter from './routers/contacts.js';
// import { getAllContacts, getContactById } from './services/contacts.js';


const PORT = Number(env(ENV_VARS.PORT, 3000));

export const setupServer = () => {
    const app = express();

    app.use(pino({
        transport: {
            target: 'pino-pretty',
        },
    }));

    app.use(cors());

    app.use(contactsRouter);
    
    app.use('*', notFoundMiddleware);

    app.use(errorHandlerMiddleware);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
