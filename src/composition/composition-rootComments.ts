import "reflect-metadata"
import { Container } from "inversify";
import { RouterComments } from "../classRouter/RouterComments";
import { RepositoryPosts } from "../repository/repositoryPosts";
import { PostsService } from "../services/posts-service";
import { postservice } from "./composition-rootPosts";








// export const controllerComments = new RouterComments(postservice)




export const container = new Container();
container.bind<RouterComments>(RouterComments).to(RouterComments);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<RepositoryPosts>(RepositoryPosts).to(RepositoryPosts);