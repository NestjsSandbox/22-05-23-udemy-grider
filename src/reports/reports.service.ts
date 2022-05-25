import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repo: Repository<Report> ){}

    create(reportDto: CreateReportDto, currentUser: User){
        const report = this.repo.create(reportDto);
        report.user = currentUser;
        return this.repo.save(report);
    }
}
