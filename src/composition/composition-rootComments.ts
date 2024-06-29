import { RouterComments } from "../classRouter/RouterComments";
import { postservice } from "./composition-rootPosts";








export const controllerComments = new RouterComments(postservice)