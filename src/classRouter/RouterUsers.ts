import { UsersService } from "../services/users-service";
import express, { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { QrepostoryUsers } from "../repository/qreposttoryUsers";
import { qureUsers } from "../types/typeUser";


export class RouterUsers {
    constructor(protected usersService: UsersService, protected qrepostoryUsers: QrepostoryUsers) { }

    async creatUser(req: Request, res: Response) {
        const newUser = await this.usersService.creatUsers(req.body);
        res.status(SETTINGS.HTTPCOD.HTTPCOD_201).send(newUser);
    }

    async getUser(req: Request<{}, {}, {}, qureUsers>, res: Response) {
        const result = await this.qrepostoryUsers.getUsers(req.query);

        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send(result);
        return;
    }

    async deletUserById(req: Request, res: Response) {
        let result = await this.usersService.findUsers(req.params.id);
        if (!result) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_404);
            return;
        }

        await this.usersService.deleteBlogs(req.params.id);
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
        return;
    }

}