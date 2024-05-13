import { body, query, validationResult } from "express-validator";
import express, { NextFunction, Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { errorValid } from "../utilt/errors";
import { authService } from "../services/auth-service";

export const validaQurePageSezi = query("pageSize").toInt().default(10);
export const validaQureipageNumber = query("pageNumber").toInt().default(1);
export const validaSearchNameTerm = query("searchNameTerm").default("");
export const validaQureSortBy = query("sortBy").default("createdAt");
export const validaQursortDirection = query("sortDirection").default("desc");






export const validaError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(SETTINGS.HTTPCOD.HTTPCOD_400).send(errorValid(errors.array({ onlyFirstError: true })));
    return;
  }

  next();
};


