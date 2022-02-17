import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "../users/users.service"
import { AuthService } from "../users/auth.service"
import { User } from "../users/user.entity"
import { NotFoundException } from '@nestjs/common'



describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: "awefafw@aerwefw.com", password: "adffasdfsa" } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 41, email, password: "adffasdfsa" }] as Array<User>)
      },
      remove: (id: number) => {
        return Promise.resolve({ id, email: "awefafw@aerwefw.com", password: "adffasdfsa" } as User)
      },
      // update:()=>{}
    };
    fakeAuthService = {
      signUp: (email: string) => {
        return Promise.resolve({ id: 484, email, password: "adffasdfsa" } as User)
      },
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController,],
      providers: [{ provide: UsersService, useValue: fakeUsersService }, { provide: AuthService, useValue: fakeAuthService }]

    }).compile();
    fakeAuthService = module.get(AuthService)

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("find an array of users", async () => {
    const users = await controller.findAllUsers("dfaddfdf@sdfsd.com")
    expect(users).toBeDefined()
  })

  it("finds the first user that matches id", async () => {
    const user = await controller.findUser("aefaef@awefaf.com")
    expect(user).toBeDefined()
  })

  it("throws error everytime id is not found", async () => {
    fakeUsersService.findOne = () => null
    try {
      await controller.findAllUsers("1")
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException)
    }
  })

  it("creates a new user", async () => {
    const session = {}
    const user = await controller.createUser({ email: "asdfasdf@asdfsd.com", password: "awefawfe" }, session)
    expect(user).toBeDefined()
  })

  it("signin updates session object and returns user", async () => {
    const session = { userId: -10 }
    const user = await controller.signIn({ email: "asdfasdf@asdfsd.com", password: "awefawfe" }, session)
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
});
