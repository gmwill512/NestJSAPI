import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        //Create fake copy of userService
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email)
                return Promise.resolve(filteredUsers)
            },
            create: (email: string, password: string) => {
                const user = ({ id: Math.floor(Math.random() * 999999), email, password } as User)
                users.push(user)
                return Promise.resolve(user)
            },

        }
        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }],
        }).compile()

        service = module.get(AuthService)
    })

    it('can create an instance of AuthService', async () => {
        expect(service).toBeDefined()
    })

    it("creates a new user with salted and hashed password", async () => {
        const user = await service.signUp("sdfsdf@asdf.com", "dfasd")
        expect(user.password).not.toEqual("dfasd")
        const [salt, hash] = user.password.split(".")
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('Thorws an error if user signs up with email is in use', async () => {
        expect.assertions(1);
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'mike@aol.com', password: '302kkedww' } as User])

        try {
            await service.signUp('mike@aol.com', '302kkedww');
        } catch (e) {

            expect(e).toBeInstanceOf(BadRequestException);
        }

    });


    it("throws an error if email is used", async () => {
        try {
            await service.signIn('dfasdf@asdfasdl.com', '302kkedww')
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException)
        }
    })

    it("throws if invalid password is provided", async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'miawefawke@aawefawel.com', password: '302kkedww' } as User])
        try {
            await service.signIn('miawefawke@aawefawel.com', 'awefawefawefafaewffawe')
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException)
        }
    })
    //     const foundUser = await 
    //     const [salt, hash] = user.password.split(".")
    //     const newHash = await (scrypt("dsfasdf", salt, 32)) as Buffer
    //     expect(newHash).toEqual(hash)s

    it("returns a user if correct password is provided", async () => {
        await service.signUp('miawefawke@aawefawel.com', '302kkedww')
        const user = await service.signIn('miawefawke@aawefawel.com', '302kkedww')
        expect(user).toBeDefined()
    })

})