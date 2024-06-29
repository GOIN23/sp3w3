import { DeviceViewModel } from "./../types/generalType";
import { dbT } from "../db/mongo-.db";
import { CustomRateLimitT, userSessionT } from "../types/generalType";
import { CustomRateLimitTModel, DeviceViewModelMong, passwordRecoveryCodeModule, userModule } from "../mongoose/module";



export class RepositryAuth {
  async addRateLlimit(metaData: CustomRateLimitT) {
    await CustomRateLimitTModel.insertMany(metaData);
  }
  async checkingNumberRequests(body: CustomRateLimitT, data: Date) {
    const filter = {
      IP: body.IP,
      URL: body.URL,
      date: { $gte: data }, // Текущая дата - 10 секунд
    };

    const result = await CustomRateLimitTModel.countDocuments(filter);
    return result;
  }
  async addSesionUser(userSession: DeviceViewModel) {
    await DeviceViewModelMong.insertMany(userSession);
  }
  async updateSesionUser(iat: string, userId: string, diveceId: string) {
    await DeviceViewModelMong.updateOne({ userId: userId, deviceId: diveceId }, { $set: { lastActiveDate: iat } });
  }
  async findRottenSessions(userId: string, deviceId: string) {
    const userSesion = await DeviceViewModelMong.findOne({
      userId: userId,
      deviceId: deviceId,
    });

    return userSesion;
  }
  async getSesions(userId: string) {
    const sesionsDivece = await DeviceViewModelMong.find({ userId: userId });
    const mapDateSesio = sesionsDivece.map((d) => {
      return {
        deviceId: d.deviceId,
        ip: d.ip,
        lastActiveDate: new Date(+d.lastActiveDate * 1000),
        title: d.title,
      };
    });
    return mapDateSesio;
  }
  async getSesionsId(deviceId: string) {
    const sesionsDivece = await DeviceViewModelMong.findOne({ deviceId: deviceId });
    return sesionsDivece;
  }
  async postPasswordRecoveryCode(code: string, email: string) {
    try {
      await passwordRecoveryCodeModule.insertMany({ code: code, email: email });
    } catch (error) {
      console.log(error);
    }
  }
  async checkPasswordRecoveryCode(code: string) {
    const result = await passwordRecoveryCodeModule.findOne({ code: code });
    return result;
  }
  async updatePassword(email: string, newPasswordHash: string, newPasswordSalt: string): Promise<void> {
    await userModule.updateOne({ email: email }, { $set: { passwordHash: newPasswordHash, passwordSalt: newPasswordSalt } });
  }
  async deleteSesions(deviceId: string) {
    await DeviceViewModelMong.deleteMany({ deviceId: { $ne: deviceId } });
  }
  async deleteSesionsId(deviceId: string) {
    await DeviceViewModelMong.deleteOne({ deviceId: deviceId });
  }
  async completelyRemoveSesion(deviceId: string, userId: string) {
    await DeviceViewModelMong.deleteOne({ deviceId: deviceId, userId: userId });
  }
}






