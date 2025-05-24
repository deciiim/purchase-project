import 'dotenv/config'; // Load environment variables from .env
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Explicitly enable CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200', // Angular runs here during dev
    credentials: true,               // Allow cookies if needed
  });

  // ✅ Enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000); // ✅ Runs on http://localhost:3000
  console.log(`🚀 Backend running at http://localhost:3000`);
}

bootstrap();
