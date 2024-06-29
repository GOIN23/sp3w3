import { commentModel, likesModule, postModel } from "../mongoose/module";
import { CommentInputModel, CommentLikeT, CommentViewModel, CommentViewModelDb, statusCommentLike } from "../types/typeCommen";
import { PostViewModelT, PostInputModelT, PostViewModelTdb } from "../types/typePosts";




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
  async updateLikeStatusInComment(userId: string, likeStatus: string, commentId: string) {
    await likesModule.updateOne({ userID: userId, commentId: commentId }, { $set: { status: likeStatus } });
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
  async findLikeDislake(userID: string, commentId: string) {
    const res = await likesModule.findOne({ userID: userID, commentId: commentId });

    if (!res) {
      return false;
    }

    return true;
  }
  async findPosts(id: string): Promise<PostViewModelT | null> {
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


