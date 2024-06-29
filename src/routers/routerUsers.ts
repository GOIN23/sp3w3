import express from "express";
import { validaLoginPasswordEmail, validasearchLoginTerm, validasearchSearchEmailTerm } from "../validation/validationUsers";
import { validaError, validaQurePageSezi, validaQureSortBy, validaQureipageNumber, validaQursortDirection } from "../validation/generalvValidation";

import { authMiddleware } from "../auth/authMiddleware";
import { conrollerUsers } from "../composition/composition-rootUsers";

export const routerUsers = () => {
  const router = express.Router();

  router.post("/", authMiddleware, validaLoginPasswordEmail, validaError, conrollerUsers.creatUser.bind(conrollerUsers));

  router.get(
    "/",
    validaQursortDirection,
    validaQurePageSezi,
    validaQureipageNumber,
    validaQureSortBy,
    validasearchLoginTerm,
    validasearchSearchEmailTerm,
    conrollerUsers.getUser.bind(conrollerUsers)
  );

  router.delete("/:id", authMiddleware, conrollerUsers.deletUserById.bind(conrollerUsers));

  return router;
};
