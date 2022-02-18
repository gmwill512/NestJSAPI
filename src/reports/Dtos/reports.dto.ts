import { Expose, Transform } from "class-transformer";
import { User } from '../../users/user.entity';


export class ReportDto {
    @Expose()
    id: number
    @Expose()
    price: number
    @Expose()
    model: string
    @Expose()
    make: string
    @Expose()
    lat: number
    @Expose()
    lng: number
    @Expose()
    year: number
    @Expose()
    mileage: number
    @Expose()
    approved: boolean

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number
}