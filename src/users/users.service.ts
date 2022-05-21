import { Injectable, NotFoundException } from '@nestjs/common';
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

    // The 'findOne' function finds a single entry using id only
    findOne(id: number){
        return this.repo.findOneBy({id});
    }

    // The 'find' funtion returns all users that have same email
    find( myEmail: string){
        return this.repo.find({
            where : {
                email: myEmail,
            },
        });
    }

        // The 'update' function updats some properties in user db
    async update(id: number, attrs: Partial<User>){
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException(`Did not find user id=${id}.` );
        }
        Object.assign(user,attrs);
        return this.repo.save(user);
    }
}
