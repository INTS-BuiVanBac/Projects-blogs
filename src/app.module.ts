import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { CheckTokenReq } from './auth/middleware/check.token.req';
import { configs } from './configs/app.config';
import { PostModule } from './post/post.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: configs.db.type as any,
            host: configs.db.host,
            port: parseInt(configs.db.port),
            username: configs.db.username,
            password: configs.db.password,
            database: configs.db.database,
            entities: [__dirname, './**/*.entity{.ts, .js}'],
            synchronize: true,
            dropSchema: false,
        }),
        UserModule,
        AuthModule,
        PostModule
    ],
    
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckTokenReq)
            .exclude(
                { path: '/auth/login', method: RequestMethod.POST },
                { path: '/auth/refresh-token', method: RequestMethod.POST },
                { path: '/user', method: RequestMethod.POST },
                { path: '/auth/register', method: RequestMethod.POST },
            )
            .forRoutes('*')
    }
}
