import { 
    Body,
    Controller,
    Post,
    UseGuards,
    Patch,
    Param,
    Get,
    Query
 } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guards';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guards';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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


    @Get()
    getEstimate(@Query() query: GetEstimateDto){
        console.log('query is', query);
        return this.reportsService.createEstimate(query);
    }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        console.log(`id = ${id} and body.approved = ${body.approved}`);
        return this.reportsService.toggleApproval(id, body.approved);
    }

}
