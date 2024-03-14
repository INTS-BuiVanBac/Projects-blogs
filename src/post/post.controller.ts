import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    NestMiddleware
} from '@nestjs/common';
import { createPostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../helpers/config';
import { extname } from 'path';
import { PostService } from './post.service';
@Controller('post')
export class PostController {
    constructor(private readonly PostService: PostService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('post'),
        }))
    async create(
        @Body() createPostdto: createPostDto,
        @UploadedFile() file: Express.Multer.File
    ): Promise<void> {
        return this.PostService.create({ dto: createPostdto, file: file });
    }
}




