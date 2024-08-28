import { injectable } from "inversify";
import { commentModel, likesModule, likesModulePosts, postModel } from "../mongoose/module";
import { CommentInputModel, CommentLikeT, CommentViewModel, CommentViewModelDb, PostLikeT, statusCommentLike } from "../types/typeCommen";
import { PostViewModelT, PostInputModelT, PostViewModelTdb } from "../types/typePosts";
import "reflect-metadata"



@injectable()
export class RepositoryPosts {
  async creatPosts(body: PostViewModelTdb): Promise<void> {
    await postModel.insertMany(body);
  }
  async createCommentPost(body: CommentViewModelDb): Promise<void> {
    await commentModel.insertMany(body);
  }
  async createLikeInfoMetaDataComment(body: CommentLikeT): Promise<void> {
    await likesModule.insertMany(body);
  }
  async postLikeDislikeInComment(body: CommentLikeT) {
    await likesModule.insertMany(body);
  }
  async addLikeDislikeInPosts(body: PostLikeT) {
    await likesModulePosts.insertMany(body);
  }
  async updateLikeStatusInComment(userId: string, likeStatus: string, commentId: string) {
    await likesModule.updateOne({ userID: userId, commentId: commentId }, { $set: { status: likeStatus } });
  }
  async updateLikeStatusInPosts(userId: string, likeStatus: string, postId: string) {
    await likesModulePosts.updateOne({ userID: userId, postId: postId }, { $set: { status: likeStatus } });
  }
  async findCommentPosts(id: string, userId: string): Promise<CommentViewModel | null> {
    const result = await commentModel.findOne({ _id: id });
    if (!result) {
      return null;
    }
    let status;
    if (userId === "null") {
      status = statusCommentLike.None;
    } else {
      const findUserStatusLike = await likesModule.findOne({ userID: userId, commentId: id });
      status = findUserStatusLike?.status || statusCommentLike.None;
    }

    const dislikesCount = await likesModule.countDocuments({ commentId: id, status: statusCommentLike.Dislike });
    const likesCount = await likesModule.countDocuments({ commentId: id, status: statusCommentLike.Like });

    const mapData: CommentViewModel = {
      id: result._id,
      commentatorInfo: {
        userId: result.commentatorInfo.userId,
        userLogin: result.commentatorInfo.userLogin,
      },
      content: result.content,
      createdAt: result.createdAt,
      likesInfo: {
        dislikesCount: dislikesCount,
        likesCount: likesCount,
        myStatus: status,
      },
    };

    return mapData;
  }
  async updatCommentPosts(body: CommentInputModel, id: string): Promise<void> {
    await commentModel.updateOne({ _id: id }, { $set: { content: body.content } });
  }
  async findLikeDislakeComment(userID: string, commentId: string) {
    try {
      const res = await likesModule.findOne({ userID: userID, commentId: commentId });
      if (!res) {
        return false;
      }

      return true

    } catch (error) {

      return null
    }


  }
  async findLikeDislakePost(userID: string, postId: string): Promise<PostLikeT | boolean> {
    try {
      const res = await likesModulePosts.findOne({ userID: userID, postId: postId });
      if (!res) {
        return false;
      }
      return true;
    } catch {
      return false

    }

  }
  async findPosts(id: string): Promise<any | null> {
    const result = await postModel.findOne({ _id: id });
    if (!result) {
      return null;
    }
    return {
      id: result._id,
      title: result.title,
      shortDescription: result.shortDescription,
      content: result.content,
      blogId: result.blogId,
      blogName: result.blogName,
      createdAt: result.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: statusCommentLike.None,
        newestLikes: []
      }
    };
  }
  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await postModel.updateOne(
      { _id: id },
      { $set: { content: body.content, blogId: body.blogId, shortDescription: body.shortDescription, title: body.title } }
    );
  }
  async deleteCommentPosts(id: string): Promise<void> {
    await postModel.deleteOne({ _id: id });
  }
  async deletePosts(id: string): Promise<void> {
    await postModel.deleteOne({ _id: id });
  }
}


