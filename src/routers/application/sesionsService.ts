import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { RepositryAuth } from "../../repository/repositryAuth";
import { DeviceViewModel, userSessionT } from "../../types/generalType";
import { SETTINGS } from "../../seting/seting";

export class SesionsService {
  constructor(protected repositryAuth: RepositryAuth) { }
  async creatSesion(userSession: DeviceViewModel) {
    await this.repositryAuth.addSesionUser(userSession);
  }
  async updateSesion(iat: string, userId: string, diveceId: string) {
    await this.repositryAuth.updateSesionUser(iat, userId, diveceId);
  }
  async getSesions(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await this.repositryAuth.getSesions(result.userId);

      return sesions;
    } catch (error) {
      return null;
    }
  }
  async getSesionsId(deviceId: string){
    const sesion = this.repositryAuth.getSesionsId(deviceId)

    return sesion
  }
  async completelyRemoveSesion(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await this.repositryAuth.completelyRemoveSesion(result.deviceId, result.userId);

      return sesions;
    } catch (error) {
      return null;
    }
  }
  async deleteSesions(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      const sesions = await this.repositryAuth.deleteSesions(result.deviceId);

      return sesions;
    } catch (error) {
      return null;
    }
  }
  async deleteSesionsId(deviceId: string) {

    await this.repositryAuth.deleteSesionsId(deviceId);

    return true;
  }
}






