import { IsEmail, Length, IsNotEmpty } from "class-validator";

// Validation DTO for rrgister request
export class RejesterDto {
    @Length(1, 15)
    @IsNotEmpty({ message: 'First Name is required' })
    firstName: string;

    @Length(1, 15)
    @IsNotEmpty({ message: 'Last Name is required' })
    lastName: string;

    @IsEmail({}, { message: 'Please enter a valid email' })
    @IsNotEmpty()
    email: string;

    @Length(8, 30)
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Length(8, 30)
    @IsNotEmpty({ message: 'Confirm Password is required' })
    confirmPassword: string;

}