import { qureT } from "./../types/generalType";
import { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { validationResult } from "express-validator";
import { errorValid } from "../utilt/errors";
import { QreposttoryBlogs } from "../repository/qreposttoryBlogs";
import { PostsService } from "../services/posts-service";
import { BlogsService } from "../services/blogs-service";

export class RouterBlogs {
  constructor(protected blogsService: BlogsService, protected postsService: PostsService, protected qreposttoryBlogs:QreposttoryBlogs) { }
  async getBlogs(req: Request<{}, {}, {}, qureT>, res: Response) {
    let result = await this.qreposttoryBlogs.getBlogs(req.query);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
    return;
  }
  async creatBlogs(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }

    let newBlog = await this.blogsService.createBlogs(req.body);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newBlog);
  }
  async creatPosts(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }
    let result = await this.blogsService.findBlogs(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    let newBlog = await this.postsService.creatPosts(req.body, req.params.id);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newBlog);
  }
  async getIdBlogs(req: Request, res: Response) {
    let result = await this.blogsService.findBlogs(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }
    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
  }
  async getIdPosts(req: Request, res: Response) {
    let result = await this.blogsService.findBlogs(req.params.id);

    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    const resultq = await this.qreposttoryBlogs.getBlogsPosts(req.query, req.params.id);

    res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(resultq);
  }
  async updateBlogs(req: Request, res: Response) {
    let result = await this.blogsService.findBlogs(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json(errorValid(errors.array({ onlyFirstError: true })));
      return;
    }

    await this.blogsService.updatBlogs(req.body, req.params.id);
    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  }
  async deleteBlogs(req: Request, res: Response) {
    let result = await this.blogsService.findBlogs(req.params.id);
    if (!result) {
      res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
      return;
    }

    await this.blogsService.deleteBlogs(req.params.id);

    res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    return;
  }
}
