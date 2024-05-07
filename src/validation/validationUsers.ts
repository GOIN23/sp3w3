import { body, query } from "express-validator";

export const validaLogine = body("login").trim().exists().isString().isLength({ max: 10, min: 3 }).matches("^[a-zA-Z0-9_-]*$");

export const validapassword = body("password").trim().exists().isString().isLength({ max: 20, min: 6 });
export const validaEmail = body("email").trim().exists().isString().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
export const validaloginOrEmail = body("loginOrEmail").trim().exists().isString()
export const validaPassword = body("password").trim().exists().isString()


export const validasearchLoginTerm= query("searchLoginTerm").default("");
export const validasearchSearchEmailTerm= query("searchEmailTerm").default("");


