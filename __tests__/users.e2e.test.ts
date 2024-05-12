import { app } from "../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../src/auth/authMiddleware";
import { BlogViewModelT, PaginatorBlog } from "../src/types/typeBlog";
import { SETTINGS } from "../src/seting/seting";
import { PaginatorPosts, PostViewModelT } from "../src/types/typePosts";
import { dbT } from "../src/db/mongo-.db";
import { MongoMemoryServer } from "mongodb-memory-server";

let usersTestIdTest: PaginatorPosts = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };

const buff2 = Buffer.from(ADMIN_AUTH, "utf8");
const codedAuth: string = buff2.toString("base64");

describe("/test for users", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await dbT.run(mongoServer.getUri());
  });
  afterAll(async () => {
    await dbT.stop();
  });

  it("GET products = []", async () => {
    await request(app).get("/api/users").expect(usersTestIdTest);
  });

  it("unauthorized request ", async () => {
    await request(app)
      .post("/api/users")
      .send({
        login: "mwBvP0L2ga",
        password: "string",
        email: "1e5.kn@mail.ru",
      })
      .expect(401);
  });

  it("failed request body blogId", async () => {
    await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "mwBvP0L2ga",
        password: "string",
        email: "",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "email",
          },
        ],
      });

    await request(app).get("/api/users").expect(usersTestIdTest);
  });

  it("successful post", async () => {
    const res = await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "mwBvP0L2ga",
        password: "string",
        email: "1e5.kn@mail.ru",
      })
      .expect(201);

    const resNew = await request(app).get("/api/users");

    usersTestIdTest = resNew.body;

    await request(app).get("/api/users").expect(usersTestIdTest);
  });

  it("checking request parameters ", async () => {
    await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "1HpluOpJBG",
        password: "string",
        email: "4e5.kn@mail.ru",
      })
      .expect(201);

    await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "dstring333",
        password: "string333",
        email: "1e8.kn@mail.ru",
      })
      .expect(201);

    await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "dstring333",
        password: "strg333",
        email: "6e8.kn@mail.ru",
      })
      .expect(201);

    await request(app)
      .post("/api/users")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        login: "dstring333",
        password: "strg333",
        email: "6e8.kn@mail.ru",
      })
      .expect(201);

    const resul = await request(app).get("/api/users");

    usersTestIdTest = resul.body;

    await request(app)
      .get("/api/users")
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 5, items: [...resul.body.items] });
  });

  it("checking query - pageSize and pageNumber", async () => {
    await request(app)
      .get("/api/users")
      .query({ pageSize: 1, pageNumber: 2 })
      .expect({
        pagesCount: 5,
        page: 2,
        pageSize: 1,
        totalCount: 5,
        items: [usersTestIdTest.items[1]],
      });

    await request(app)
      .get("/api/users")
      .query({ pageSize: 1, pageNumber: 3 })
      .expect({
        pagesCount: 5,
        page: 3,
        pageSize: 1,
        totalCount: 5,
        items: [usersTestIdTest.items[2]],
      });

    await request(app)
      .get("/api/users")
      .query({ pageSize: 2, pageNumber: 1 })
      .expect({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 5,
        items: [usersTestIdTest.items[0], usersTestIdTest.items[1]],
      });
    console.log(usersTestIdTest);
  });

  it("checking query - searchLoginTerm and searchEmailTerm", async () => {
    await request(app)
      .get("/api/users")
      .query({ searchEmailTerm: "1HpluOp" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [usersTestIdTest.items[3]],
      });

    await request(app)
      .get("/api/users")
      .query({ searchEmailTerm: "6e8" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [usersTestIdTest.items[0], usersTestIdTest.items[1]],
      });
  });

  it("- DELETE product by incorrect ID", async () => {
    await request(app)
      .delete("/api/users/876328")
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/users");
    expect(res.body).toEqual(usersTestIdTest);
  });
  it("+ DELETE product by ID", async () => {
    await request(app)
      .delete(`/api/users/${usersTestIdTest.items[0].id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get("/api/users/");

    expect(res.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 4, items: [...res.body.items] });
  });
});
