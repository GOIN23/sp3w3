import { Paginator } from "../types/generalType";
import { CommentViewModel, CommentViewModelDb, commenQu, statusCommentLike } from "../types/typeCommen";
import { commentModel, likesModule } from "../mongoose/module";



export class QreposttoryCommentsPosts {
  async getCommentPosts(IdPost: string, query: commenQu, userId?: string): Promise<Paginator<CommentViewModel> | { error: string }> {
    const filter = { IdPost };

    try {
      const items: CommentViewModelDb[] = await commentModel
        .find(filter)
        .sort({ [query.sortBy]: query.sortDirection === "asc" ? 1 : -1 })
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize);

      const totalCount = await commentModel.countDocuments(filter);

      async function mapComments(items: CommentViewModelDb[]): Promise<CommentViewModel[]> {
        const promises = items.map(async (comment: CommentViewModelDb) => {
          const dislikesCount = await likesModule.countDocuments({ commentId: comment._id, status: "Dislike" });
          const likesCount = await likesModule.countDocuments({ commentId: comment._id, status: "Like" });
          const userLikeStatus = await likesModule.findOne({ commentId: comment._id, userID: userId })
          let resultStatus
          if (!userLikeStatus) {
            resultStatus = statusCommentLike.None
          } else {
            resultStatus = userLikeStatus!.status
          }


          return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: {
              userId: comment.commentatorInfo.userId,
              userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
              dislikesCount,
              likesCount,
              myStatus: resultStatus,
            },
          };
        })


        const userMapData = await Promise.all(promises)

        return userMapData;
      }

      const commentMap = await mapComments(items);

      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: commentMap,
      };
    } catch (e) {
      return { error: "some error" };
    }
  }
}





