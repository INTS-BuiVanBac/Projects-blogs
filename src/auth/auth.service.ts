import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { promises } from 'dns';
import { JwtService } from "@nestjs/jwt";

interface TokenPayload {
     userId: string;
     username: string;
     refreshToken: string;
     // Các trường khác bạn muốn lấy từ kết quả verifyAsync
 }

 interface AuthenticatedUser {
     id: string;
     email: string;
     // Các trường khác bạn muốn lấy từ dữ liệu người dùng
 }

@Injectable()
export class AuthService {
     constructor(
          @InjectRepository(UserEntity) private userRespository: Repository<UserEntity>,
          private jwtservice:JwtService
     ){}
     async register(registerUserdto:RegisterUserDto):Promise<UserEntity> {
          const hashpassword = await this.hashpassword(registerUserdto.password);
         return await this.userRespository.save({...registerUserdto, refresh_token:"str", password:hashpassword});
     }

     async login(loginuserDto: LoginUserDto):Promise<AuthenticatedUser>{
          const user = await this.userRespository.findOne(
               {
                    where:{email:loginuserDto.email}
               }
          )
          if(!user){
               throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED);
               
          }
          const checkPass = bcrypt.compareSync(loginuserDto.password, user.password);
          if(!checkPass){
               throw new HttpException("Password is not correct",HttpStatus.UNAUTHORIZED);
          }
          //generate access token and refresh token
          const payload = {id: user.id, email: user.email};
          return this.generateToken(payload);
     }
     
     async refreshtoken(refreshToken: string): Promise<TokenPayload> {
          try {
              // Sử dụng phương thức verifyAsync từ jwtService để xác thực refreshToken
              const verify: TokenPayload = await this.jwtservice.verifyAsync(refreshToken, {
                  secret: 'your_secret_key_here'
              });
  
              console.log(verify);
  
              return verify;
          } catch (error) {
              // Xử lý lỗi nếu xác thực thất bại và ném ra một HttpException
              throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST);
          }
      }

     private async generateToken(payload:{id:string, email: string}){
          const access_token = await this.jwtservice.signAsync(payload);
          const refresh_Token = await this.jwtservice.signAsync(payload,{
               secret:'123456',
               expiresIn:'1d'
          })
          await this.userRespository.update(
               {email:payload.email},
               {refresh_token: refresh_Token}
          )
          return {id: payload.id, email: payload.email,access_token, refresh_Token};
     }


     private async hashpassword(password: string): Promise<string>{
          const saltroud = 10;
          const salt = await bcrypt.genSalt(saltroud);
          const hash = await bcrypt.hash(password, salt);
          return hash;
     }
}
