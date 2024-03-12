import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { promises } from 'dns';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

interface TokenPayload {
  id: string;
  email: string;
  refreshtoken: string;
}

interface AuthenticatedUser {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRespository: Repository<UserEntity>,
    private jwtservice: JwtService,
    private configservice: ConfigService
  ) {}
  async register(registerUserdto: RegisterUserDto): Promise<UserEntity> {
    const hashpassword = await this.hashpassword(registerUserdto.password);
    return await this.userRespository.save({
      ...registerUserdto,
      refresh_token: 'str',
      password: hashpassword,
    });
  }

  async login(loginuserDto: LoginUserDto): Promise<AuthenticatedUser> {
    const user = await this.userRespository.findOne({
      where: { email: loginuserDto.email },
    });
    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED);
    }
    const checkPass = bcrypt.compareSync(loginuserDto.password, user.password);
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

  async refreshtoken(refresh_token: string): Promise<TokenPayload> {
    try {
      // Sử dụng phương thức verifyAsync từ jwtService để xác thực refreshToken
      const verify = await this.jwtservice.verifyAsync(refresh_token, {
        secret: this.configservice.get<string>('SECRET')

      });
      if (!verify) {
          throw new HttpException('Refresh token has expired', HttpStatus.UNAUTHORIZED);
        }
      console.log(verify);
      return { id: verify.id,
          email: verify.email,
          refreshtoken: refresh_token,};
    } catch (error) {
      // Xử lý lỗi nếu xác thực thất bại và ném ra một HttpException
     //  throw new HttpException('Refresh token is not valid',HttpStatus.BAD_REQUEST);
    }
  }

  private async generateToken(payload: { id: string; email: string }) {
    const access_token = await this.jwtservice.signAsync(payload);
    const refresh_token = await this.jwtservice.signAsync(payload, {
      secret: this.configservice.get<string>('SECRET'),
      expiresIn: this.configservice.get<string>('EXP_IN_REFRESH_TOKEN')
    });
    await this.userRespository.update(
      { email: payload.email },
      { refresh_token: refresh_token },
    );
    return { access_token, refresh_token };
  }

  private async hashpassword(password: string): Promise<string> {
    const saltroud = 10;
    const salt = await bcrypt.genSalt(saltroud);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
