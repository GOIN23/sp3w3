import { app } from "../../src/app";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { dbT } from "../../src/db/mongo-.db";
import { SETTINGS } from "../../src/seting/seting";
import { LoginInputModel } from "../../src/types/generalType";
import { UserInputModel } from "../../src/types/typeUser";
import request from "supertest";
const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");

export const testSeder = {
  async registeUser(userInput: UserInputModel) {
    const user = await request(app)
      .post(`${SETTINGS.PATH.USERS}/`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: userInput.login,
        password: userInput.password,
        email: userInput.email,
      });

    return user;
  },
  async loginUser(userLoginInput: LoginInputModel) {
    const token = await request(app)
      .post(`${SETTINGS.PATH.AUTH}/login`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        loginOrEmail: userLoginInput.loginOrEmail,
        password: userLoginInput.password,
      });

    return token;
  },

  async creatComments(postId: string, token: string) {
    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set({ Authorization: "Bearer " + token })
      .send({ content: "ffdsfdsfasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set({ Authorization: "Bearer " + token })
      .send({ content: "bbdsfsd dad adaddaddaddaddad" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set({ Authorization: "Bearer " + token })
      .send({ content: "nvbvasds dasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);


      const commets =  await request(app).get(`/api/posts/${postId}/comments`).set({ Authorization: "Bearer " + token })
    

      return commets
  },
};
