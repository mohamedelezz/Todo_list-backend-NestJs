import * as moment from 'moment';
import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '../models/todo.entity';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class JobService {
    constructor(@InjectRepository(TodoEntity) private readonly todoRepository: Repository<TodoEntity>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        private mailerService: MailerService,
    ) { }

    // Cron Job to send reminder email to user when todo is due after 24 hours
    // @Cron('* * * * * *')
    async handleCron() {

        const query = await this.todoRepository.createQueryBuilder('todo');
        console.log(moment().add(1, 'days').toISOString());
        query.where(`todo.dueDate  BETWEEN '${moment().add(1, 'days').toISOString()}' AND '${moment().add(25, 'hours').toISOString()}'`)
        const todos = await query.getMany();

        if (todos) {
            todos.forEach(todo => {
                this.authService.findUserById(todo.userId).then(async user => {
                    if (user) {
                        await this.mailerService.sendMail({
                            from: 'Zoz <ezz@gmail.com>',
                            to: user.email,
                            subject: 'Reminder for your todo',
                            text: `Your todo ${todo.title} is due at ${moment(todo.dueDate).fromNow()}`,
                        })
                    } else {
                        console.log('something went wrong while sending email to user')
                    }
                })
            })
        }
    }
}