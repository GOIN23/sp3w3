import { RouterSecurity } from "../classRouter/RouterSecurity";
import { RepositryAuth } from "../repository/repositryAuth";
import { SesionsService } from "../routers/application/sesionsService";







const repositryAuth = new RepositryAuth()
export const sesionsService = new SesionsService(repositryAuth)
export const conrollerSecurity = new RouterSecurity(sesionsService)

