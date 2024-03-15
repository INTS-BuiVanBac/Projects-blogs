import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { createPostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from './entity/post.entity';
import { FilterDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

interface UserResponse {
    data: PostEntity[];
    total: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    lastPage: number;
}
@Injectable()
export class PostService {
   
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(PostEntity)
        private postRepository: Repository<PostEntity>,
    ) {}
    async create(
        userId: string,
        createUserdto: createPostDto,
    ): Promise<PostEntity> {
        const user = await this.userRepository.findOneBy({ id: userId });
        try {
            const res = await this.postRepository.save({
                ...createUserdto,
                user,
            });
            return await this.postRepository.findOneBy({ id: res.id });
        } catch (error) {
            throw new HttpException(
                'can not creat post',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findAll(query: FilterDto): Promise<UserResponse> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const category = query.category || null;
        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.postRepository.findAndCount({
            where: [
                { title: Like('%' + search + '%'),
                category:{
                    id:category
                }
             },
             {description:Like('%' + search + '%'),
                category:{
                    id:category
                }
             }
            ],
            order:{create_at:'DESC'},
            take: items_per_page,
            skip:skip,
            relations:{
                user:true,
                category:true,
            },
            select:{
                category:{
                    id:true,
                    name:true,
                },
                user:{
                    id:true,
                    first_name:true,
                    last_name: true,
                    full_name:true,
                    email:true,
                    avatar:true,
                }
            }
        });
        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;
        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage,
        };
    }

    async findDetail(id:string):Promise<PostEntity>{
        return await this.postRepository.findOne({
            where:{id },
            relations:['user', 'category'],
            select:{
                category:{
                    id:true,
                    name:true
                },
                user:{
                    id:true,
                    first_name:true,
                    last_name: true,
                    full_name:true,
                    email:true,
                    avatar:true,
                }
            }
        })
    }

    async Update(
        id: string,
        updatUserdto: UpdatePostDto,
    ): Promise<UpdateResult> {
        return await this.postRepository.update(id, updatUserdto);
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.postRepository.softDelete(id);
    }
}
