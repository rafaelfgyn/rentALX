import "reflect-metadata"
import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { sign } from "jsonwebtoken";
import { AppError } from "../../../../shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string
  };
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest) {

    const user = await this.usersRepository.findByEmail(email);

    if(!user) { throw new AppError("Email or password incorrect!") };

    const passwordMatch = await compare(password, user.password);

    if(!passwordMatch) { throw new AppError("Email or password incorrect!") };

    const token = sign({}, "eae4e79d9fd3800c327df5e1bd65cd62", {
      subject: user.id,
      expiresIn: "1d"
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    }

    return tokenReturn;
  }
}

export { AuthenticateUserUseCase }