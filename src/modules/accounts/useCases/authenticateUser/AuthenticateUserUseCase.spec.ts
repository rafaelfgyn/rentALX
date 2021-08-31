import "reflect-metadata"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory'
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { AppError } from '../../../../shared/errors/AppError'

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {

  beforeEach(() => {

    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
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

    console.log(result)

    expect(result).toHaveProperty('token');
  })

  it('shound not be able to authenticate non existent user', () => {

    expect(async () => {
      await authenticateUserUseCase.execute({ email: 'false@email.com', password: '1234' })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate user with wrong password', () => {

    expect(async () => {
      await authenticateUserUseCase.execute({ email: 'user@test.com', password: '1235' })
    }).rejects.toBeInstanceOf(AppError)
  })
})