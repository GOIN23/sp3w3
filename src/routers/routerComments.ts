import { determinIngUserLikeStatusMiddleware } from "./../utilt/determiningUserLikeStatus";
import express from "express";
import { validaCommentLikeDeslik, validaCommentPost } from "../validation/validationsPostst";
import { validaError } from "../validation/generalvValidation";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { authTokenAccessTokenMiddleware } from "../auth/authTokenAccessTokenMiddleware";
import { container } from "../composition/composition-rootComments";
import { RouterComments } from "../classRouter/RouterComments";





const controllerCommmentsIoc = container.resolve(RouterComments)



export const routerComments = () => {
  const router = express.Router();

  router.get("/:id", determinIngUserLikeStatusMiddleware, controllerCommmentsIoc.getByIdCommentst.bind(controllerCommmentsIoc));

  router.put("/:id", authTokenMiddleware, validaCommentPost, validaError, controllerCommmentsIoc.putComment.bind(controllerCommmentsIoc));

  router.put("/:id/like-status", authTokenAccessTokenMiddleware, validaCommentLikeDeslik, validaError, controllerCommmentsIoc.commentLikeStatus.bind(controllerCommmentsIoc));

  router.delete("/:id", authTokenMiddleware, controllerCommmentsIoc.deleteComment.bind(controllerCommmentsIoc));

  return router;
}
