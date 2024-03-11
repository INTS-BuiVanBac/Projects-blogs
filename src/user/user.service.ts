import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
     findOne(arg0: number): Promise<UserEntity> {
          throw new Error('Method not implemented.');
     }
     constructor(@InjectRepository(UserEntity) private userReponsitory:Repository<UserEntity>){}
     async findAll():Promise<UserEntity[]>{
          return await this.userReponsitory.find({
               select:['id','first_name','last_name','full_name','age','address','email','refresh_token','update_at','create_at','password','status','roles']
          })
     }
}
