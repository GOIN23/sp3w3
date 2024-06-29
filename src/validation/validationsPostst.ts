import { body } from "express-validator";
import { statusCommentLike } from "../types/typeCommen";
import { repositoryBlogs } from "../composition/composition-rootBlogs";

export const validaTitlePosts = body("title").trim().exists().isString().isLength({ max: 30, min: 1 });
export const validaShortDescriptionPosts = body("shortDescription").trim().exists().isString().isLength({ max: 100, min: 1 });
export const validaContentPosts = body("content").trim().exists().isString().isLength({ max: 1000, min: 1 });
export const validablogIdPosts = body("blogId").trim().exists().isString().isLength({ min: 1 });
export const validaCommentPost = body("content").trim().exists().isString().isLength({ max: 300, min: 20 });
export const validaCommentLikeDeslik = body("likeStatus")
  .trim()
  .exists()
  .isString()
  .isIn([statusCommentLike.Dislike, statusCommentLike.Like, statusCommentLike.None]);

export const validablogIdPostsCustm = body("blogId").custom(async (value) => {
  const user = await repositoryBlogs.findBlogs(value);
  if (!user) {
    throw new Error("E-mail already in use");
  }
});
