import { 
    Body,
    Controller,
    Post,
    UseGuards,
    Patch,
    Param
 } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';

@Controller('/reports')
export class ReportsController {

    constructor(private reportsService: ReportsService){}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto,
                 @CurrentUser() currentUser: User 
                ){
        return this.reportsService.create(body, currentUser);
    }


    @Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        console.log(`id = ${id} and body.approved = ${body.approved}`);
        return this.reportsService.toggleApproval(id, body.approved);
    }

}
