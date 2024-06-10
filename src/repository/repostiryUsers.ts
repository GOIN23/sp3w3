import { ObjectId } from "mongodb";
import { dbT } from "../db/mongo-.db";
import { UserViewModel, UserViewModelConfidential, userDb } from "../types/typeUser";
import { userModule } from "../mongoose/module";

export const repositoryUsers = {
  async createUsers(newUser: userDb): Promise<void> {
    await userModule.insertMany(newUser);
  },
  async findUsers(id: string | undefined): Promise<UserViewModel | null> {
    const result = await userModule.findOne({ _id: id });
    if (!result) {
      return null;
    }
    return result;
  },
  async findBlogOrEmail(loginOrEmail: string): Promise<any | null> {
    const user = await userModule.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });

    return user;
  },
  async updateConfirmation(id: string) {
    const user = await userModule.updateOne({ _id: id }, { $set: { "emailConfirmation.isConfirmed": true } });

    return user.modifiedCount === 1;
  },
  async findUserByConfirEmail(code: string) {
    const user = await userModule.findOne({ "emailConfirmation.confirmationCode": code });

    return user;
  },
  async updateCodeUserByConfirEmail(userID: string, code: string) {
    const user = await userModule.updateOne({ _id: userID }, { $set: { "emailConfirmation.confirmationCode": code } });

    return user;
  },
  async deleteBlogs(id: string): Promise<void> {
    await userModule.deleteOne({ _id: id });
  },
};
