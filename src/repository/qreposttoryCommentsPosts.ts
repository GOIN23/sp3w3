import { dbT } from "../db/mongo-.db";
import { Paginator, qureT } from "../types/generalType";
import { SortDirection } from "mongodb";
import { CommentViewModel, CommentViewModelDb, commenQu } from "../types/typeCommen";

export const qreposttoryCommentsPosts = {
  async getCommentPosts(IdPost: string, query: commenQu): Promise<Paginator<CommentViewModel> | { error: string }> {
    const filter = { IdPost };
    

    try {
      const items: CommentViewModelDb[] = (await dbT
        .getCollections()
        .commentCollection.find(filter)
        .sort(query.sortBy, query.sortDirection as SortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().commentCollection.countDocuments(filter);

      const userMapData: CommentViewModel[] = items.map((comment: CommentViewModelDb) => {
        return {
          id: comment._id,
          commentatorInfo: comment.commentatorInfo,
          content: comment.content,
          createdAt: comment.createdAt,
        };
      });

      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: userMapData,
      };
    } catch (e) {
      return { error: "some error" };
    }
  },
};
