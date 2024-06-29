import { RouterAuth } from "../classRouter/RouterAuth";
import { RepositryAuth } from "../repository/repositryAuth";
import { RepositoryUsers } from "../repository/repostiryUsers";
import { JwtService } from "../routers/application/jwtService";
import { SesionsService } from "../routers/application/sesionsService";
import { AuthService } from "../services/auth-service";
import { UsersService } from "../services/users-service";







export const repositryAuth = new RepositryAuth()
const repositoryUsers = new RepositoryUsers()
const sesionsService = new SesionsService(repositryAuth)
const usersService = new UsersService(repositoryUsers)
export const jwtService = new JwtService(sesionsService, repositryAuth)
export const authService = new AuthService(repositoryUsers, repositryAuth)
export const controllerAuth = new RouterAuth(authService, sesionsService, jwtService, usersService)

