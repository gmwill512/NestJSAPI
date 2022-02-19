import { Body, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Post, Patch, } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guards';
import { CreateReportDto } from './Dtos/create-reports.dto';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '..//interceptors/serialize.interceptor';
import { ReportDto } from './Dtos/reports.dto';
import { ApprovedReportDto } from './Dtos/approved-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './Dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Post()
    @Serialize(ReportDto)
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {

        return this.reportsService.create(body, user)
    }

    @Patch("/:id")
    @UseGuards(AdminGuard)
    approvedApproval(@Param('id') id: string, @Body() body: ApprovedReportDto) {
        return this.reportsService.changeApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query)
    }

}
