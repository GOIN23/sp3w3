import express from "express";
import { validaDescriptionBlogs, validaNameBlogs, validaWebsiteUrlBlogs } from "../validation/validationBlogs";
import { authMiddleware } from "../auth/authMiddleware";
import { validaContentPosts, validaShortDescriptionPosts, validaTitlePosts } from "../validation/validationsPostst";
import { validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection, validaSearchNameTerm } from "../validation/generalvValidation";
import { controllerBlogs } from "../composition/composition-rootBlogs";
import { determinIngUserLikeStatusMiddleware } from "../utilt/determiningUserLikeStatus";

export const routerBlogs = () => {
  const router = express.Router();

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaSearchNameTerm,
    validaQureSortBy,
    controllerBlogs.getBlogs.bind(controllerBlogs)
  );

  router.post("/", authMiddleware,
    validaNameBlogs, validaDescriptionBlogs, validaWebsiteUrlBlogs, controllerBlogs.creatBlogs.bind(controllerBlogs));

  router.post(
    "/:id/posts",
    authMiddleware,
    validaTitlePosts,
    validaShortDescriptionPosts,
    validaContentPosts,
    controllerBlogs.creatPosts.bind(controllerBlogs)
  );

  router.get("/:id", controllerBlogs.getIdBlogs.bind(controllerBlogs));

  router.get(
    "/:id/posts",
    determinIngUserLikeStatusMiddleware,
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaSearchNameTerm,
    validaQureSortBy,
    controllerBlogs.getIdPosts.bind(controllerBlogs)
  );

  router.put("/:id", authMiddleware, validaNameBlogs, validaDescriptionBlogs, validaWebsiteUrlBlogs, controllerBlogs.updateBlogs.bind(controllerBlogs));

  router.delete("/:id", authMiddleware, controllerBlogs.deleteBlogs.bind(controllerBlogs));

  return router;
};
