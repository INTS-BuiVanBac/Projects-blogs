import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { BaseEntity } from '../../common/entity/base.entity';
import { Category } from '../../category/entity/category.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    thumbnail: string;

    @Column()
    status: number;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;

    @ManyToOne(()=> Category,(category)=>category.posts)
    category: Category;
}
