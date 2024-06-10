import { dbT } from "../db/mongo-.db";
import { commentModel, postModel } from "../mongoose/module";
import { CommentInputModel, CommentViewModel, CommentViewModelDb } from "../types/typeCommen";
import { PostViewModelT, PostInputModelT, PostViewModelTdb } from "../types/typePosts";

export const repositoryPosts = {
  async creatPosts(body: PostViewModelTdb): Promise<void> {
    await postModel.insertMany(body);
  },
  async createCommentPost(body: CommentViewModelDb): Promise<void> {
    await commentModel.insertMany(body);
  },
  async findCommentPosts(id: string): Promise<CommentViewModel | null> {
    const result = await commentModel.findOne({ _id: id });
    if (!result) {
      return null;
    }
    const mapData: CommentViewModel = {
      id: result._id,
      commentatorInfo: {
        userId: result.commentatorInfo.userId,
        userLogin: result.commentatorInfo.userLogin,
      },
      content: result.content,
      createdAt: result.createdAt,
    };

    return mapData;
  },
  async updatCommentPosts(body: CommentInputModel, id: string): Promise<void> {
    await commentModel.updateOne({ _id: id }, { $set: { content: body.content } });
  },
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
  },
  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await postModel.updateOne(
      { _id: id },
      { $set: { content: body.content, blogId: body.blogId, shortDescription: body.shortDescription, title: body.title } }
    );
  },
  async deleteCommentPosts(id: string): Promise<void> {
    await postModel.deleteOne({ _id: id });
  },
  async deletePosts(id: string): Promise<void> {
    await postModel.deleteOne({ _id: id });
  },
};
