import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isNotEmpty } from 'class-validator';

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
