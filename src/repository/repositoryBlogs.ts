import { dbT } from "../db/mongo-.db";
import { blogModel } from "../mongoose/module";
import { BlogInputModelT, BlogViewModelDbT, BlogViewModelT } from "../types/typeBlog";

export const repositoryBlogs = {
  async createBlogs(newBlog: BlogViewModelDbT): Promise<void> {
    await blogModel.insertMany(newBlog);
  },
  async findBlogs(id: string): Promise<BlogViewModelT | null> {
    const result = await blogModel.findOne({ _id: id }).lean();
    if (!result) {
      return null;
    }
    return {
      id: result._id,
      createdAt: result.createdAt,
      description: result.description,
      isMembership: result.isMembership,
      name: result.name,
      websiteUrl: result.websiteUrl,
    };
  },
  async updatBlogs(body: BlogInputModelT, id: string): Promise<void> {
    await blogModel.updateOne({ _id: id }, { $set: { name: body.name, description: body.description, websiteUrl: body.websiteUrl } });
  },
  async deleteBlogs(id: string): Promise<void> {
    await blogModel.deleteOne({ _id: id });
  },
};
