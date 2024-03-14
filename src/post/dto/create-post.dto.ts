import { IsNotEmpty } from "class-validator";
import { UserEntity } from "../../user/entity/user.entity";
import { Category } from "../../category/entity/category.entity";

export class createPostDto {
     @IsNotEmpty()
     title: string;

     @IsNotEmpty()
     description: string;

     thumbnail: string;

     status: number;

     user: UserEntity;

     @IsNotEmpty()
     category:Category;
     
}