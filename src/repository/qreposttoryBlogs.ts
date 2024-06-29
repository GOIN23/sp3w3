import { PostViewModelT, PostViewModelTdb } from "./../types/typePosts";
import { dbT } from "../db/mongo-.db";
import { qureT } from "../types/generalType";
import { BlogViewModelDbT, BlogViewModelT, PaginatorBlog } from "../types/typeBlog";
import { SortDirection } from "mongodb";
import { PaginatorPosts } from "../types/typePosts";
import { blogModel, postModel } from "../mongoose/module";


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

  async getBlogsPosts(query: any, id: string): Promise<PaginatorPosts | { error: string }> {
    const search = query.searchNameTerm ? { name: { $regex: query.searchNameTerm, $options: "i" } } : {};
    const blogId = id;
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
  }
}





