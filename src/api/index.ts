import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AllExceptionsFilter } from '../helper/http-exception.filter';

let cachedServer: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
    });
    await app.init();
    return app.getHttpAdapter().getInstance();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    cachedServer(req, res);
}
