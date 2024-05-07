import { ObjectId } from "mongodb";
import { SETTINGS } from "../../seting/seting";
import { LoginSuccessViewModel } from "../../types/generalType";
import { UserViewModelConfidential } from "../../types/typeUser";
import jwt from "jsonwebtoken";

export const jwtService = {
  async createJwt(user: UserViewModelConfidential): Promise<LoginSuccessViewModel> {
    const token = jwt.sign({ userId: user._id }, SETTINGS.JWT_SECRET, { expiresIn: "1h" });
    return {
      accessToken: token,
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
};
