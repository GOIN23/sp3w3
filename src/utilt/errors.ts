import { APIErrorResult } from "../types/generalType";

export const errorValid = (e: any) => {

  if (e.length > 3) {
    const err: APIErrorResult = {
      errorsMessages: [
        {
          message: e[0].msg,
          field: e[0].path,
        },

        {
          message: e[1].msg,
          field: e[1].path,
        },

        {
          message: e[2].msg,
          field: e[2].path,
        },

        {
          message: e[3].msg,
          field: e[3].path,
        },
      ],
      
    };
    return err;

  } else if (e.length > 2) {
    const err: APIErrorResult = {
      errorsMessages: [
        {
          message: e[0].msg,
          field: e[0].path,
        },

        {
          message: e[1].msg,
          field: e[1].path,
        },

        {
          message: e[2].msg,
          field: e[2].path,
        },
      ],
    };
    return err;
  } else if (e.length > 1) {
    const err: APIErrorResult = {
      errorsMessages: [
        {
          message: e[0].msg,
          field: e[0].path,
        },

        {
          message: e[1].msg,
          field: e[1].path,
        },
      ],
    };
    return err;
  } else if (e.length > 0) {
    const err: APIErrorResult = {
      errorsMessages: [
        {
          message: e[0].msg,
          field: e[0].path,
        },
      ],
    };
    return err;
  } 

  return null;
};
