import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('API_PORT') || 3001;

    // CORS
    const allowedOrigins = [
        'http://localhost:3000',
        'https://florir.online',
        'https://www.florir.online',
        process.env.FRONTEND_URL,
    ].filter((url): url is string => Boolean(url));

    app.enableCors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    console.log('Allowed Origins:', allowedOrigins);

    // Global prefix
    app.setGlobalPrefix('api');

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}/api`);
}

bootstrap();
