import { ObjectId } from "mongodb";
import { SETTINGS } from "../../seting/seting";
import { LoginSuccessViewModel } from "../../types/generalType";
import { UserViewModelConfidential } from "../../types/typeUser";
import jwt from "jsonwebtoken";
import { repositryAuth } from "../../repository/repositryAuth";

export const jwtService = {
  async createJwt(id: string): Promise<LoginSuccessViewModel> {
    const accessToken = jwt.sign({ userId: id }, SETTINGS.JWT_SECRET, { expiresIn: "10s" });
    const refreshToken = await this.createRefreshToken(id);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  },
  async createRefreshToken(id: string): Promise<string> {
    const refreshToken = jwt.sign({ userId: id }, SETTINGS.JWT_SECRET, { expiresIn: "20s" });
    return refreshToken;
  },
  async updateToken(token: string): Promise<LoginSuccessViewModel | null> {
    const checkBlackListToken = await repositryAuth.getRefreshTokenBlacKlist(token);

    if (checkBlackListToken) {
      return null;
    }
    await repositryAuth.postRefreshTokenBlacKlist(token);

    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const newToken = await this.createJwt(result.userId);

      return newToken;
    } catch (error) {
      return null;
    }
  },
  async addRefreshTokenBlacKlist(token: string) {
    await repositryAuth.postRefreshTokenBlacKlist(token);
  },

  async checkRefreshToken(refreshToken: string) {
    const checkBlackListToken = await repositryAuth.getRefreshTokenBlacKlist(refreshToken);

    if (checkBlackListToken) {
      return null;
    }

    try {
      const result: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);
      const newToken = await this.createJwt(result.userId);
      await repositryAuth.postRefreshTokenBlacKlist(refreshToken);

      return newToken;
    } catch (error) {
      return null;
    }
  },
};
