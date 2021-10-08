import { DayjsDateProvider } from '@shared/container/providers/DateProvider/Implementations/DayjsDateProvider';
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let dateProvider: DayjsDateProvider
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let mailProvider: MailProviderInMemory

describe("Send Forgot Mail", () => {

  beforeEach(() => {

    usersRepositoryInMemory = new UsersRepositoryInMemory()
    dateProvider = new DayjsDateProvider()
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
    mailProvider = new MailProviderInMemory()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(usersRepositoryInMemory, usersTokensRepositoryInMemory, dateProvider, mailProvider)
  })

  it("should be able to send a forgot password mail to user", async () => {

    const sendMail = jest.spyOn(mailProvider, "sendMail")

    await usersRepositoryInMemory.create({ driver_license: "123456", email: "email@gmail.com", name: "NameTest", password: "1234" })

    await sendForgotPasswordMailUseCase.execute("email@gmail.com")

    expect(sendMail).toHaveBeenCalled()
  })

  it("should not be able to send an email if user does not exists", async () => {

    await expect(sendForgotPasswordMailUseCase.execute("wrongEmail@gmail.com"))
      .rejects.toEqual(new AppError("User does not exists!"))
  })

  it("should be able to create an users token", async () => {

    const generateTokenMail = jest.spyOn(usersTokensRepositoryInMemory, "create")

    usersRepositoryInMemory.create({ driver_license: "123457", email: "email2@gmail.com", name: "NameTestt", password: "1235" })

    await sendForgotPasswordMailUseCase.execute("email2@gmail.com")

    expect(generateTokenMail).toHaveBeenCalled()
  })
})