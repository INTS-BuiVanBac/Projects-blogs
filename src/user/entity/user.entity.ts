import {
    BeforeInsert,
    Column,
    Entity,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../common/enums/roles.enum';
import { BaseEntity } from '../../common/entity/base.entity';
import { PostEntity } from '../../post/entity/post.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({})
    full_name: string;

    @Column()
    age: number;

    @Column()
    address: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: null })
    refresh_token: string;

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({ default: 1 })
    status: number;

    @Column({
        type: 'enum',
        enum: Roles,
    })
    roles: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];
}
