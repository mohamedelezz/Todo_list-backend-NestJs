import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TodoEntity } from './models/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import {JobService} from './cronJobTodo/dueDateJob.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([TodoEntity]),

    forwardRef(() => AuthModule),
  ],
  controllers: [TodoController],
  providers: [TodoService,JobService]
})
export class TodoModule {}
