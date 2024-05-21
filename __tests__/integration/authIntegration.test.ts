import { MongoMemoryServer } from "mongodb-memory-server";
import { dbT } from "../../src/db/mongo-.db";
import { authService } from "../../src/services/auth-service";
import { emailAdapter } from "../../src/adapter/emailAdapter";
import { managerTestUser } from "../utilitTest/managerTestUser";
import { app } from "../../src/app";
import request from "supertest";
import { SETTINGS } from "../../src/seting/seting";
import { repositoryUsers } from "../../src/repository/repostiryUsers";

describe("Auth-integration", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbT.run(mongoServer.getUri());
  });
  beforeEach(async () => {
    await dbT.drop();
  });
  afterAll(async () => {
    await dbT.drop();
    await dbT.stop();
  });

  describe("USER-REGISTRITION", () => {
    const registerUserUseCase = authService.creatUser.bind(authService);
    it("registration correct", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();

      const result = await registerUserUseCase(userDto);

      expect(result).toEqual({
        id: expect.any(String),
        login: userDto.login,
        createdAt: expect.any(String),
        email: userDto.email,
      });

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });
    it("should not register user twice", async () => {
      const userDto = managerTestUser.creatUserDto();
      await managerTestUser.registerUser(userDto);

      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/registration`)
        .send(userDto)
        .expect({
          errorsMessages: [
            {
              field: "login",
              message: "login already in use",
            },
            {
              field: "email",
              message: "E-mail already in use",
            },
          ],
        });
    });
    it("verification confirmation email", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();
      await registerUserUseCase(userDto);
      const findUser = await repositoryUsers.findBlogOrEmail(userDto.email);

      const coorectCode = await authService.confirmEmail(findUser!.emailConfirmation!.confirmationCode);
      expect(coorectCode).toBe(true);

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });
    it("successful message resending", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();
      await registerUserUseCase(userDto);
      await authService.resendingCode(userDto.email);

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(2);
    });
    it("failed to resend the message because the email has already been verified", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();
      await registerUserUseCase(userDto);
      const findUser = await repositoryUsers.findBlogOrEmail(userDto.email);
      const coorectCode = await authService.confirmEmail(findUser!.emailConfirmation!.confirmationCode);
      expect(coorectCode).toBe(true);

      const result = await authService.resendingCode(userDto.email);

      expect(result).toBe(null); //Вернет null, так как authService.resendingCode() в случае если код подтвержден возвращает null

      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1); // Вызовется 1 раз, так как в authService.resendingCode() в случае если окажется, что email уже подтвержден, он не будет вызывать sendEmail. Первый вызов это регистрация "await registerUserUseCas(userDto)"
    });
    it("message resend failed because the user does not exist", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const result = await authService.resendingCode("fdfdfdffd");

      expect(result).toBe(null); //Вернет null, так как authService.resendingCode() в случае если не найдет email или login, он возвращается null

      expect(emailAdapter.sendEmail).not.toHaveBeenCalled();
    });
  });
});
