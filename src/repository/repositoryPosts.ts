import { dbT } from "../db/mongo-.db";
import { CommentInputModel, CommentViewModel, CommentViewModelDb } from "../types/typeCommen";
import { PostViewModelT, PostInputModelT, PostViewModelTdb } from "../types/typePosts";

export const repositoryPosts = {
  async creatPosts(body: PostViewModelTdb): Promise<void> {
    await dbT.getCollections().postCollection.insertOne(body);
  },
  async createCommentPost(body: CommentViewModelDb): Promise<void> {
    await dbT.getCollections().commentCollection.insertOne(body);
  },
  async findCommentPosts(id: string): Promise<CommentViewModel | null> {
    const result = await dbT.getCollections().commentCollection.findOne({ _id: id });
    if (!result) {
      return null;
    }
    const mapData: CommentViewModel = {
      id: result._id,
      commentatorInfo: result.commentatorInfo,
      content: result.content,
      createdAt: result.createdAt,
    };

    return mapData;
  },
  async updatCommentPosts(body: CommentInputModel, id: string): Promise<void> {
    await dbT.getCollections().commentCollection.updateOne({ _id: id }, { $set: { content: body.content } });
  },

  async findPosts(id: string): Promise<PostViewModelT | null> {
    const result = await dbT.getCollections().postCollection.findOne({ _id: id });
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
    await dbT
      .getCollections()
      .postCollection.updateOne(
        { _id: id },
        { $set: { content: body.content, blogId: body.blogId, shortDescription: body.shortDescription, title: body.title } }
      );
  },

  async deleteCommentPosts(id: string): Promise<void> {
    await dbT.getCollections().commentCollection.deleteOne({ _id: id });
  },
  async deletePosts(id: string): Promise<void> {
    await dbT.getCollections().postCollection.deleteOne({ _id: id });
  },
};
