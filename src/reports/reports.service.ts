import { Injectable, NotFoundException } from '@nestjs/common';
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

    async toggleApproval(id: string, approved: boolean){
        const intId = parseInt(id);
        //const report = this.repo.findOneBy({intId});

        const report= await this.repo.findOne(
            {
                where : {
                    id: intId,
                },
            }
        )

        if (!report){
            throw new NotFoundException(`Report with id = ${intId} was not found.` );
        }
        console.log(`Found this report with id=${intId} : `, report)

        report.approved = approved;
        return this.repo.save(report);

    }
}
