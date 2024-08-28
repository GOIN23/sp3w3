import { SortDirection } from "mongodb";
import { likesModulePosts, postModel } from "../mongoose/module";
import { BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { PaginatorPosts, PostViewModelLiKeArray, PostViewModelT, PostViewModelTdb } from "../types/typePosts";
import { statusCommentLike } from "../types/typeCommen";

export class QreposttoryPosts {
  async getPosts(query: any, userId?: string): Promise<PaginatorPosts | { error: string }> {
    const search = query.searchNameTerm ? { title: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: PostViewModelTdb[] = await postModel
        .find({})
        .sort({ [query.sortBy]: query.sortDirection as SortDirection })
        .skip((+query.pageNumber - 1) * +query.pageSize)
        .limit(+query.pageSize);

      const totalCount = await postModel.countDocuments(filter);

      async function mapPosts(items: PostViewModelTdb[]): Promise<PostViewModelLiKeArray[]> {
        const promises = items.map(async (post: PostViewModelTdb) => {
          const dislikesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Dislike" });
          const likesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Like" });
          const userLikeStatus = await likesModulePosts.findOne({ postId: post._id, userID: userId })

          const newestLikes = await likesModulePosts.find({ postId: post._id, status: "Like" }).lean()


          let countingUserLikes: any
          if (newestLikes.length === 1) {
            countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }]

          } else if (newestLikes.length === 2) {
            countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }]

          } else if (newestLikes.length === 3) {
            countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }, { addedAt: newestLikes[newestLikes.length - 3].createdAt, userId: newestLikes[newestLikes.length - 3].userID, login: newestLikes[newestLikes.length - 3].login }]

          } else if (newestLikes.length > 3) {
            countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }, { addedAt: newestLikes[newestLikes.length - 3].createdAt, userId: newestLikes[newestLikes.length - 3].userID, login: newestLikes[newestLikes.length - 3].login }]

          } else if (newestLikes.length === 0) {
            countingUserLikes = []
          }

          let resultStatus
          if (!userLikeStatus) {
            resultStatus = statusCommentLike.None
          } else {
            resultStatus = userLikeStatus!.status
          }


          return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
              likesCount: likesCount,
              dislikesCount: dislikesCount,
              myStatus: resultStatus,
              newestLikes: countingUserLikes
            }


          };
        })


        const userMapData = await Promise.all(promises)

        return userMapData;
      }

      const commentMap = await mapPosts(items);



      return {
        pagesCount: Math.ceil(totalCount / +query.pageSize),
        page: +query.pageNumber,
        pageSize: +query.pageSize,
        totalCount,
        items: commentMap,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  }

  async getPostsById(userId: string, postId: string) {

    const result = await postModel.findOne({ _id: postId });
    if (!result) {
      return null;
    }
    async function mapPost(post: PostViewModelTdb): Promise<PostViewModelLiKeArray> {


      const dislikesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Dislike" });
      const likesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Like" });
      const userLikeStatus = await likesModulePosts.findOne({ postId: post._id, userID: userId })

      const newestLikes = await likesModulePosts.find({ postId: post._id, status: "Like" }).lean()


      let countingUserLikes: any
      if (newestLikes.length === 1) {
        countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }]

      } else if (newestLikes.length === 2) {
        countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }]

      } else if (newestLikes.length === 3) {
        countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }, { addedAt: newestLikes[newestLikes.length - 3].createdAt, userId: newestLikes[newestLikes.length - 3].userID, login: newestLikes[newestLikes.length - 3].login }]

      } else if (newestLikes.length > 3) {
        countingUserLikes = [{ addedAt: newestLikes[newestLikes.length - 1].createdAt, userId: newestLikes[newestLikes.length - 1].userID, login: newestLikes[newestLikes.length - 1].login }, { addedAt: newestLikes[newestLikes.length - 2].createdAt, userId: newestLikes[newestLikes.length - 2].userID, login: newestLikes[newestLikes.length - 2].login }, { addedAt: newestLikes[newestLikes.length - 3].createdAt, userId: newestLikes[newestLikes.length - 3].userID, login: newestLikes[newestLikes.length - 3].login }]

      } else if (newestLikes.length === 0) {
        countingUserLikes = []
      }

      let resultStatus
      if (!userLikeStatus) {
        resultStatus = statusCommentLike.None
      } else {
        resultStatus = userLikeStatus!.status
      }




      return {
        id: post._id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: resultStatus,
          newestLikes: countingUserLikes
        }


      };
    }

    const commentMap = await mapPost(result);


    return commentMap


  }
}

