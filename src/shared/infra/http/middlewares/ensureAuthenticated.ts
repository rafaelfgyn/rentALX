import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositores/UsersRepository";
import { AppError } from '../../../errors/AppError'

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request:Request, response: Response, next: NextFunction) {

  const authHeader = request.headers.authorization;

  if (!authHeader) { throw new AppError("Token missing", 401) };

  const token = authHeader.split(" ")[1];

  try {

    const { sub: user_id } = verify(token, 'eae4e79d9fd3800c327df5e1bd65cd62') as IPayload;

    const usersRepository = new UsersRepository();

    const user = usersRepository.findById(user_id);

    request.user = { id: user_id }

    if (!user) { throw new AppError("User does not exists!", 401) };

    next();
  } catch {

    throw new AppError("Invalid token!", 401);
  }
}