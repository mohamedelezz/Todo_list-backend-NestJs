import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserInterface } from './interfaces/register.interface';
import { RejesterDto } from './dto/register.dto';
import { ValidationPipe } from '@nestjs/common';
import{LoginDto} from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/register')
    register(@Body(ValidationPipe) user: RejesterDto): Observable<UserInterface> {
        return this.authService.registrationAccount(user);
    }

    @Post('/login')
    login(@Body() user: LoginDto): Observable<{ token: string }> {
        return this.authService.login(user).pipe(map((jwt: string) => ({ token: jwt })))
    }

}
