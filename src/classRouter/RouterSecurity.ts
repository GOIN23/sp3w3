import { Request, Response } from "express";

import { SesionsService } from "../routers/application/sesionsService";





export class RouterSecurity {
    constructor(protected sesionsService: SesionsService) { }

    async getDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        const sesions = await this.sesionsService.getSesions(refreshToken);

        res.status(200).send(sesions);
    }

    async deleteDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        await this.sesionsService.deleteSesions(refreshToken);

        res.sendStatus(204);
    }
    async deleteByIdDevices(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        if (!req.params.id) {
            res.sendStatus(404);
            return;
        }
        const sesionDevice = await this.sesionsService.getSesionsId(req.params.id);

        if (!sesionDevice) {
            res.sendStatus(404);

            return;
        }
        const sesions = await this.sesionsService.getSesions(refreshToken);
        const resulDevaId = sesions?.find((s) => s.deviceId === req.params.id);

        if (!resulDevaId) {
            res.sendStatus(403);

            return;
        }

        await this.sesionsService.deleteSesionsId(req.params.id);

        res.sendStatus(204);
    }
}