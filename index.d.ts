
// declare global {
//     module "express-serve-static-core" {
//         export interface Request {
//             userId: string | null
//         }
//     }
// }


import { Request as ExpressRequest } from "express"


declare module "express" {
    interface Request extends ExpressRequest {
        userId:string | undefined,
        userLogin:string | undefined 

    }
}



declare module "express-serve-static-core" {
    interface Request {
        userId:string | undefined,
        userLogin:string | undefined 
    }
}


