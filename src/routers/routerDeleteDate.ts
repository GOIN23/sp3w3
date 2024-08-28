import express, { Request, Response } from "express";
import { dbT } from "../db/mongo-.db";
import { CustomRateLimitTModel, DeviceViewModelMong, blogModel, commentModel, likesModule, likesModulePosts, passwordRecoveryCodeModule, postModel, userModule } from "../mongoose/module";

export const routerDeletDate = () => {
  const router = express.Router();

  router.delete("/", async (req: Request, res: Response) => {
    await postModel.deleteMany()
    await blogModel.deleteMany()
    await userModule.deleteMany()
    await commentModel.deleteMany()
    await DeviceViewModelMong.deleteMany()
    await CustomRateLimitTModel.deleteMany()
    await passwordRecoveryCodeModule.deleteMany();
    await likesModule.deleteMany()
    await likesModulePosts.deleteMany()

    res.sendStatus(204);
    return;
  });

  return router;
};
