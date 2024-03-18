import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req,
    UploadedFile,
    UseInterceptors,
    NestMiddleware,
    UsePipes,
    ValidationPipe,
    Get,
    Query,
    Param,
    Put,
    HttpException,
    Delete,
} from '@nestjs/common';
import { createPostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../configs/helpers/config';
import { extname } from 'path';
import { PostService } from './post.service';
import { PostEntity } from './entity/post.entity';
import { query } from 'express';
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
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('post'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                const filenamee =
                    file.originalname.split('.')[0] + '-' + Date.now() + ext;
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                    cb(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.fileValidationError =
                            'File size is too large. Accepted file size is less than 5 MB';
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }
            },
        }),
    )
    create(
        @Req() req: any,
        @Body() createPostDto: createPostDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log(req['user_data']);
        console.log(createPostDto);
        console.log(file);
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('File is required');
        }

        return this.postService.create(req['user_data'].id, {
            ...createPostDto,
            thumbnail: file.destination + '/' + file.filename,
        });
    }

    @Get()
    findAll(@Query() query: FilterDto): Promise<UserResponse> {
        return this.postService.findAll(query);
    }

    @Get(':id')
    findDetail(@Param('id') id: string): Promise<PostEntity> {
        return this.postService.findDetail(id);
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('post'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                const filenamee =
                    file.originalname.split('.')[0] + '-' + Date.now() + ext;
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
                    cb(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.fileValidationError =
                            'File size is too large. Accepted file size is less than 5 MB';
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }
            },
        }),
    )
    Update(
        @Param('id') id: string,
        @Req() req: Request,
        @Body() updatpostdto: UpdatePostDto,
        @UploadedFile() file: Express.Multer.File,
    ) {   
          // if (req.fileValidationError) {
          //      throw new BadRequestException(req.fileValidationError)
          // }
          if(file){
               updatpostdto.thumbnail = file.destination + '/' + file.filename;
          }
          return this.postService.Update(id, updatpostdto);
    }


    @Delete(':id')
    Delete(@Param('id')id:string){
     return this.postService.delete(id);
    }
}
