import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
     @PrimaryGeneratedColumn('uuid')
     id: string

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

    @Column()
    refresh_token: string;

    @Column({default: 1})
    status:number;

    @CreateDateColumn()
    create_at: Date;

    @CreateDateColumn()
    update_at: Date;

    @Column({
        type: 'enum',
        enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
    })
    roles: string;
}