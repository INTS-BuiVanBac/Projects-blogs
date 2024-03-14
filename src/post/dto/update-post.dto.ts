import { Category } from "../../category/entity/category.entity";

export class UpdatePostDto {
     title: string;
     description: string;
     thumbnail: string;
     status: number;
     category:Category;
}