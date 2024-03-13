import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    full_name: string;
    @ApiProperty()
    age: number;
    @ApiProperty()
    address: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    status: number;
    @ApiProperty()
    roles: string;
}
