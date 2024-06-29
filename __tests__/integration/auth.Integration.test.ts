import { body } from 'express-validator';
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbStart, dbT } from "../../src/db/mongo-.db";
import { emailAdapter } from "../../src/adapter/emailAdapter";
import { managerTestUser } from "../utilitTest/managerTestUser";
import { app } from "../../src/app";
import request from "supertest";
import { SETTINGS } from "../../src/seting/seting";
import mongoose from "mongoose";
import { authService, controllerAuth, repositryAuth } from "../../src/composition/composition-rootAuth";
import { repositryUsers } from "../../src/composition/composition-rootUsers";


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe("Auth-integration", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbStart(mongoServer.getUri())
  });
  afterAll(async () => {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error("Error while disconnecting from MongoDB:", error);
    }
  });
  afterEach(async () => {
    await request(app).delete(SETTINGS.PATH.ALLDATA)
  })

  describe("authentication", () => {
    it("registration correct", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();

      const result = await authService.creatUser(userDto);

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
      await authService.creatUser(userDto);
      const findUser = await repositryUsers.findBlogOrEmail(userDto.email);

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
      await authService.creatUser(userDto);
      await authService.resendingCode(userDto.email);

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(2);
    });
    it("failed to resend the message because the email has already been verified", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();
      await authService.creatUser(userDto);
      const findUser = await repositryUsers.findBlogOrEmail(userDto.email);
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
    it("password update", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });
      const userDto = managerTestUser.creatUserDto();
      await authService.creatUser(userDto);
      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: userDto.login,
          password: userDto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

      const resCode = await authService.passwordRecovery(userDto.email)


      await authService.checkPasswordRecovery(resCode, "12345678")


      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: userDto.login,
          password: userDto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_401);


      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: userDto.login,
          password: "12345678",
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);




      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(2);

    })
  });

  describe("authorization", () => {
    it("+ auth/login. Successful login", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });

      const userDto = managerTestUser.creatUserDto();
      await authService.creatUser(userDto);

      const result = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: userDto.login,
          password: userDto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

      expect(result.body).toEqual({
        accessToken: expect.any(String),
      });

      expect(result.headers["set-cookie"]).toBeDefined();

      expect(emailAdapter.sendEmail).toHaveBeenCalled();
      expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
    });
    it("- auth/login. The check failed due to the absence of this user", async () => {
      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: "DSFSS",
          password: "FSFSFS",
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
    });
    it("+ auth/logout. Successful exit", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });

      const dto = managerTestUser.creatUserDto();
      await authService.creatUser(dto);

      const result = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: dto.login,
          password: dto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

      await request(app).post(`${SETTINGS.PATH.AUTH}/logout`).set("Cookie", result.headers["set-cookie"]).expect(SETTINGS.HTTPCOD.HTTPCOD_204);
    });
    it("- auth/logout. invalid refreshToken", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });

      const dto = managerTestUser.creatUserDto();
      await authService.creatUser(dto);

      const result = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: dto.login,
          password: dto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);


      await delay(1000)
      await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`).set("Cookie", result.headers["set-cookie"]).expect(SETTINGS.HTTPCOD.HTTPCOD_200)

      await request(app).post(`${SETTINGS.PATH.AUTH}/logout`).set("Cookie", result.headers["set-cookie"]).expect(SETTINGS.HTTPCOD.HTTPCOD_401);// Обновление refresh-token и соответсвенно обновление токина в сессии.

    });
    it("+ auth/refresh-token. Successful token update", async () => {
      emailAdapter.sendEmail = jest.fn().mockImplementation((userCode: string, email: string) => {
        return true;
      });

      const dto = managerTestUser.creatUserDto();
      await authService.creatUser(dto);

      const result = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
          loginOrEmail: dto.login,
          password: dto.password,
        })
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

      await delay(1000)
      const newToken = await request(app)
        .post(`${SETTINGS.PATH.AUTH}/refresh-token`)
        .set("Cookie", result.headers["set-cookie"])
        .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

      await request(app).post(`${SETTINGS.PATH.AUTH}/logout`).set("Cookie", result.headers["set-cookie"]).expect(SETTINGS.HTTPCOD.HTTPCOD_401);

      await request(app).post(`${SETTINGS.PATH.AUTH}/logout`).set("Cookie", newToken.headers["set-cookie"]).expect(SETTINGS.HTTPCOD.HTTPCOD_204);



    });
  });
});
