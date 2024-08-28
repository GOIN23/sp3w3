import { PostViewModelLiKeArray, PostViewModelT, PostViewModelTdb } from "./../types/typePosts";
import { dbT } from "../db/mongo-.db";
import { qureT } from "../types/generalType";
import { BlogViewModelDbT, BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { SortDirection } from "mongodb";
import { PaginatorPosts } from "../types/typePosts";
import { blogModel, likesModulePosts, postModel } from "../mongoose/module";
import { statusCommentLike } from "../types/typeCommen";


export class QreposttoryBlogs {
  async getBlogs(query: qureT): Promise<PaginatorBlog | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: BlogViewModelDbT[] = await blogModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection as SortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);

      const totalCount = await blogModel.countDocuments(filter);

      const mapBlogs: BlogViewModelT[] = items.map((blog: BlogViewModelDbT) => {
        return {
          id: blog._id,
          createdAt: blog.createdAt,
          description: blog.description,
          isMembership: blog.isMembership,
          name: blog.name,
          websiteUrl: blog.websiteUrl,
        };
      });
      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: mapBlogs,
      };
    } catch (e) {
      return { error: "some error" };
    }
  }

  async getBlogsPosts(query: any, blogid: string,userid:string): Promise<PaginatorPosts | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const blogId = blogid;
    const filter = {
      blogId,
      ...search,
    };
    try {
      const items: PostViewModelTdb[] = await postModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection as SortDirection })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);

      const totalCount = await postModel.countDocuments(filter);


      async function mapPosts(items: PostViewModelTdb[]): Promise<PostViewModelLiKeArray[]> {
        const promises = items.map(async (post: PostViewModelTdb) => {
          const dislikesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Dislike" });
          const likesCount = await likesModulePosts.countDocuments({ postId: post._id, status: "Like" });
          const userLikeStatus = await likesModulePosts.findOne({ postId: post._id, userID: userid })

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
          //@ts-ignore

        return userMapData;
      }

      const rusultPosts = await mapPosts(items)



      console.log(rusultPosts)
      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: rusultPosts,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  }
}





