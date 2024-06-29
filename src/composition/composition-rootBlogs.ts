import { RouterBlogs } from "../classRouter/RouterBlogs";
import { QreposttoryBlogs } from "../repository/qreposttoryBlogs";
import { RepositoryBlogs } from "../repository/repositoryBlogs";
import { BlogsService } from "../services/blogs-service";
import { postservice } from "./composition-rootPosts";

export const repositoryBlogs = new RepositoryBlogs();
export const blogsService = new BlogsService(repositoryBlogs);
export const qreposttoryBlogs = new QreposttoryBlogs()
export const controllerBlogs = new RouterBlogs(blogsService, postservice, qreposttoryBlogs);
