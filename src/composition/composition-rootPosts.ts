import { RouterPosts } from "../classRouter/RouterPosts";
import { QreposttoryCommentsPosts } from "../repository/qreposttoryCommentsPosts";
import { QreposttoryPosts } from "../repository/qreposttoryPosts";
import { RepositoryPosts } from "../repository/repositoryPosts";
import { RepositoryUsers } from "../repository/repostiryUsers";
import { PostsService } from "../services/posts-service";
import { UsersService } from "../services/users-service";




export const repositoryPosts = new RepositoryPosts();
export const postservice = new PostsService(repositoryPosts);
export const qreposttoryPosts = new QreposttoryPosts()
export const qreposttoryCommentsPosts = new QreposttoryCommentsPosts()
const repositoryUsers = new RepositoryUsers()
const usersService = new UsersService(repositoryUsers)
export const controllerPosts = new RouterPosts(postservice, qreposttoryPosts, qreposttoryCommentsPosts,usersService);
