import { app } from "../../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { SETTINGS } from "../../src/seting/seting";
import { BlogInputModelT } from "../../src/types/typeBlog";

const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");


export const managerTestBlogs = {
  async creatBlogsOne(sendInput: BlogInputModelT) {
    const blogs = await request(app)
      .post(SETTINGS.PATH.ALLDATA)
      .set({ Authorization: "Basic " + codedAuth })
      .send(sendInput)
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    return blogs.body;
  },
};
