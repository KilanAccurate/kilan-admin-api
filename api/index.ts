// api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from '../src/app.module'; // adjust if needed

const server = express();

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
};

let isBootstrapped = false;

export default async function handler(req, res) {
    if (!isBootstrapped) {
        await bootstrap();
        isBootstrapped = true;
    }
    return server(req, res);
}
