import { Db, MongoClient } from "mongodb";
import { SETTINGS } from "../seting/seting";
import { BlogViewModelDbT, BlogViewModelT } from "../types/typeBlog";
import { PostViewModelT, PostViewModelTdb } from "../types/typePosts";
import { UserViewModel, UserViewModelConfidential, userDb } from "../types/typeUser";
import { CommentLikeT, CommentViewModel, CommentViewModelDb } from "../types/typeCommen";
import { CustomRateLimitT, DeviceViewModel, userSessionT } from "../types/generalType";
import mongoose from "mongoose";

export async function dbStart(url: string) {
  try {
    await mongoose.connect(url, { dbName: SETTINGS.DB_NAME });
    console.log("it is ok");
  } catch (e) {
    console.log("no connection");
    await mongoose.disconnect();
  }
}

export const dbT = {
  client: {} as MongoClient,

  getDbName(): Db {
    return this.client.db(SETTINGS.DB_NAME);
  },
  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      await this.getDbName().command({ ping: 1 });
    } catch (error) {
      console.log("ошибка при подключении");
    }
  },
  async drop() {
    await this.getCollections().blogCollection.deleteMany({});
    await this.getCollections().postCollection.deleteMany({});
    await this.getCollections().userCollection.deleteMany({});
    await this.getCollections().commentCollection.deleteMany({});
    await this.getCollections().refreshTokenBlackList.deleteMany({});
  },
  async stop() {
    await this.client.close();
    console.log("disconnection from server successful");
  },
  getCollections() {
    return {
      blogCollection: this.getDbName().collection<BlogViewModelDbT>(SETTINGS.BLOG_COLLECTION_NAME),
      postCollection: this.getDbName().collection<PostViewModelTdb>(SETTINGS.POST_COLLECTION_NAME),
      userCollection: this.getDbName().collection<userDb>(SETTINGS.USER_COLLECTION_NAME),
      commentCollection: this.getDbName().collection<CommentViewModelDb>(SETTINGS.COMMENT_COLLECTION_NAME),
      refreshTokenBlackList: this.getDbName().collection<{ refreshToken: string }>(SETTINGS.REFRESH_TOKEN_BLACK_LIST),
      customRateLimit: this.getDbName().collection<CustomRateLimitT>(SETTINGS.CUSTOM_RATEL_LIMIT),
      sesionsUser: this.getDbName().collection<DeviceViewModel>(SETTINGS.SESION_USER),
      likescollections: this.getDbName().collection<CommentLikeT>(SETTINGS.LIKES_COLLEKTIONS),
    };
  },
};
