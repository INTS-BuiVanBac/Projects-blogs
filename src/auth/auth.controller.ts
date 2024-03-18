import {
    Body,
    Controller,
    Post,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Result } from '../shared/result';
import { UserEntity } from '../user/entity/user.entity';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService) {}

    @Post('register')
    register(@Body() registerUserdto: RegisterUserDto): Promise<UserEntity> {
        return this.authservice.register(registerUserdto);
    }

    
    @Post('login')
    @ApiResponse({ status: 201, description: 'Login successfully!' })
    @ApiResponse({ status: 401, description: 'Login Fail!' })
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto){
        return this.authservice.login(loginUserDto);
    }


    @Post('refresh-token')
    refeshtoken(@Body() { refresh_token }) {
        return this.authservice.refreshtoken(refresh_token);
    }
}
