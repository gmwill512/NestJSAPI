import { User } from '../users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    model: string;

    @Column()
    make: string;

    @Column()
    year: number;

    @Column()
    lng: number

    @Column()
    lat: number

    @Column()
    mileage: number

    @Column({ default: false })
    approved: boolean

    @ManyToOne(() => User, (user) => user.reports)
    user: User

}