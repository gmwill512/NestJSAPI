import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './Dtos/create-reports.dto';
import { User } from '..//users/user.entity';
import { GetEstimateDto } from './Dtos/get-estimate.dto';



@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }
    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto)
        report.user = user
        return this.repo.save(report)

    }

    async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne(id)
        if (!report) {
            throw new NotFoundException("Report Not Found")
        }
        report.approved = approved
        return this.repo.save(report)
    }

    async createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select("AVG(price)", 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat = :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne()
    }
}
