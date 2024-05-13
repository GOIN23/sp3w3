import { ObjectId } from "mongodb";
import { dbT } from "../db/mongo-.db";
import { UserViewModel, UserViewModelConfidential, userDb } from "../types/typeUser";

export const repositoryUsers = {
  async createUsers(newUser: userDb): Promise<any> {
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
  async findBlogOrEmail(loginOrEmail: string): Promise<userDb | null> {
    const user = await dbT.getCollections().userCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

    return user;
  },

  async updateConfirmation(id: string) {
    const user = await dbT.getCollections().userCollection.updateOne({ _id: id }, { $set: { "emailConfirmation.isConfirmed": true } });

    return user.modifiedCount === 1;
  },

  async findUserByConfirEmail(code: string) {
    const user = await dbT.getCollections().userCollection.findOne({ "emailConfirmation.confirmationCode": code });

    return user;
  },

 async updateCodeUserByConfirEmail(userID:string,code: string) {
    const user = await dbT.getCollections().userCollection.updateOne({ _id: userID }, { $set: { "emailConfirmation.confirmationCode": code }});

    return user;
  },
  async deleteBlogs(id: string): Promise<void> {
    await dbT.getCollections().userCollection.deleteOne({ _id: id });
  },
};
