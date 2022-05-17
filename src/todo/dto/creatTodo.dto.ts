import { IsNotEmpty, IsOptional, MaxLength, IsEnum } from "class-validator";

// validation to create todo 
export class CreateTodoDto {

    @IsNotEmpty()
    @MaxLength(30, { message: 'Title must be less than 30 characters' })
    title: string;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsEnum(['created', 'in progress', 'completed'], { message: 'Status must be created or in progress or completed' })
    status?: string;

    @IsOptional()
    dueDate?: Date;

    @IsOptional()
    image?: string;

    @IsOptional()
    imageId?: string;


}