import express from "express";
import { routerBlogs } from "./routers/routerBlogs";
import { routerPosts } from "./routers/routerPosts";
import { routerDeletDate } from "./routers/routerDeleteDate";
import { SETTINGS } from "./seting/seting";
import { routerUsers } from "./routers/routerUsers";
import { routerAuth } from "./routers/routerAuth";
import { routerComments } from "./routers/routerComments";

export const app = express();

app.use(express.json());
app.use(SETTINGS.PATH.BLOGS, routerBlogs());
app.use(SETTINGS.PATH.POSTS, routerPosts());
app.use(SETTINGS.PATH.USERS, routerUsers())
app.use(SETTINGS.PATH.COMMENTES, routerComments())
app.use(SETTINGS.PATH.AUTH, routerAuth());
app.use(SETTINGS.PATH.ALLDATA, routerDeletDate());

