import { app } from "../../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../../src/auth/authMiddleware";
import { SETTINGS } from "../../src/seting/seting";
import { BlogInputModelT, BlogViewModelT } from "../../src/types/typeBlog";
import { PostInputModelT } from "../../src/types/typePosts";
import { randomText } from "./randomText";

const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");

export const managerTestBlogs = {
  async creatBlogOne(sendInput: BlogInputModelT): Promise<BlogViewModelT> {
    const blogs = await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(sendInput)
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    return blogs.body;
  },
  async creatBlogsMany() {
    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "string",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "atring44",
        description: "string44",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "dstring333",
        description: "string333",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "btring12",
        description: "string12",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "ctring",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);
  },
  async creatBlogPostOne(sendInput: PostInputModelT, blogId: string) {
    const blogs = await request(app)
      .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(sendInput)
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    return blogs.body;
  },
  async updateBlog(sendInput: BlogInputModelT, blogId: string) {
    const blogs = await request(app)
      .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(sendInput)
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    return blogs.body;
  },
};
