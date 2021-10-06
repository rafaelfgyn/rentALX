import "reflect-metadata"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory'
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { AppError } from '../../../../shared/errors/AppError'
import { UsersTokensRepositoryInMemory } from "../../repositories/in-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/Implementations/DayjsDateProvider';

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;
let dateProvider: DayjsDateProvider

describe('Authenticate User', () => {

  beforeEach(() => {

    usersRepositoryInMemory = new UsersRepositoryInMemory();
    userTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory, userTokensRepositoryInMemory, dateProvider);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it('should be able to authenticate an user', async () => {

    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@test.com',
      password: '1234',
      name: 'User Test'
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({ email: user.email, password: user.password });

    expect(result).toHaveProperty('token');
  })

  it('shound not be able to authenticate non existent user', async () => {

    await expect(authenticateUserUseCase.execute({ email: 'false@email.com', password: '1234' })
    ).rejects.toEqual(new AppError("Email or password incorrect!"))
  })

  it('should not be able to authenticate user with wrong password', async () => {

    await expect(authenticateUserUseCase.execute({ email: 'user@test.com', password: '1235' })
    ).rejects.toEqual(new AppError("Email or password incorrect!"))
  })
})