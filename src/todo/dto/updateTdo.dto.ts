import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

// validation to update todo
export class UpdateTodoDto {

    @IsOptional()  
    @MaxLength(20, { message: 'Title must be less than 20 characters' })
    title: string;

    @IsNotEmpty()
    @IsOptional()  
    description: string;

    @IsNotEmpty()
    @IsOptional() 
    @IsEnum(['created', 'in progress', 'completed'], { message: 'Status must be created, in progress or completed' }) 
    status: string;

    @IsNotEmpty()
    @IsOptional()
    user: number;

    @IsOptional()
    dueDate: Date;

    @IsOptional()
    image: string;

    @IsOptional()
    imageId: string;

    @IsOptional()
    file: Express.Multer.File;
    
}