import { ObjectId } from "mongodb";
import { dbT } from "../db/mongo-.db";
import { UserViewModel, UserViewModelConfidential } from "../types/typeUser";

export const repositoryUsers = {
  async createUsers(newUser: UserViewModelConfidential): Promise<any> {
    const res = await dbT.getCollections().userCollection.insertOne(newUser);

    return res.insertedId;
  },
  async findUsers(id: string | undefined): Promise<UserViewModel | null> {
    const result = await dbT.getCollections().userCollection.findOne({ _id: id });
    if (!result) {
      return null;
    }
    return result;
  },
  async findBlogOrEmail(loginOrEmail: string): Promise<UserViewModelConfidential | null> {
    const user = await dbT.getCollections().userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

    return user;
  },
  async deleteBlogs(id: string): Promise<void> {
    await dbT.getCollections().userCollection.deleteOne({ _id: id });
  },
};
