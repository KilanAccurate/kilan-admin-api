// ../main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './helper/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: ['http://localhost:5173'], // Change to your Next.js frontend origin
    credentials: true, // If you're sending cookies or auth headers
  });
  await app.listen(process.env.PORT ?? 1243);
}
bootstrap();
