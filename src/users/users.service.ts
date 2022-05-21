import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplaySubject } from 'rxjs';
import { ReportsService } from 'src/reports/reports.service';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>){}

    //The 'create' function creates a new user entry in the db
    create(email: string, password: string){
        const user = this.repo.create({email, password});
        return this.repo.save(user);
    }

}
