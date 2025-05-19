import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

let cachedServer: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.init();
    return app.getHttpAdapter().getInstance();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    cachedServer(req, res);
}
