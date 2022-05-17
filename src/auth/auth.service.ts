import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserInterface } from './interfaces/register.interface';
import { UserEntity } from './models/user.entity';
import { RejesterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginUserInterface } from './interfaces/login.interface';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,

    ) { }

    // hash password
    hashedPassword(password: any): Observable<string> {
        return from(bcrypt.hash(password, 10))
    }

    // update the user password
    updatee(id: number, body: any) {
        return this.userRepository.update(id, body);
    }

    // registration account function 
    registrationAccount(user: RejesterDto): Observable<UserInterface> {

        const { firstName, lastName, email, password, confirmPassword } = user;
        if (password !== confirmPassword) {
            throw new BadRequestException('your Passwords do not match');
        }
        return this.hashedPassword(password).pipe(
            switchMap((hashpassword: string) => {
                return from(this.userRepository.save({ firstName, lastName, email, password: hashpassword })).pipe(
                    map((user: LoginUserInterface) => {
                        delete user.password;
                        return user;
                    })
                )
            })
        )
    }

    // validate user login
    validateUser(email: string, password: string): Observable<UserInterface> {
        return from(this.findUserByEmail({ email })).pipe(
            switchMap((user: LoginUserInterface) =>
                from(bcrypt.compare(password, user.password)).pipe(
                    map((isValidPassword: boolean) => {
                        if (isValidPassword) {
                            delete user.password;
                            return user;
                        } else {
                            throw new NotFoundException('Invalid your email or password');
                        }
                    })
                )
            )
        )
    }
    // Login user and create token 
    login(user: LoginDto): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email, password).pipe(
            switchMap((user: UserInterface) => {
                if (user) {
                    // create JWT - credentials
                    return from(this.jwtService.signAsync({ user }))
                } else {
                    throw new NotFoundException('Invalid rour email or password');
                }
            })
        )

    }
    // function to get user by email for forgot password
    async findByEmail(body: object): Promise<any> {
        const user = await this.userRepository.findOne(body, { select: ['id', 'firstName', 'lastName', 'email', 'password', 'createdAt'] });
        if (!user) {
            throw new NotFoundException('Invalid your email !!!!');
        }
        return user;
    }
    // function to get user by email for login
    async findUserByEmail(body: object): Promise<any> {
        const user = await this.userRepository.findOne(body, { select: ['id', 'firstName', 'lastName', 'email', 'password', 'createdAt'] });
        if (!user) {
            throw new NotFoundException('Invalid your email or password');
        }
        return user
    }


    // find user by id
    async findUserById(body: any) {
        const user = await this.userRepository.findOne(body, { select: ['id', 'firstName', 'lastName', 'email', 'createdAt'] });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

}
