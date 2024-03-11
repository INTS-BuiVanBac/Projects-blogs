import { Body, Controller, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

     constructor(private authservice: AuthService){}

     @Post('register')
     register(@Body() registerUserdto: RegisterUserDto):void{
          console.log("register api");
          console.log(registerUserdto);
          this.authservice.register(registerUserdto);
          
     }
     @Post('login')
     @UsePipes(ValidationPipe)
     login(@Body() loginUserDto: LoginUserDto):Promise<any>{
          console.log("helloo");
          console.log(loginUserDto);
          
          return this.authservice.login(loginUserDto);
     }

     @Post('refresh-token')
     refeshtoken(@Body() {refresh_token}):void{
          console.log("refreshtoken");
          this.authservice.refreshtoken(refresh_token);
     }
}
