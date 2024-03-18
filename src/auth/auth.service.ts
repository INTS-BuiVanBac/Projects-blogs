import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { configs } from '../configs/app.config';
import { Result } from '../shared/result';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRespository: Repository<UserEntity>,
        private jwtservice: JwtService,
        private configservice: ConfigService,
    ) {}
    async register(registerUserdto: RegisterUserDto): Promise<UserEntity> {
        const hashpassword = await this.hashpassword(registerUserdto.password);
        return await this.userRespository.save({
            ...registerUserdto,
            password: hashpassword,
        });
    }

    async login(loginuserDto: LoginUserDto): Promise<Result> {
        const user = await this.userRespository.findOne({
            where: { email: loginuserDto.email },
        });
        if (!user) {
            throw new HttpException(
                'Email is not exist',
                HttpStatus.UNAUTHORIZED,
            );
        }
        const checkPass = bcrypt.compareSync(
            loginuserDto.password,
            user.password,
        );
        if (!checkPass) {
            throw new HttpException(
                'Password is not correct',
                HttpStatus.UNAUTHORIZED,
            );
        }
        //generate access token and refresh token
        const payload = { id: user.id, email: user.email };
        return this.generateToken(payload);
    }

    async refreshtoken(refresh_token: string): Promise<Result> {
        try {
            // Sử dụng phương thức verifyAsync từ jwtService để xác thực refreshToken
            const verify = await this.jwtservice.verifyAsync(refresh_token, {
                secret: this.configservice.get<string>('SECRET'),
            });
            if (!verify) {
                throw new HttpException(
                    'Refresh token has expired',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            console.log(verify);
            const checkExitsToken = await this.userRespository.findOneBy({email: verify.email, refresh_token});
            if(checkExitsToken){
                return this.generateToken({id:verify.id, email: verify.email});
            }else{
                throw new HttpException('Refresh token is not valid',HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw error;
            
        }
    }

    private async generateToken(payload: { id: string; email: string }) {
        const access_token = this.jwtservice.sign(
            { ...payload, type: 'ACCESS_TOKEN' },
            { privateKey: configs.key.private_key },
        );

        const refresh_token = this.jwtservice.sign(
            { ...payload, type: 'REFRESH_TOKEN' },
            { privateKey: configs.key.private_key },
        );

        await this.userRespository.update(
            { email: payload.email },
            { refresh_token: refresh_token },
        );
        return { status: 200, access_token, refresh_token };
    }

    private async hashpassword(password: string): Promise<string> {
        const saltroud = 10;
        const salt = await bcrypt.genSalt(saltroud);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
}
