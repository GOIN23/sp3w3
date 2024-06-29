import { countreQureyValidation } from "../validation/countreQureyValidation";
import express from "express";
import { validaEmail, validaLoginPasswordEmail, validaPassword, validaloginOrEmail, validatPassword } from "../validation/validationUsers";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { validaError } from "../validation/generalvValidation";
import { validabAuthdCodeCustm, validabAuthdEmailCustm, validabAuthdLoginCustm, validabAuthdresendingCodeCustm } from "../validation/validatAuth";
import { authRefreshTokenMiddleware } from "../auth/authRefreshTokenMiddleware";
import { controllerAuth } from "../composition/composition-rootAuth";

export const routerAuth = () => {
  const router = express.Router();

  router.post("/login", countreQureyValidation, validaloginOrEmail, validaPassword, validaError,  controllerAuth.login.bind(controllerAuth));

  router.post("/logout", authRefreshTokenMiddleware, controllerAuth.logout.bind(controllerAuth));

  router.post(
    "/registration",
    countreQureyValidation,
    validaLoginPasswordEmail,
    validabAuthdLoginCustm,
    validabAuthdEmailCustm,
    validaError,
    controllerAuth.registration.bind(controllerAuth)
  );

  router.post("/registration-confirmation", countreQureyValidation, validabAuthdCodeCustm, validaError, controllerAuth.registrationConfirmation.bind(controllerAuth));

  router.post(
    "/registration-email-resending",
    countreQureyValidation,
    validaEmail,
    validabAuthdresendingCodeCustm,
    validaError,
    controllerAuth.registrationEmailResending.bind(controllerAuth)
  );

  router.post("/password-recovery", countreQureyValidation, validaEmail, validaError, controllerAuth.passwordRecovery.bind(controllerAuth));

  router.post("/new-password", countreQureyValidation, validatPassword, validaError, controllerAuth.newPassword.bind(controllerAuth));

  router.get("/me", authTokenMiddleware, controllerAuth.getMe.bind(controllerAuth));

  router.post("/refresh-token", authRefreshTokenMiddleware, controllerAuth.refreshToken.bind(controllerAuth));

  return router;
};
