import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { createUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '../helpers/config';
import { extname } from 'path';
interface UserResponse {
    data: UserEntity[];
    total: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
    lastPage: number;
}
@ApiBearerAuth()
@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiQuery({ name: 'paga' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    @Get()
    findAll(@Query() query: FilterUserDto): Promise<UserResponse> {
        console.log('bac');
        return this.userService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<UserEntity> {
        return this.userService.findone(id);
    }

    @Post()
    create(@Body() createUserdto: createUserDto): Promise<UserEntity> {
        return this.userService.create(createUserdto);
    }

    @Put(':id')
    Update(@Param('id') id: string, @Body() updatUserdto: UpdateUserDto) {
        return this.userService.update(id, updatUserdto);
    }
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }

    @Post('upload-avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: storageConfig('avatar'),
            fileFilter: (req, file, cb) => {
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `Wrong extention file. Accepted file ext are:${allowedExtArr.toString()}`;
                    cb(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.fileValidationError =
                            'file size is too large. acceptd file size is less than 5MB';
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }
            },
        }),
    )
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('file is required');
        }
        return this.userService.updateAvatar(
            req.user_data.id,
            file.destination + '/' + file.fieldname,
        );
    }
}
