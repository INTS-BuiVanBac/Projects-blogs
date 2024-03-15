import {
    HttpException,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { configs } from '../../configs/app.config';

@Injectable()
export class CheckTokenReq implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    use(req: Request, _: Response, next: NextFunction) {
        const token = req.header('token');

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = this.jwtService.verify(token, {
                publicKey: configs.key.public_key,
            });

            req['user_data'] = payload;
        } catch {
            throw new HttpException(
                {
                    status: 419,
                    message: 'Token expired',
                },
                419,
            );
        }

        return next();
    }
}
