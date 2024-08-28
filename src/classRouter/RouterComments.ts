import { injectable } from "inversify";
import { PostsService } from "../services/posts-service";
import { SETTINGS } from "../seting/seting";
import { Request, Response } from "express";
import "reflect-metadata"





@injectable()
export class RouterComments {
    constructor(protected postsService: PostsService) {}

    async getByIdCommentst(req: Request, res: Response) {
        const result = await this.postsService.findCommentPosts(req.params.id, req.userId);




        if (!result) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
        return;
    }

    async putComment(req: Request, res: Response) {
        const resul = await this.postsService.findCommentPosts(req.params.id);

        if (!resul) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        if (resul.commentatorInfo.userId !== req.userId) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_403);
            return;
        }

        await this.postsService.updateCommentPosts(req.body, req.params.id);

        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;
    }

    async commentLikeStatus(req: Request, res: Response) {
        const resul = await this.postsService.findCommentPosts(req.params.id);

        if (!resul) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }
        await this.postsService.updateCommentPostsLikeDeslike(req.body.likeStatus, req.params.id, req.userId || "null");

        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;
    }

    async deleteComment(req: Request, res: Response) {
        const resul = await this.postsService.findCommentPosts(req.params.id);

        if (!resul) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        if (resul.commentatorInfo.userId !== req.userId) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_403);
            return;
        }

        await this.postsService.deleteCommentPosts(req.params.id);

        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;
    }
}