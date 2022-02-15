import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {

    }

    async signUp(email: string, password: string) {
        //See if email is in use
        const user = await this.userService.find(email)
        if (user.length) {
            throw new BadRequestException("Email in use.")
        }
        //Hash the users password
        // Generate Salt
        const salt = randomBytes(8).toString('hex')
        //Hash the salt and password together.
        const hash = (await scrypt(password, salt, 32)) as Buffer
        //Join the hash and salt together
        const result = salt + "." + hash.toString('hex')
        //Create new user and save it
        const newUser = await this.userService.create(email, result)

        //Return the user
        return newUser
    }

    async signIn(email: string, password: string) {
        const [user] = await this.userService.find(email)
        if (!user) {
            throw new NotFoundException("User not found")
        } else {
            const [salt, storedHash] = user.password.split(".")
            const hash = await (scrypt(password, salt, 32)) as Buffer

            if (storedHash !== hash.toString('hex')) {
                throw new BadRequestException("Bad Password")
            }
            return user
        }
    }
}