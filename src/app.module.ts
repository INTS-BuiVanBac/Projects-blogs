import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: "localhost",
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'nestjs-mvc',
      entities: [__dirname, './**/*.entity{.ts, .js}'],
      synchronize: true,
      dropSchema: false,
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
