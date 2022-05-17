import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { PasswordModule } from './password/password.module';
import { MailModule } from './mail/mail.module';
import { TodoModule } from './todo/todo.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  ScheduleModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: true,
  }),
    AuthModule,
    PasswordModule,
    MailModule,
    TodoModule,

  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
