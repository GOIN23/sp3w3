import express from "express";
import { authRefreshTokenMiddleware } from "../auth/authRefreshTokenMiddleware";
import { conrollerSecurity } from "../composition/composition-rooSecurity";




export const routerSecurity = () => {
  const router = express.Router();

  router.get("/devices", authRefreshTokenMiddleware, conrollerSecurity.getDevices.bind(conrollerSecurity));

  router.delete("/devices", authRefreshTokenMiddleware, conrollerSecurity.deleteDevices.bind(conrollerSecurity));

  router.delete("/devices/:id", authRefreshTokenMiddleware, conrollerSecurity.deleteByIdDevices.bind(conrollerSecurity));

  return router;
};
