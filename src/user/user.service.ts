import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    DeleteResult,
    Like,
    Repository,
    UpdateResult,
} from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';


interface UserResponse {
    data: UserEntity[];
    total: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    lastPage: number;
}
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userReponsitory: Repository<UserEntity>,
    ) {}

    async findAll(query: FilterUserDto): Promise<UserResponse> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const keyword = query.search || '';
        const [res, total] = await this.userReponsitory.findAndCount({
            where: [
                {
                    first_name: Like('%' + query.search + '%'),
                },
                { last_name: Like('%' + query.search + '%') },
                { full_name: Like('%' + query.search + '%') },
                { email: Like('%' + query.search + '%') },
            ],
            order: { create_at: 'DESC' },
            take: items_per_page,
            skip: skip,
            select: ['id', 'full_name', 'age', 'address', 'email', 'status'],
        });
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        console.log(res);

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async findone(id: string): Promise<UserEntity> {
        return await this.userReponsitory.findOneBy({ id });
    }

    async create(dto: createUserDto): Promise<UserEntity> {
        const User = new UserEntity();
        Object.assign(User, dto);
        return await this.userReponsitory.save(User);
    }

    async update(
        id: string,
        updatUserdto: UpdateUserDto,
    ): Promise<UpdateResult> {
        return await this.userReponsitory.update(id, updatUserdto);
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.userReponsitory.softDelete(id);
    }

    async updateAvatar(id: string, avatar: string): Promise<UpdateResult> {
        return await this.userReponsitory.update(id, { avatar });
    }
}
