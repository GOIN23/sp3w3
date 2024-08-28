import { ObjectId } from "mongodb";
import { SETTINGS } from "../../seting/seting";
import { DeviceViewModel, LoginSuccessViewModel, userSessionT } from "../../types/generalType";
import { UserViewModelConfidential } from "../../types/typeUser";
import jwt from "jsonwebtoken";
import { RepositryAuth } from "../../repository/repositryAuth";
import { SesionsService } from "./sesionsService";


export class JwtService {
  constructor(protected sesionsService: SesionsService, protected repositryAuth: RepositryAuth) { }
  async createJwt(id: string, ip: string | undefined, title: string, userLogin?: string): Promise<LoginSuccessViewModel> {
    const deviceId = String(new ObjectId());
    const accessToken = jwt.sign({ userId: id, login: userLogin }, SETTINGS.JWT_SECRET, { expiresIn: "5m" });
    const refreshToken = await this.createRefreshToken(id, deviceId);
    const result: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);

    const userSession: DeviceViewModel = {
      userId: id,
      deviceId: deviceId,
      lastActiveDate: result.iat,
      ip: ip,
      title: title,
    };
    await this.sesionsService.creatSesion(userSession);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);


      return new ObjectId(result.userId);
    } catch (error) {
      return null;
    }
  }
  async createRefreshToken(id: string, deviceId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId: id, deviceId: deviceId }, SETTINGS.JWT_SECRET, { expiresIn: "24h" });
    return refreshToken;
  }
  async updateToken(token: string, ip: string | undefined, title: string | undefined): Promise<LoginSuccessViewModel | null> {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);

      const accessToken = jwt.sign({ userId: result.userId }, SETTINGS.JWT_SECRET, { expiresIn: "10s" });
      const refreshToken = await this.createRefreshToken(result.userId, result.deviceId);

      const metaData: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);

      await this.sesionsService.updateSesion(metaData.iat, metaData.userId, metaData.deviceId);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      return null;
    }
  }
  async checkRefreshToken(refreshToken: string) {
    try {
      const result: any = jwt.verify(refreshToken, SETTINGS.JWT_SECRET);
      const checkSesionshToken = await this.repositryAuth.findRottenSessions(result.userId, result.deviceId);


      if (!checkSesionshToken) {
        return null;
      }
      if (result.iat < checkSesionshToken!.lastActiveDate) {
        return null;
      }

      return result.userId;
    } catch (error) {
      return null;
    }
  }
  async checkAccessToken(accessToken: string) {
    try {
      const result: any = jwt.verify(accessToken, SETTINGS.JWT_SECRET);
      return result;
    } catch (error) {
      return null;
    }
  }

}






