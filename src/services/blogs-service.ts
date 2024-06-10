import { ObjectId } from "mongodb";
import { repositoryBlogs } from "../repository/repositoryBlogs";
import { BlogInputModelT, BlogViewModelDbT, BlogViewModelT, dbBl } from "../types/typeBlog";

export const blogsService = {
  async createBlogs(body: BlogInputModelT): Promise<BlogViewModelT | null> {
    const newBlog: BlogViewModelDbT = {
      _id: String(new ObjectId()),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    await repositoryBlogs.createBlogs(newBlog);

    const newBLogFind = await this.findBlogs(newBlog._id);

    return newBLogFind;
  },
  async findBlogs(id: string): Promise<BlogViewModelT | null> {
    return await repositoryBlogs.findBlogs(id);
  },
  async updatBlogs(body: BlogInputModelT, id: string): Promise<void> {
    await repositoryBlogs.updatBlogs(body, id);
  },
  async deleteBlogs(id: string): Promise<void> {
    await repositoryBlogs.deleteBlogs(id);
  },
};
