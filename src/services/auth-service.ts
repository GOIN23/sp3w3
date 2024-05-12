import { ObjectId } from "mongodb";
import { UserInputModel, userDb } from "../types/typeUser";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { repositoryUsers } from "../repository/repostiryUsers";
import nodemailer from "nodemailer";
import { emailAdapter } from "../adapter/emailAdapter";

export const authService = {
  async creatUser(userData: UserInputModel) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generatHash(userData.password, passwordSalt);

    const newUser: userDb = {
      _id: String(new ObjectId()),
      login: userData.login,
      passwordHash,
      passwordSalt,
      email: userData.email,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        // доп поля необходимые для подтверждения
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };

    await emailAdapter.sendEmail(newUser);

    await repositoryUsers.createUsers(newUser);
  },
  async confirmEmail(code: string) {
    const user = await repositoryUsers.findUserByConfirEmail(code);

    if (!user) {
      return null;
    }
    if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
      const result = await repositoryUsers.updateConfirmation(user._id);

      return result;
    }

    return null;
  },
  async resendingCode(email: string) {
    const user = await repositoryUsers.findBlogOrEmail(email);

    if (!user) {
      return null;
    }

    if (user.emailConfirmation.isConfirmed) {
      return null;
    }

    await emailAdapter.sendEmail(user);

    return true;
  },
  async _generatHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  },
  async findBlogOrEmail(body: UserInputModel) {
    const checkLogin = await repositoryUsers.findBlogOrEmail(body.login);
    const checkEmail = await repositoryUsers.findBlogOrEmail(body.email);

    if (checkLogin || checkEmail) {
      return null;
    }

    return true;
  },
};
