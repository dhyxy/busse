import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import type { Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type { AddressInfo } from 'net';

import api from './api';
import { db } from './api/db';

const PORT = 8080;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.disable('etag');

app.get('/', (_req: Request, res: Response) => {
    res.send('server is up 🤩');
});

app.use('/api', api);

async function main() {
    const server = app.listen(PORT, () => {
        const address = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.log(`server started at http://localhost:${address.port}`);
    });
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
