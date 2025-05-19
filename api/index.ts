import { NestFactory } from '@nestjs/core';
import { createServer, Server } from 'http';
import { Handler, Context, Callback } from 'aws-lambda';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from 'src/app.module';

const expressApp = express();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await app.init();
}

bootstrap();

export const handler: Handler = (event: any, context: Context, callback: Callback) => {
    if (!expressApp) {
        callback(new Error('Express app not initialized'));
        return;
    }
    expressApp(event, context, callback);
};
