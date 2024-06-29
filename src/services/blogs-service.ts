import { ObjectId } from "mongodb";
import { RepositoryBlogs } from "../repository/repositoryBlogs";
import { BlogInputModelT, BlogViewModelDbT, BlogViewModelT } from "../types/typeBlog";

export class BlogsService {
  constructor(protected repositoryBlogs: RepositoryBlogs) { }

  async createBlogs(body: BlogInputModelT): Promise<BlogViewModelT | null> {
    const newBlog: BlogViewModelDbT = {
      _id: String(new ObjectId()),
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };

    await this.repositoryBlogs.createBlogs(newBlog);

    const newBLogFind = await this.findBlogs(newBlog._id);

    return newBLogFind;
  }
  async findBlogs(id: string): Promise<BlogViewModelT | null> {
    return await this.repositoryBlogs.findBlogs(id);
  }
  async updatBlogs(body: BlogInputModelT, id: string): Promise<void> {
    await this.repositoryBlogs.updatBlogs(body, id);
  }
  async deleteBlogs(id: string): Promise<void> {
    await this.repositoryBlogs.deleteBlogs(id);
  }
}

