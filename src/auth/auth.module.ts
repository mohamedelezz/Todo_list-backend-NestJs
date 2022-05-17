import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './models/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { JwtGuard } from './guards/jwt.guard'
import { JwtStrategy } from './guards/jwt.strategy'

import { PasswordModule } from '../password/password.module'
import { MailModule } from '../mail/mail.module'


@Module({
  imports: [
    MailModule,
    PasswordModule,

    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '72h' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, JwtGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtGuard, JwtStrategy],
})
export class AuthModule { }
