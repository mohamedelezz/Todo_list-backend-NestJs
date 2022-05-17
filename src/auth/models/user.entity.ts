import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import uniqueValidator from "class-validator";
import { TodoEntity } from "src/todo/models/todo.entity";

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true }) 
    email: string;

    @Column() //{ select: false }
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => TodoEntity, todoEntity => todoEntity.user)
    todos: TodoEntity[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }

}