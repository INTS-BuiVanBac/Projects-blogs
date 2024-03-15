import { Category } from "../../category/entity/category.entity";

export class FilterDto {
     page: string;
     items_per_page: string;
     search: string;
     category: string;
}