
import { Column, Entity, OneToMany } from 'typeorm';
import { PostEntity } from '../../post/entity/post.entity';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
    @Column()
    description: string;

    @Column()
    name:string;

    @Column()
    status: number;

    @OneToMany(()=>PostEntity, (posts) =>posts.category)
    posts:PostEntity[];
}
