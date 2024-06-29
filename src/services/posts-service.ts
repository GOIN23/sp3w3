import { ObjectId } from "mongodb";
import { CommentInputModel, CommentLikeT, CommentViewModel, CommentViewModelDb, statusCommentLike } from "../types/typeCommen";
import { PostInputModelT, PostViewModelT, PostViewModelTdb } from "../types/typePosts";
import { generateRandomString } from "../utilt/randomText";
import { UserViewModel } from "../types/typeUser";
import { RepositoryPosts } from "../repository/repositoryPosts";




export class PostsService {
  constructor(protected repositoryPosts: RepositoryPosts) { }

  async creatPosts(body: PostInputModelT, id?: string): Promise<PostViewModelT | null> {
    const newPosts: PostViewModelTdb = {
      _id: String(new ObjectId()),
      title: body.title,
      shortDescription: body.shortDescription,
      blogId: body.blogId,
      blogName: generateRandomString(2),
      content: body.content,
      createdAt: new Date().toISOString(),
    };

    if (id) {
      newPosts.blogId = id;
    }

    await this.repositoryPosts.creatPosts(newPosts);

    const newFindPost = await this.findPosts(newPosts._id);

    return newFindPost;
  }
  async createCommentPost(body: CommentInputModel, user: UserViewModel, IdPost: string): Promise<CommentViewModel | null> {
    const newCommentPosts: CommentViewModelDb = {
      _id: String(new ObjectId()),
      content: body.content,
      commentatorInfo: {
        userId: user._id,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        dislikesCount: 0,
        likesCount: 0,
        myStatus: statusCommentLike.None,
      },
      IdPost,
    };

    const likeInfoMetaData: CommentLikeT = {
      _id: String(new ObjectId()),
      commentId: newCommentPosts._id,
      createdAt: new Date().toISOString(),
      status: statusCommentLike.None,
      userID: user._id,
    };

    await this.repositoryPosts.createCommentPost(newCommentPosts);
    await this.repositoryPosts.createLikeInfoMetaDataComment(likeInfoMetaData);


    return {
      id: newCommentPosts._id,
      commentatorInfo: newCommentPosts.commentatorInfo,
      content: newCommentPosts.content,
      createdAt: newCommentPosts.createdAt,
      likesInfo: newCommentPosts.likesInfo,
    };
  }
  async findCommentPosts(commentId: string, userId?: string): Promise<CommentViewModel | null> {
    if (!userId) {
      userId = "null";
    }
    const resul = await this.repositoryPosts.findCommentPosts(commentId, userId);

    return resul;
  }
  async updateCommentPosts(body: CommentInputModel, id: string): Promise<void> {
    await this.repositoryPosts.updatCommentPosts(body, id);
  }
  async updateCommentPostsLikeDeslike(likeStatus: statusCommentLike, commentId: string, userId: string) {
    const fintLikeDislake = await this.repositoryPosts.findLikeDislake(userId, commentId);

    if (!fintLikeDislake) {
      const likeInfoMetaData: CommentLikeT = {
        _id: String(new ObjectId()),
        commentId: commentId,
        createdAt: new Date().toISOString(),
        status: likeStatus,
        userID: userId,
      };

      await this.repositoryPosts.postLikeDislikeInComment(likeInfoMetaData);
      return;
    }

    await this.repositoryPosts.updateLikeStatusInComment(userId, likeStatus, commentId);
  }
  async findPosts(id: string): Promise<PostViewModelT | null> {
    return await this.repositoryPosts.findPosts(id);
  }
  async updatPosts(body: PostInputModelT, id: string): Promise<void> {
    await this.repositoryPosts.updatPosts(body, id);
  }
  async deleteCommentPosts(id: string): Promise<void> {
    await this.repositoryPosts.deleteCommentPosts(id);
  }
  async deletePosts(id: string): Promise<void> {
    await this.repositoryPosts.deletePosts(id);
  }
}









// export const postsService = {
//   async creatPosts(body: PostInputModelT, id?: string): Promise<PostViewModelT | null> {
//     const newPosts: PostViewModelTdb = {
//       _id: String(new ObjectId()),
//       title: body.title,
//       shortDescription: body.shortDescription,
//       blogId: body.blogId,
//       blogName: generateRandomString(2),
//       content: body.content,
//       createdAt: new Date().toISOString(),
//     };

//     if (id) {
//       newPosts.blogId = id;
//     }

//     await repositoryPosts.creatPosts(newPosts);

//     const newFindPost = await this.findPosts(newPosts._id);

//     return newFindPost;
//   },
//   async createCommentPost(body: CommentInputModel, user: UserViewModel, IdPost: string): Promise<CommentViewModel | null> {
//     const newCommentPosts: CommentViewModelDb = {
//       _id: String(new ObjectId()),
//       content: body.content,
//       commentatorInfo: {
//         userId: user._id,
//         userLogin: user.login,
//       },
//       createdAt: new Date().toISOString(),
//       likesInfo: {
//         dislikesCount: 0,
//         likesCount: 0,
//         myStatus: statusCommentLike.None,
//       },
//       IdPost,
//     };

//     const likeInfoMetaData: CommentLikeT = {
//       _id: String(new ObjectId()),
//       commentId: newCommentPosts._id,
//       createdAt: new Date().toISOString(),
//       status: statusCommentLike.None,
//       userID: user._id,
//     };

//     await repositoryPosts.createCommentPost(newCommentPosts);
//     await repositoryPosts.createLikeInfoMetaDataComment(likeInfoMetaData);


//     return {
//       id: newCommentPosts._id,
//       commentatorInfo: newCommentPosts.commentatorInfo,
//       content: newCommentPosts.content,
//       createdAt: newCommentPosts.createdAt,
//       likesInfo: newCommentPosts.likesInfo,
//     };
//   },
//   async findCommentPosts(commentId: string, userId?: string): Promise<CommentViewModel | null> {
//     if (!userId) {
//       userId = "null";
//     }
//     const resul = await repositoryPosts.findCommentPosts(commentId, userId);

//     return resul;
//   },
//   async updateCommentPosts(body: CommentInputModel, id: string): Promise<void> {
//     await repositoryPosts.updatCommentPosts(body, id);
//   },
//   async updateCommentPostsLikeDeslike(likeStatus: statusCommentLike, commentId: string, userId: string) {
//     const fintLikeDislake = await repositoryPosts.findLikeDislake(userId, commentId);

//     if (!fintLikeDislake) {
//       const likeInfoMetaData: CommentLikeT = {
//         _id: String(new ObjectId()),
//         commentId: commentId,
//         createdAt: new Date().toISOString(),
//         status: likeStatus,
//         userID: userId,
//       };

//       await repositoryPosts.postLikeDislikeInComment(likeInfoMetaData);
//       return;
//     }

//     await repositoryPosts.updateLikeStatusInComment(userId, likeStatus, commentId);
//   },
//   async findPosts(id: string): Promise<PostViewModelT | null> {
//     return await repositoryPosts.findPosts(id);
//   },
//   async updatPosts(body: PostInputModelT, id: string): Promise<void> {
//     await repositoryPosts.updatPosts(body, id);
//   },
//   async deleteCommentPosts(id: string): Promise<void> {
//     await repositoryPosts.deleteCommentPosts(id);
//   },
//   async deletePosts(id: string): Promise<void> {
//     await repositoryPosts.deletePosts(id);
//   },
// };
