import request from "supertest";
import { app } from "../../src/app";

export const testGet = {
  async requsetGet(endpoint: string, exprect: any) {
   const blogs =  await request(app).get(`${endpoint}`).expect(exprect);

   console.log(blogs.body)
   return blogs.body
  },
};
