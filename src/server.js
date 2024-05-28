import express from 'express';
import pino from "pino-http";
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { notFoundMiddleware } from './middlewares/notFoundMiddleware.js';
import { getAllContacts, getContactById } from './services/contacts.js';


const PORT = Number(env(ENV_VARS.PORT, 3000));

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

    // app.get('/', (req, res) => {
    // res.send('Hello world');
    //     res.json({
    //         message: 'Hello world!'
    //     });
    // });

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const id = req.params.contactId;
        const contact = await getContactById(id);

        if (!contact) {
            return res.status(400).json({
            status: 400,
            message: `Contact with id ${id} not found!`,
            });
        };

        res.json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data: contact,
        });
    });

    app.use('*', notFoundMiddleware);

    app.use(errorHandlerMiddleware);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
