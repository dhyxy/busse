import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type { AddressInfo } from 'net';
import path from 'path';

import api from './api';
import { db } from './api/db';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.disable('etag');

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
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
