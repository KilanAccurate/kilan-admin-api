import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer;

async function bootstrapServer() {
    const app = await NestFactory.create(AppModule);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return createServer(expressApp);
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    if (!cachedServer) {
        cachedServer = await bootstrapServer();
    }
    return proxy(cachedServer, event, context, 'PROMISE').promise;
};
