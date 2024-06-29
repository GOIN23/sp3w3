import { BlogInputModelT } from "./../types/typeBlog";
import { CommentLikeT, CommentatorInfo, likesInfoT, metaLikesInfoT, statusCommentLike } from "./../types/typeCommen";
import mongoose from "mongoose";
import { BlogViewModelDbT } from "../types/typeBlog";
import { PostViewModelTdb } from "../types/typePosts";
import { CommentViewModelDb } from "../types/typeCommen";
import { CustomRateLimitT, DeviceViewModel } from "../types/generalType";
import { UserViewModelConfidential, emailConfirmation, userDb } from "../types/typeUser";

export const blogSchema = new mongoose.Schema<BlogViewModelDbT>({
  _id: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
  name: { type: String, required: true },
  websiteUrl: { type: String, required: true },
});

export const postSchema = new mongoose.Schema<PostViewModelTdb>({
  _id: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  title: { type: String, required: true },
});

export const commentatorInfoSchema = new mongoose.Schema<CommentatorInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
});

export const likesInfo = new mongoose.Schema<likesInfoT>({
  dislikesCount: { type: Number, required: true },
  likesCount: { type: Number, required: true },
  myStatus: { type: String, required: true },
});


export const commentSchema = new mongoose.Schema<CommentViewModelDb>({
  _id: { type: String, required: true },
  commentatorInfo: { type: commentatorInfoSchema, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  IdPost: { type: String, required: true },
  likesInfo: { type: likesInfo, required: true },
});

export const likeShema = new mongoose.Schema<CommentLikeT>({
  _id: { type: String, required: true },
  commentId: { type: String, required: true },
  createdAt: { type: String, required: true },
  status: { type: String, required: true },
  userID: { type: String, required: true },
});

export const CustomRateLimitTSchema = new mongoose.Schema<CustomRateLimitT>({
  date: { type: Date, required: true },
  IP: { type: String, required: true },
  URL: { type: String, required: true },
});

export const DeviceViewModelSchema = new mongoose.Schema<DeviceViewModel>({
  deviceId: { type: String, required: true },
  ip: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
});

const emailConfirmationShema = new mongoose.Schema<emailConfirmation>({
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true }

})
export const userSchema = new mongoose.Schema<userDb>({
  _id: { type: String, required: true },
  createdAt: { type: String, required: true },
  email: { type: String, required: true },
  login: { type: String, required: true },
  emailConfirmation: { type: emailConfirmationShema, required: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
});

export const passwordRecoveryCodeSchema = new mongoose.Schema<{ code: string; email: string }>({
  code: { type: String, required: true },
  email: { type: String, required: true },
});
