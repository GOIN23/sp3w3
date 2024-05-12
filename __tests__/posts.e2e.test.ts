import { app } from "../src/app";
import request from "supertest";
import { ADMIN_AUTH } from "../src/auth/authMiddleware";
import { BlogViewModelT, PaginatorBlog } from "../src/types/typeBlog";
import { SETTINGS } from "../src/seting/seting";
import { PaginatorPosts, PostViewModelT } from "../src/types/typePosts";
import { dbT } from "../src/db/mongo-.db";
import { MongoMemoryServer } from "mongodb-memory-server";
import { testSeder } from "./utilitTest/testSeder";
import { Paginator } from "../src/types/generalType";
import { CommentViewModel } from "../src/types/typeCommen";

let postsTestIdTest: PaginatorPosts = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };
let blogTest: PaginatorBlog = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };
let commentsTests: Paginator<CommentViewModel> = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] };

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
    await request(app).get("/api/posts").expect(postsTestIdTest);
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

  it("failed request body blogId", async () => {
    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "aloig",
        shortDescription: "jn",
        content: "nnnn",
        blogId: "ytyy",
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "E-mail already in use",
            field: "blogId",
          },
        ],
      });

    await request(app).get("/api/posts").expect(postsTestIdTest);
  });

  it("failed request", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        name: "string",
        description: "string",
        websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
      })
      .expect(201);

    blogTest.items.push(res.body);

    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "",
        shortDescription: "",
        content: "",
        blogId: blogTest.items[0].id,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_400, {
        errorsMessages: [
          {
            message: "Invalid value",
            field: "title",
          },

          {
            message: "Invalid value",
            field: "shortDescription",
          },
          {
            message: "Invalid value",
            field: "content",
          },
        ],
      });

    await request(app).get("/api/posts").expect(postsTestIdTest);
  });

  it("successful post and authorization", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogTest.items[0].id,
      })
      .expect(201);

    postsTestIdTest.items.push(res.body);

    const respost = await request(app).get("/api/posts");
    postsTestIdTest = respost.body;

    await request(app).get("/api/posts").expect(postsTestIdTest);
  });

  it("GET product by ID with correct id", async () => {
    await request(app)
      .get("/api/posts/" + postsTestIdTest.items[0].id)
      .expect(postsTestIdTest.items[0]);
  });

  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put("/api/posts/" + 1223)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/posts/");
    expect(res.body).toEqual(postsTestIdTest);
  });

  it("+ PUT product by ID with correct data", async () => {
    await request(app)
      .put("/api/posts/" + postsTestIdTest.items[0].id)
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "saday",
        shortDescription: "jan",
        content: "blas asdsa",
        blogId: blogTest.items[0].id,
      })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get("/api/posts/");
    postsTestIdTest = res.body;

    expect(res.body).toEqual(postsTestIdTest);
  });

  // tests query check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  it("checking request parameters ", async () => {
    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "ali",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogTest.items[0].id,
      })
      .expect(201);
    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "bli2",
        shortDescription: "jan3",
        content: "dasdsq",
        blogId: blogTest.items[0].id,
      })
      .expect(201);

    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "cli",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogTest.items[0].id,
      })
      .expect(201);

    await request(app)
      .post("/api/posts")
      .set({ Authorization: "Basic " + codedAuth })
      .send({
        title: "dli",
        shortDescription: "jan",
        content: "dasdsq",
        blogId: blogTest.items[0].id,
      })
      .expect(201);

    const resul = await request(app).get("/api/posts");

    postsTestIdTest = resul.body;

    console.log(postsTestIdTest, "help ples");

    await request(app)
      .get("/api/posts")
      .expect({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 5, items: [...resul.body.items] });
  });

  it("checking query - pageSize and pageNumber", async () => {
    await request(app)
      .get("/api/posts")
      .query({ pageSize: 1, pageNumber: 2 })
      .expect({
        pagesCount: 5,
        page: 2,
        pageSize: 1,
        totalCount: 5,
        items: [postsTestIdTest.items[1]],
      });

    await request(app)
      .get("/api/posts")
      .query({ pageSize: 1, pageNumber: 3 })
      .expect({
        pagesCount: 5,
        page: 3,
        pageSize: 1,
        totalCount: 5,
        items: [postsTestIdTest.items[2]],
      });

    await request(app)
      .get("/api/posts")
      .query({ pageSize: 2, pageNumber: 1 })
      .expect({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 5,
        items: [postsTestIdTest.items[0], postsTestIdTest.items[1]],
      });
  });

  it("checking query - sortDirection and sortBy", async () => {
    await request(app)
      .get("/api/posts")
      .query({ sortBy: "title" }) // Since the default value is desc, the sorting will be in descending order. It turns out from the last letter of the alphabet to the first
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [postsTestIdTest.items[4], postsTestIdTest.items[0], postsTestIdTest.items[1], postsTestIdTest.items[2], postsTestIdTest.items[3]],
      });

    await request(app)
      .get("/api/posts")
      .query({ sortBy: "title", sortDirection: "asc" })
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 5,
        items: [postsTestIdTest.items[3], postsTestIdTest.items[2], postsTestIdTest.items[1], postsTestIdTest.items[0], postsTestIdTest.items[4]],
      });
  });

  it("- PUT product by ID with incorrect data", async () => {
    await request(app)
      .put("/api/posts/" + 1223)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ title: "title", author: "title" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/posts/");
    expect(res.body).toEqual(postsTestIdTest);
  });

  //tests comments !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  it("- POSTS/:ID/COMMENTS. METHOD=POST invalid jwt token. Unauthorized", async () => {
    await request(app)
      .post(`/api/posts/${postsTestIdTest.items[0].id}/comments`)
      .set({ Authorization: "Basic " + codedAuth })
      .send({ content: "adasdas dasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_401);
  });

  it("+ POSTS/:ID/COMMENTS METHOD=POST successful request creating comments", async () => {
    await testSeder.registeUser({
      email: "4e5.kn@mail.ru",
      login: "fsasasfas",
      password: "string",
    });

    const token = await testSeder.loginUser({
      loginOrEmail: "fsasasfas",
      password: "string",
    });

    const post = await request(app)
      .post(`/api/posts/${postsTestIdTest.items[0].id}/comments`)
      .set({ Authorization: "Bearer " + token.body.accessToken })
      .send({ content: "adasds dasdas adas dad a" })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_201);

    expect(post.body).toEqual({
      id: expect.any(String),
      commentatorInfo: { userId: expect.any(String), userLogin: "fsasasfas" },
      content: "adasds dasdas adas dad a",
      createdAt: expect.any(String),
    });
  });

  it(" + POSTS/:ID/COMMENTS METHOD=GET check comment for receiving data", async () => {
    const token = await testSeder.loginUser({
      loginOrEmail: "fsasasfas",
      password: "string",
    });

    const commentsArray = await testSeder.creatComments(postsTestIdTest.items[0].id, token.body.accessToken);

    const comments = await request(app)
      .get(`/api/posts/${postsTestIdTest.items[0].id}/comments`)
      .set({ Authorization: "Bearer " + token.body.accessToken })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_200);

    expect(comments.body).toEqual({ pagesCount: 1, page: 1, pageSize: 10, totalCount: 4, items: commentsArray.body.items });
  });

  it("- DELETE product by incorrect ID", async () => {
    await request(app)
      .delete("/api/posts/876328")
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_404);

    const res = await request(app).get("/api/posts/");
    expect(res.body).toEqual(postsTestIdTest);
  });

  it("+ DELETE product by  ID", async () => {
    await request(app)
      .delete(`/api/posts/${postsTestIdTest.items[0].id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .expect(SETTINGS.HTTPCOD.HTTPCOD_204);

    const res = await request(app).get("/api/posts/");
    postsTestIdTest = res.body;
    expect(res.body).toEqual(postsTestIdTest);
  });
});
