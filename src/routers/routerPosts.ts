import express, { Request, Response } from "express";
import {
  validaCommentPost,
  validaContentPosts,
  validaShortDescriptionPosts,
  validaTitlePosts,
  validablogIdPosts,
  validablogIdPostsCustm,
} from "../validation/validationsPostst";
import { authMiddleware } from "../auth/authMiddleware";
import { validaError, validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection } from "../validation/generalvValidation";

import { authTokenAccessTokenMiddleware } from "../auth/authTokenAccessTokenMiddleware";
import { determinIngUserLikeStatusMiddleware } from "../utilt/determiningUserLikeStatus";
import { controllerPosts } from "../composition/composition-rootPosts";

export const routerPosts = () => {
  const router = express.Router();

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaQureSortBy,
    controllerPosts.getPosts.bind(controllerPosts)
  );

  router.post(
    "/",
    authMiddleware,
    validaTitlePosts,
    validaShortDescriptionPosts,
    validaContentPosts,
    validablogIdPosts,
    validablogIdPostsCustm,
    controllerPosts.creatPosts.bind(controllerPosts)
  );

  router.post("/:id/comments", authTokenAccessTokenMiddleware, validaCommentPost, validaError,
    controllerPosts.creatComments.bind(controllerPosts));

  //@ts-ignore
  router.get("/:id/comments", determinIngUserLikeStatusMiddleware, validaQurePageSezi, validaQureipageNumber, validaQureSortBy, validaQursortDirection, controllerPosts.getComments.bind(controllerPosts));

  router.get("/:id", controllerPosts.getPostsById.bind(controllerPosts));

  router.put(
    "/:id",
    authMiddleware,
    validaTitlePosts,
    validaShortDescriptionPosts,
    validaContentPosts,
    validablogIdPosts,
    validablogIdPostsCustm,
    controllerPosts.putPostById.bind(controllerPosts)
  );

  router.delete("/:id", authMiddleware, controllerPosts.deletePost.bind(controllerPosts));

  return router;
};
