import { dbT } from "../db/mongo-.db";
import { BlogInputModelT, BlogViewModelT } from "../types/typeBlog";

export const repositoryBlogs = {
  async createBlogs(newBlog: BlogViewModelT): Promise<any> {
    await dbT.getCollections().blogCollection.insertOne(newBlog);
  },
  async findBlogs(id: string): Promise<BlogViewModelT | null> {
    const result = await dbT.getCollections().blogCollection.findOne({ id: id }, { projection: { _id: 0 } });
    if (!result) {
      return null;
    }
    return result;
  },
  async updatBlogs(body: BlogInputModelT, id: string): Promise<void> {
    await dbT.getCollections().blogCollection.updateOne({ id: id }, { $set: { name: body.name, description: body.description, websiteUrl: body.websiteUrl } });
  },
  async deleteBlogs(id: string): Promise<void> {
    await dbT.getCollections().blogCollection.deleteOne({ id: id });
  },
};
