import { UserEntity } from "src/auth/models/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('todo')
export class TodoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: 'created', enum: ['created', 'in progress', 'completed'] })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate: Date; 


    @Column({ type: 'varchar', nullable: true })
    image: string;

    @Column({ type: 'varchar', nullable: true })
    imageId: string;

    @ManyToOne(() => UserEntity, user => user.todos)
    user: UserEntity | number;

    @Column()
    userId: number;


}