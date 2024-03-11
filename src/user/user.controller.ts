import { Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
     constructor(private userService:UserService){}
     @Get()
     findAll():Promise<UserEntity[]>{
          return this.userService.findAll();
     }
     @UseGuards(AuthGuard)
     @Get(':id')
     findOne(@Param('id') id: string): Promise<UserEntity> {
         return this.userService.findOne(Number(id));
     }
 
}
