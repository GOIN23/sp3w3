import mongoose from "mongoose";
import { SETTINGS } from "../seting/seting";
import {
  CustomRateLimitTSchema,
  DeviceViewModelSchema,
  blogSchema,
  commentSchema,
  likeShema,
  passwordRecoveryCodeSchema,
  postSchema,
  userSchema,
} from "./schema";

export const blogModel = mongoose.model(SETTINGS.BLOG_COLLECTION_NAME, blogSchema);
export const postModel = mongoose.model(SETTINGS.POST_COLLECTION_NAME, postSchema);
export const commentModel = mongoose.model(SETTINGS.COMMENT_COLLECTION_NAME, commentSchema);
export const CustomRateLimitTModel = mongoose.model(SETTINGS.CUSTOM_RATEL_LIMIT, CustomRateLimitTSchema);
export const DeviceViewModelMong = mongoose.model(SETTINGS.SESION_USER, DeviceViewModelSchema);
export const userModule = mongoose.model(SETTINGS.USER_COLLECTION_NAME, userSchema);
export const passwordRecoveryCodeModule = mongoose.model(SETTINGS.RECOVERY_PASSWORD_CODE, passwordRecoveryCodeSchema);

export const likesModule = mongoose.model(SETTINGS.LIKES_COLLEKTIONS, likeShema);
