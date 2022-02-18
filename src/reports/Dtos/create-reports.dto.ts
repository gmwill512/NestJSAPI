import { IsNumber, IsString, Min, Max, IsLongitude, IsLatitude } from "class-validator"

export class CreateReportDto {
    @IsString()
    make: string

    @IsString()
    model: string

    @IsNumber()
    @Max(2050)
    @Min(1930)
    year: number

    @IsNumber()
    @IsLongitude()
    lng: number

    @IsNumber()
    @IsLatitude()
    lat: number

    @IsNumber()
    @Max(1000000)
    @Min(0)
    price: number

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number
}