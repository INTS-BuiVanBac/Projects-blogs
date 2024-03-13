import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestApplication>(AppModule, {
        logger: ['debug', 'error', 'fatal', 'verbose', 'warn'],
    });
    const config = new DocumentBuilder()
        .setTitle('Blog API')
        .setDescription('List API for simple Blog')
        .setVersion('1.0')
        .addTag('Auth')
        .addTag('Users')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
