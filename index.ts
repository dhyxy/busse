import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import {AddressInfo} from 'net';

const PORT = 8080;

const app = express();
const prisma = new PrismaClient();

app.use(morgan('dev'));

app.get('/', (_req: Request, res: Response) => 
{
    res.send('server is up 🤩');
});

async function main() {
    const server = app.listen(PORT, () => {
        const address = server.address() as AddressInfo;
        // eslint-disable-next-line no-console
        console.log(`server started at http://localhost:${address.port}`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
