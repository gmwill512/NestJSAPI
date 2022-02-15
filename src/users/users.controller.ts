import { Body, Controller, Get, Post, Patch, Param, Query, Delete, NotFoundException, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-users.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }
    @Post('signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Get()
    findAllUsers(@Query("email") email: string) {
        return this.usersService.find(email)
    }

    @Get('/:id')
    async findUser(@Param("id") id: string) {
        const userId = parseInt(id)
        const user = await this.usersService.findOne(userId)

        if (!user) {
            throw new NotFoundException("No user found")
        } else {
            return user
        }
    } S

    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        const userId = parseInt(id)
        return this.usersService.update(userId, body)
    }

    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        const userId = parseInt(id)
        return this.usersService.remove(userId)
    }



}