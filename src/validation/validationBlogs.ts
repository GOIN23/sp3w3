import { body, query } from "express-validator";

export const validaNameBlogs = body("name").trim().exists().isString().isLength({ max: 15, min: 1 });
export const validaDescriptionBlogs = body("description").trim().exists().isString().isLength({ max: 500, min: 1 });
export const validaWebsiteUrlBlogs = body("websiteUrl")
  .trim()
  .exists()
  .isString()
  .isLength({ max: 100, min: 1 })
  .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");

