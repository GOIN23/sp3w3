import { app } from "./../src/app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbT } from "../src/db/mongo-.db";
import { CommentViewModel } from "../src/types/typeCommen";
import { ADMIN_AUTH } from "../src/auth/authMiddleware";
import request from "supertest";

let CommentViewModel: CommentViewModel;
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

  it("-GET products = []", async () => {
    await request(app).get(`/api/comments/${1}`).expect(404);
  });
});
