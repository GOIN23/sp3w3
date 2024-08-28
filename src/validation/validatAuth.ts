import { body } from "express-validator";
import { authService } from "../composition/composition-rootAuth";

export const validabAuthdEmailCustm = body("email").custom(async value => {
    const user = await authService.findBlogOrEmail(value);
    console.log(user, "email email")
    if (!user) {
      throw new Error('E-mail already in use');
    }
  });
  
  export const validabAuthdLoginCustm = body("login").custom(async value => {
    const user = await authService.findBlogOrEmail(value);
    console.log(user, "login login")
    if (!user) {
      throw new Error('login already in use');
    }
  });
  

    
  export const validabAuthdCodeCustm = body("code").custom(async value => {
    const user = await authService.confirmEmail(value);
    if (!user) {
      throw new Error('login already in use');
    }
  });


  export const validabAuthdresendingCodeCustm = body("email").custom(async value => {
    const user = await authService.resendingCode(value);
    if (!user) {
      throw new Error('email already in use');
    }
  });
  
  