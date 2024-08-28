import { QreposttoryPosts } from "../repository/qreposttoryPosts";
import express, { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { qureT } from "../types/generalType";
import { errorValid } from "../utilt/errors";
import { validationResult } from "express-validator";
import { UsersService } from "../services/users-service";
import { QreposttoryCommentsPosts, } from "../repository/qreposttoryCommentsPosts";
import { commenQu } from "../types/typeCommen";
import { PostsService } from "../services/posts-service";




export class RouterPosts {
    constructor(protected postsService: PostsService, protected qreposttoryPosts: QreposttoryPosts, protected qreposttoryCommentsPosts: QreposttoryCommentsPosts, protected usersService: UsersService) {

    }
    async getPosts(req: Request, res: Response) {
        let result = await this.qreposttoryPosts.getPosts(req.query, req.userId);
        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
        return;
    }

    async creatPosts(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(SETTINGS.HTTPCOD.HTTPCOD_400).json(errorValid(errors.array({ onlyFirstError: true })));
            return;
        }
        const newPosts = await this.postsService.creatPosts(req.body);

        res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newPosts);
        return;
    }

    async creatComments(req: Request, res: Response) {
        const post = await this.postsService.findPosts(req.params.id);
        const user = await this.usersService.findUsers(req.userId);


        if (!user) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
            return;
        }

        if (!post) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        const resulComment = await this.postsService.createCommentPost(req.body, user, post.id);

        res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(resulComment);
        return;
    }

    async getComments(req: Request<any, any, any, commenQu>, res: Response) {
        const post = await this.postsService.findPosts(req.params.id);

        if (!post) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        const commetns = await this.qreposttoryCommentsPosts.getCommentPosts(post.id, req.query, req.userId);
        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(commetns);
        return;
    }

    async getPostsById(req: Request, res: Response) {
        const result = await this.qreposttoryPosts.getPostsById(req.userId || 'null', req.params.id);


        if (!result) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
        return;
    }

    async putPostById(req: Request, res: Response) {
        let resilt = await this.postsService.findPosts(req.params.id);

        if (!resilt) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json(errorValid(errors.array({ onlyFirstError: true })));
            return;
        }

        await this.postsService.updatPosts(req.body, req.params.id);
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    }

    async putLikeStatusPosts(req: Request, res: Response) {
        const resul = await this.postsService.findPosts(req.params.id);


        if (!resul) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }
        await this.postsService.updatePostsLikeDeslike(req.body.likeStatus, req.params.id, req.userId || "null", req.userLogin || "null");

        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;


    }

    async deletePost(req: Request, res: Response) {
        let result = await this.postsService.findPosts(req.params.id);
        if (!result) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }
        await this.postsService.deletePosts(req.params.id);
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;
    }


}