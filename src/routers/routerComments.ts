import { determinIngUserLikeStatusMiddleware } from "./../utilt/determiningUserLikeStatus";
import express from "express";
import { validaCommentLikeDeslik, validaCommentPost } from "../validation/validationsPostst";
import { validaError } from "../validation/generalvValidation";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { authTokenAccessTokenMiddleware } from "../auth/authTokenAccessTokenMiddleware";
import { controllerComments } from "../composition/composition-rootComments";









export const routerComments = () => {
  const router = express.Router();

  router.get("/:id", determinIngUserLikeStatusMiddleware, controllerComments.getByIdCommentst.bind(controllerComments));

  router.put("/:id", authTokenMiddleware, validaCommentPost, validaError, controllerComments.putComment.bind(controllerComments));

  router.put("/:id/like-status", authTokenAccessTokenMiddleware, validaCommentLikeDeslik, validaError, controllerComments.commentLikeStatus.bind(controllerComments));

  router.delete("/:id", authTokenMiddleware, controllerComments.deleteComment.bind(controllerComments));

  return router;
};
