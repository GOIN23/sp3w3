import express, { Request, Response } from "express";
import { SETTINGS } from "../seting/seting";
import { UsersService } from "../services/users-service";
import { JwtService } from "../routers/application/jwtService";
import { SesionsService } from "../routers/application/sesionsService";
import { AuthService } from "../services/auth-service";




export class RouterAuth {
    constructor(protected authService: AuthService, protected sesionsService: SesionsService, protected jwtService: JwtService, protected usersService: UsersService) { }

    async login(req: Request, res: Response) {
        const user = await this.usersService.checkCreadentlais(req.body.loginOrEmail, req.body.password);
        if (!user) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
            return;
        }
    
        const userAgent = req.headers["user-agent"] || 'unknown device';

        const { accessToken, refreshToken } = await this.jwtService.createJwt(user._id, req.ip, userAgent, user.login);

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({ accessToken: accessToken });
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;

        await this.sesionsService.completelyRemoveSesion(refreshToken);
        res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_204);
    }

    async registrationConfirmation(req: Request, res: Response) {
        res.sendStatus(204);
    }

    async passwordRecovery(req: Request, res: Response) {
        await this.authService.passwordRecovery(req.body.email);

        res.sendStatus(204);
    }

    async registration(req: Request, res: Response) {
        await this.authService.creatUser(req.body);

        res.status(204).send("Input data is accepted. Email with confirmation code will be send to passed email address");
    }
    async registrationEmailResending(req: Request, res: Response) {
        res.sendStatus(204);
    }
    async newPassword(req: Request, res: Response) {
        const result = await this.authService.checkPasswordRecovery(req.body.recoveryCode, req.body.newPassword);

        if (!result) {
            res.status(400).send({
                errorsMessages: [
                    {
                        message: "dsds",
                        field: "recoveryCode",
                    },
                ],
            });
            return;
        }

        res.sendStatus(204);
    }

    async getMe(req: Request, res: Response) {
        // @ts-ignore
        const user = await this.usersService.findUsers(req.userId);
        res.status(200).send({ email: user?.email, login: user?.login, userId: req.userId });
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const userAgent = req.headers["user-agent"];

        const JWT = await this.jwtService.updateToken(refreshToken, req.ip, userAgent);

        if (!JWT) {
            res.sendStatus(SETTINGS.HTTPCOD.HTTPCOD_401);
            return;
        }
        res.cookie("refreshToken", JWT.refreshToken, { httpOnly: true, secure: true });

        res.status(SETTINGS.HTTPCOD.HTTPCOD_200).send({ accessToken: JWT.accessToken });
    }
}