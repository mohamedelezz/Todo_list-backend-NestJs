import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './models/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/creatTodo.dto';
import { UserEntity } from 'src/auth/models/user.entity';
import { UpdateTodoDto } from './dto/updateTdo.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';


@Injectable()
export class TodoService {
    constructor(@InjectRepository(TodoEntity) private readonly todoRepository: Repository<TodoEntity>,
        private readonly cloudinary: CloudinaryService
    ) { }

    // find all todos for a single user
    async findAll(user: UserEntity): Promise<TodoEntity[] | any> {
        const query = this.todoRepository.createQueryBuilder('todo');

        query.where('todo.userId = :userId', { userId: user.id });
        try {
            return await query.getMany();
        } catch (e) {
            throw new NotFoundException(e.message);
        }

    }
 
    async findOne(id: number): Promise<TodoEntity> {
        return await this.todoRepository.findOne(id);
    }
   // create new todo and upload image to cloudinary
    async create(CreateTodoDto: CreateTodoDto, file: Express.Multer.File, user: UserEntity): Promise<TodoEntity> {
        const todo = new TodoEntity();
        const { title, description, status, dueDate } = CreateTodoDto;
        // upload image to cloudinary
        if (file) {
            const uploadFileToCloudinary = await this.cloudinary.uploadImage(file).then(result => { return result }).catch(err => { console.log(err) });
            const { url, public_id }: any = uploadFileToCloudinary;
            todo.image = url
            todo.imageId = public_id;
        }
        todo.title = title;
        todo.description = description;
        todo.status = status
        todo.userId = user.id;
        todo.dueDate = dueDate;

        this.todoRepository.create(todo);
        return await this.todoRepository.save(todo);
    }

    // update todo and update image to cloudinary
    async update(todo: UpdateTodoDto, id: number, user: UserEntity, file: Express.Multer.File): Promise<any> {
        // update image to cloudinary by deleting old image and uploading new image
        if (file) {
            const updateImages = await this.cloudinary.updateImage(file, todo).then(result => { return result }).catch(err => { console.log(err) });
            const { url, public_id }: any = updateImages
            todo.imageId = public_id;
            todo.image = url; 
        }
        delete todo.file;
        return await this.todoRepository.update({ id, userId: user.id }, { ...todo });
    }

    // delete todo and delete image from cloudinary
    async delete(id: number, user: UserEntity, imageId): Promise<any> {

        const deleteImageFromCloudinary = await this.cloudinary.deleteImage(imageId).then(result => { return result }).catch(err => { console.log(err) });
        const result = await this.todoRepository.delete({ id, userId: user.id });

        if (result.affected === 0) { // affected === 0 means that no rows were found
            throw new NotFoundException('Todo not deleted');
        } else {
            return true;
        }
    }

}