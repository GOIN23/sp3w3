import { body } from "express-validator";
import { app } from "../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../src/auth/authMiddleware";
import { PaginatorBlog } from "../src/types/typeBlog";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbT } from "../src/db/mongo-.db";
import { SETTINGS } from "../src/seting/seting";
import { PostViewModelT } from "../src/types/typePosts";

let blogsTest: PaginatorBlog = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };
let blogPosts: PostViewModelT;
const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
let codedAuth: string = buff2.toString("base64");

describe("/test for users", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbT.run(mongoServer.getUri());
  });
  afterAll(async () => {
    await dbT.stop();
  });
  it("GET products = []", async () => {
    await request(app).get("/api/blogs").expect(blogsTest);
  });
  it("unauthorized request ", async () => {
    await request(app)
      .post("/api/posts")
      .send({
        title: "aloig",
        shortDescription: "jn",
        content: "nnnn",
        blogId: "ytyy",
      })
      .expect(401);
  });
  it("failed request ", async () => {
    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "name",
          },
        ],
      });

    await request(app).get("/api/blogs").expect(blogsTest);
  });
  it("failed request absolut", async () => {
    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "",
        description: "",
        websiteUrl: "://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "name",
          },
          {
            message: "Invalid value",
            field: "description",
          },
          {
            message: "Invalid value",
            field: "websiteUrl",
          },
        ],
      });

    await request(app).get("/api/blogs").expect(blogsTest);
  });
  it("resolve posts", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "string",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    const resul = await request(app).get("/api/blogs");

    blogsTest = resul.body;

    await request(app).get("/api/blogs").expect(blogsTest);
  });
  it("GET product by ID with correct id", async () => {
    await request(app)
      .get("/api/blogs/" + blogsTest.items[0].id)
      .expect(blogsTest.items[0]);
  });
  it("creating a blog post", async () => {
    const res = await request(app)
      .post(`/api/blogs/${blogsTest.items[0].id}/posts`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogsTest.items[0].id,
      })
      .expect(201);

    blogPosts = res.body;
    await request(app)
      .get(`/api/posts/` + res.body.id)
      .expect(res.body);
  });
  it("get blog post", async () => {
    await request(app)
      .get(`/api/blogs/${blogsTest.items[0].id}/posts`)
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [blogPosts] });
  });
  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put("/api/blogs/" + 1223)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/blogs/");

    await request(app)
      .get("/api/blogs")
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [res.body.items[0]] });
  });
  it("+ PUT product by ID with correct data", async () => {
    await request(app)
      .put("/api/blogs/" + blogsTest.items[0].id)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "sadsad",
        description: "alo",
        websiteUrl: "https://AzjaYxsAsfCef-pmSQL8r4APHKA0jMx1435xE7iUl-3rhu0bNLJu88YAWsTeIaFEbUaw5rBoK_nukHlv15VtRjL1UXLp",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const result = await request(app).get("/api/blogs/");

    expect(result.body.items[0]).toEqual({
      ...blogsTest.items[0],
      name: "sadsad",
      description: "alo",
      websiteUrl: "https://AzjaYxsAsfCef-pmSQL8r4APHKA0jMx1435xE7iUl-3rhu0bNLJu88YAWsTeIaFEbUaw5rBoK_nukHlv15VtRjL1UXLp",
    });

    blogsTest = result.body;
  });
  // tests query check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it("checking request parameters ", async () => {
    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "atring44",
        description: "string44",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "dstring333",
        description: "string333",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "btring12",
        description: "string12",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "ctring",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    const resul = await request(app).get("/api/blogs");

    blogsTest = resul.body;

    console.log(blogsTest, "help ples");

    await request(app)
      .get("/api/blogs")
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 5, items: [...resul.body.items] });
  });
  it("checking query - pageSize and pageNumber", async () => {
    await request(app)
      .get("/api/blogs")
      .query({ pageSize: 1, pageNumber: 2 })
      .expect({
        pagesCount: 5,
        page: 2,
        pageSize: 1,
        totalCount: 5,
        items: [blogsTest.items[1]],
      });

    await request(app)
      .get("/api/blogs")
      .query({ pageSize: 1, pageNumber: 3 })
      .expect({
        pagesCount: 5,
        page: 3,
        pageSize: 1,
        totalCount: 5,
        items: [blogsTest.items[2]],
      });

    await request(app)
      .get("/api/blogs")
      .query({ pageSize: 2, pageNumber: 1 })
      .expect({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 5,
        items: [blogsTest.items[0], blogsTest.items[1]],
      });
  });
  it("checking query - sortDirection and sortBy", async () => {
    await request(app)
      .get("/api/blogs")
      .query({ sortBy: "name" }) // Since the default value is desc, the sorting will be in descending order. It turns out from the last letter of the alphabet to the first
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [blogsTest.items[4], blogsTest.items[2], blogsTest.items[0], blogsTest.items[1], blogsTest.items[3]],
      });

    await request(app)
      .get("/api/blogs")
      .query({ sortBy: "name", sortDirection: "asc" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [blogsTest.items[3], blogsTest.items[1], blogsTest.items[0], blogsTest.items[2], blogsTest.items[4]],
      });
  });

  it("checking query - searchNameTerm", async () => {
    await request(app)
      .get("/api/blogs")
      .query({ searchNameTerm: "ctri" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [blogsTest.items[0]],
      });
  });

  it("- DELETE product by incorrect ID", async () => {
    await request(app)
      .delete("/api/blogs/876328")
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/blogs/");
    expect(res.body).toEqual(blogsTest);
  });
  it("+ DELETE product by ID", async () => {
    await request(app)
      .delete(`/api/blogs/${blogsTest.items[0].id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get("/api/blogs/");

    expect(res.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 4, items: [...res.body.items] });
  });
});
