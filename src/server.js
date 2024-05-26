import express from 'express';
import pino from "pino-http";
import cors from 'cors';

const PORT = 3000;

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

    app.use('*', (req, res, next) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).send(error.message);
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
