import { RouterBlogs } from "../classRouter/RouterBlogs";
import { QreposttoryBlogs } from "../repository/qreposttoryBlogs";
import { QreposttoryPosts } from "../repository/qreposttoryPosts";
import { RepositoryBlogs } from "../repository/repositoryBlogs";
import { BlogsService } from "../services/blogs-service";
import { postservice } from "./composition-rootPosts";

export const repositoryBlogs = new RepositoryBlogs();
export const blogsService = new BlogsService(repositoryBlogs);
export const qreposttoryBlogs = new QreposttoryBlogs()
const qreposttoryPosts = new QreposttoryPosts()
export const controllerBlogs = new RouterBlogs(blogsService, postservice, qreposttoryBlogs, qreposttoryPosts);
