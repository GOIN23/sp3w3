import { RouterUsers } from "../classRouter/RouterUsers"
import { QrepostoryUsers } from "../repository/qreposttoryUsers"
import { RepositoryUsers } from "../repository/repostiryUsers"
import { UsersService } from "../services/users-service"







export const repositryUsers = new RepositoryUsers()
export const usersService = new UsersService(repositryUsers)
const qrepostoryUsers = new QrepostoryUsers()
export const conrollerUsers = new RouterUsers(usersService, qrepostoryUsers)
