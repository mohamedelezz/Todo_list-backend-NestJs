import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/creatTodo.dto';
import { UpdateTodoDto } from './dto/updateTdo.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/models/user.entity';
import { UserDecorator } from 'src/auth/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('todos')
export class TodoController {
    constructor(private todoService: TodoService) { }
    // get all todos
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll(@UserDecorator() user: UserEntity): Promise<any> {
        return this.todoService.findAll(user);
    }
    // get todo by id
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<any> {
        return this.todoService.findOne(id);
    }

    // create todo
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body(ValidationPipe) todo: UpdateTodoDto, @UploadedFile() file: Express.Multer.File, @UserDecorator() user: UserEntity): Promise<any> {
        // console.log(file);
        return this.todoService.create(todo, file, user);
    }

    // update todo
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Body(ValidationPipe) todo: UpdateTodoDto, @UploadedFile() file: Express.Multer.File, @Param('id') id: number, @UserDecorator() user: UserEntity): Promise<any> {
        return this.todoService.update(todo, id, user, file);
    }

    // delete todo
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async delete(@Body() imageId: any, @Param('id') id: number, @UserDecorator() user: UserEntity): Promise<any> {
        return this.todoService.delete(id, user, imageId);
    }




}
