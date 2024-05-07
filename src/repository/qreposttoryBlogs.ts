import { PostViewModelT, PostViewModelTdb } from "./../types/typePosts";
import { dbT } from "../db/mongo-.db";
import { qureT } from "../types/generalType";
import { BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { SortDirection } from "mongodb";
import { PaginatorPosts } from "../types/typePosts";

export const qreposttoryBlogs = {
  async getBlogs(query: qureT): Promise<PaginatorBlog | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const filter = {
      ...search,
    };
    try {
      const items: any = (await dbT
        .getCollections()
        .blogCollection.find(filter, { projection: { _id: 0 } })
        .sort(query.sortBy, query.sortDirection as SortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().blogCollection.countDocuments(filter);

      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: items,
      };
    } catch (e) {
      return { error: "some error" };
    }
  },

  async getBlogsPosts(query: any, id: string): Promise<PaginatorPosts | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const blogId = id;
    const filter = {
      blogId,
      ...search,
    };
    try {
      const items: PostViewModelTdb[] = (await dbT
        .getCollections()
        .postCollection.find(filter)
        .sort(query.sortBy, query.sortDirection)
        .skip((query.pageNumber - 1) * query.pageSize)
        .limit(query.pageSize)
        .toArray()) as any[];

      const totalCount = await dbT.getCollections().postCollection.countDocuments(filter);

      const mapPosts: PostViewModelT[] = items.map((post: PostViewModelTdb) => {
        return {
          id: post._id,
          blogId: post.blogId,
          blogName: post.blogName,
          content: post.content,
          createdAt: post.createdAt,
          shortDescription: post.shortDescription,
          title: post.title,
        };
      });
      return {
        pagesCount: Math.ceil(totalCount / query.pageSize),
        page: query.pageNumber,
        pageSize: query.pageSize,
        totalCount,
        items: mapPosts,
      };
    } catch (e) {
      console.log(e);
      return { error: "some error" };
    }
  },
};
