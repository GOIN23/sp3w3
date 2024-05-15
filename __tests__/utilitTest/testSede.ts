import bcrypt from "bcrypt";
import { UserInputModel, userDb } from "../../src/types/typeUser";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { repositoryUsers } from "../../src/repository/repostiryUsers";
import { usersService } from "../../src/services/users-service";

export const testSeder = {
  creatUserDto(): UserInputModel {
    return {
      login: "testing23",
      email: "4e5.kn@mail.ru",
      password: "1234567",
    };
  },
  creatUserDtos(count: number) {
    const user: UserInputModel[] = [];
    for (let a = 0; a < count; a++) {
      user.push({
        login: `testing23${a}`,
        email: `4e${a}.kn@mail.ru`,
        password: "1234567",
      });
    }

    return user;
  },
  async registerUser(inputData: UserInputModel) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService._generatHash(inputData.password, passwordSalt);

    const newUser: userDb = {
      _id: String(new ObjectId()),
      login: inputData.login,
      passwordHash,
      passwordSalt,
      email: inputData.email,
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      createdAt: new Date().toISOString(),
    };

    const user = await repositoryUsers.createUsers(newUser);

    return {
      id: newUser._id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },
};
