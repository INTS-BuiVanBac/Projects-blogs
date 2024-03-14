import { Injectable } from '@nestjs/common';
import { createPostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
    async create(params: { dto: createPostDto; file: Express.Multer.File }) {
        const check = ['.png', '.jpg'];
        const a = check.filter((duoi) =>
            params.file.originalname.includes(duoi),
        );
        if (!a.length) {
            console.log('No file');
        }
        if (params.file.size > 1024 * 1024 * 5) {
            console.log('file large than 5MB!');
        }
    }
}
