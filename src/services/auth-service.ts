import { RepositoryUsers } from "./../repository/repostiryUsers";
import { ObjectId } from "mongodb";
import { UserInputModel, UserViewModel2, userDb } from "../types/typeUser";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { emailAdapter } from "../adapter/emailAdapter";
import { RepositryAuth } from "../repository/repositryAuth";
import { CustomRateLimitT } from "../types/generalType";




export class AuthService {
  constructor(public repositoryUsers: RepositoryUsers, public repositryAuth: RepositryAuth) {
  }

  async creatUser(userData: UserInputModel): Promise<UserViewModel2> {
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


    console.log(newUser,"newUsernewUsernewUser" )

    await this.repositoryUsers.createUsers(newUser);



    try {
      await emailAdapter.sendEmail(newUser.emailConfirmation.confirmationCode, newUser.email);
    } catch (error) {
      console.log(error);
    }

    return {
      id: newUser._id,
      createdAt: newUser.createdAt,
      email: newUser.email,
      login: newUser.login,
    };
  }
  async confirmEmail(code: string) {
    const user: any = await this.repositoryUsers.findUserByConfirEmail(code);

    if (!user) {
      return null;
    }
    if (user.emailConfirmation.confirmationCode === code && user.emailConfirmation.expirationDate > new Date()) {
      console.log("startstartstartstartstartstart")
      const result = await this.repositoryUsers.updateConfirmation(user._id);

      return result;
    }

    return null;
  }
  async resendingCode(email: string) {
    const user = await this.repositoryUsers.findBlogOrEmail(email);

    if (!user) {
      return null;
    }

    if (user.emailConfirmation.isConfirmed) {
      return null;
    }
    const newCode = randomUUID();
    await this.repositoryUsers.updateCodeUserByConfirEmail(user?._id, newCode);

    try {
      await emailAdapter.sendEmail(newCode, email);
    } catch (error) {
      console.log(error);
    }
    return true;
  }
  async passwordRecovery(email: string) {
    const passwordRecoveryCode = randomUUID();


    await this.repositryAuth.postPasswordRecoveryCode(passwordRecoveryCode, email);

    try {
      await emailAdapter.sendEmail("null", email, passwordRecoveryCode);
      return passwordRecoveryCode
    } catch (e) {
      console.log(e);
      return e
    }
  }
  async checkPasswordRecovery(code: any, newPassword: string) {
    const result = await this.repositryAuth.checkPasswordRecoveryCode(code);

    if (!result) {
      return false;
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generatHash(newPassword, passwordSalt);

    await this.repositryAuth.updatePassword(result.email, passwordHash, passwordSalt);

    return true;
  }
  async _generatHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
  async findBlogOrEmail(emailOrLogin: string) {
    const checkEmailorLogin = await this.repositoryUsers.findBlogOrEmail(emailOrLogin);

    if (checkEmailorLogin) {
      return null;
    }

    return true;
  }
  async addRateLlimit(metaData: CustomRateLimitT) {
    await this.repositryAuth.addRateLlimit(metaData);
  }
  async checkingNumberRequests(metaData: CustomRateLimitT) {
    const data = new Date(metaData.date.getTime() - 10000);
    const result = await this.repositryAuth.checkingNumberRequests(metaData, data);
    return result;
  }
}








