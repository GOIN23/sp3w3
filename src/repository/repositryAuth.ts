import { dbT } from "../db/mongo-.db";

export const repositryAuth = {
  async postRefreshTokenBlacKlist(token: string) {
    await dbT.getCollections().refreshTokenBlackList.insertOne({ refreshToken: token });
  },

  async getRefreshTokenBlacKlist(token: string): Promise<string | null> {
    debugger
    const oldToken = await dbT.getCollections().refreshTokenBlackList.findOne({ refreshToken: token });

    if (oldToken) {
      return oldToken.refreshToken;
    } else {
      return null;
    }
  },
};
