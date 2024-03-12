import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { FilterUserDto } from './dto/filter-user.dto';
interface UserResponse {
     data: UserEntity[];
     total: number;
     currentPage: number;
     nextPage: number | null;
     prevPage: number | null;
     lastPage: number;
   }
@Controller('user')
export class UserController {
     constructor(private userService:UserService){}

     // @UseGuards(AuthGuard)
     @Get()
     findAll(@Query() query: FilterUserDto):Promise<UserResponse>{
          console.log(query);
          return this.userService.findAll(query);
     }

     // @UseGuards(AuthGuard)
     @Get(':id')
     findOne(@Param('id') id: string): Promise<UserEntity> {
         return this.userService.findone(id);
     }
     
     @Post()
     create(@Body() createUserdto: createUserDto):Promise<UserEntity>{
          return this.userService.create(createUserdto);
     }

     @Put(':id')
     Update(@Param('id') id:string,@Body() updatUserdto: UpdateUserDto){
          return this.userService.update(id, updatUserdto)
     }
     @Delete(':id')
     delete(@Param('id') id:string){
          return this.userService.delete(id);
     }
}
