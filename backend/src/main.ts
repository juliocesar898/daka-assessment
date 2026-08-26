import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  try {
    const orm = app.get(MikroORM);
    await orm.getSchemaGenerator().updateSchema();
    logger.log('Database synchronized successfully.');
  } catch (error) {
    logger.warn(`Could not auto-synchronize schema: ${(error as Error).message}`);
  }

  const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3001';

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === allowedOrigin ||
        origin.startsWith(allowedOrigin) ||
        origin.includes('192.241.148.227')
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Daka Technical Assessment')
    .setDescription('REST API and WebSocket for Full-Stack technical assessment')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Server running on port: ${port}`);
}

bootstrap();
