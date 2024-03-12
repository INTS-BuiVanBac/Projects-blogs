import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret:'123456',
      signOptions:{expiresIn:'1h'}
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  
})
export class AuthModule {}
