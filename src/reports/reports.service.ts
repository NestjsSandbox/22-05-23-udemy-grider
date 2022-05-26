import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repo: Repository<Report> ){}


    createEstimate({make, model, lng, lat, year, milage}: GetEstimateDto){
        return this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        //.select('*')
        //protection from sql injection exploit using the ':make'. the object on the left of the ',' comma will be assigned to the ':make' variable.
        .where('make = :make', { make })
        .andWhere('model = :model',{model})
        .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
        .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
        .andWhere('year - :year BETWEEN -3 AND 3', {year})
        .andWhere('approved IS TRUE')
        //The following reads as: order by the abs value of the db cell milage from the input milage orderder by descent.
        //The input milage is also sql-injection-exploit protected by the ':milage' variable whose value is being assigned in the following 'setParameters command
        .orderBy('ABS(milage - :milage)','DESC')
        //The orderBy command doesnt support the same syntax to assign a value to the ':something' variable so we need to use the setParameters in the following line.
        .setParameters({milage})
        .limit(3)
        .getRawOne(); //Because we get one value from the select('AVG') at start of this query.
        //.getRawMany(); 
        
    }

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
