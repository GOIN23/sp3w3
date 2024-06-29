import bcrypt from 'bcrypt';
import { authService } from "../../src/composition/composition-rootAuth"
import { emailAdapter } from "../../src/adapter/emailAdapter";

describe("test authService", () => {

    describe("checking the AuthService method creatUser", () => {

        it("checking creat user", async () => {

            bcrypt.genSalt = jest.fn().mockResolvedValue("3123fdf123fdfdfddsdasdsadasdw321312")

            authService._generatHash = jest.fn().mockReturnValue("3123123dsdasdsadasdw321312")

            emailAdapter.sendEmail = jest.fn().mockResolvedValue(true);

            authService.repositoryUsers.createUsers = jest.fn().mockResolvedValue(true);



            const result = await authService.creatUser({
                email: "4e5.kn@mail.ru",
                login: "ali22",
                password: "1213123"
            })



            expect(result).toEqual({
                id: expect.any(String),
                createdAt: expect.any(String),
                email: "4e5.kn@mail.ru",
                login: "ali22",
            })


        })


    })

    describe("checking the AuthService method confirmEmail", () => {
        it("the user is missing from the database", async () => {

            authService.repositoryUsers.findUserByConfirEmail = jest.fn().mockResolvedValue(false);


            const result = await authService.confirmEmail("22")


            expect(result).toBe(null)


        })

        it("the code does not match or the code date is expired,", async () => {
            authService.repositoryUsers.findUserByConfirEmail = jest.fn().mockResolvedValue({
                emailConfirmation: 12,
                expirationDate: 333
            });


            const result = await authService.confirmEmail("22")


            expect(result).toBe(null)

        })

        it("the code and its date correspond", async () => {
            const currentDate: Date = new Date();
            currentDate.setDate(currentDate.getDate() + 1);

            authService.repositoryUsers.findUserByConfirEmail = jest.fn().mockResolvedValue({
                emailConfirmation: {
                    confirmationCode: "22",
                    expirationDate: currentDate
                }
            });

            authService.repositoryUsers.updateConfirmation = jest.fn().mockResolvedValue(true);


            const result = await authService.confirmEmail("22")


            expect(result).toBe(true)

        })




    })

    describe("checking the AuthService method resendingCode", () => {
        it("the user is missing from the database", async () => {

            authService.repositoryUsers.findBlogOrEmail = jest.fn().mockResolvedValue(false);


            const result = await authService.resendingCode("22")


            expect(result).toBe(null)
        })

        it("mail confirmed", async () => {
            authService.repositoryUsers.findBlogOrEmail = jest.fn().mockResolvedValue({
                emailConfirmation: {
                    isConfirmed: true
                }
            });


            const result = await authService.resendingCode("22")

            expect(result).toBe(null)


        })


        it("user is in the database and his email is not confirmed", async () => {
            authService.repositoryUsers.findBlogOrEmail = jest.fn().mockResolvedValue({
                emailConfirmation: {
                    isConfirmed: false
                }
            });
            emailAdapter.sendEmail = jest.fn().mockResolvedValue(true);
            authService.repositoryUsers.updateCodeUserByConfirEmail = jest.fn().mockResolvedValue(true);




            const result = await authService.resendingCode("22")


            expect(result).toBe(true)



        })






    })

    describe("checking the AuthService method passwordRecovery", () => {
        it("get passwordRecoveryCode", async () => {
            authService.repositryAuth.postPasswordRecoveryCode = jest.fn().mockResolvedValue(true);
            emailAdapter.sendEmail = jest.fn().mockResolvedValue(true);


            const result = await authService.passwordRecovery("4e5e>@sasda")


            expect(result).toEqual(expect.any(String));
        })

    })

    describe("checking the AuthService method checkPasswordRecovery", () => {
        it("there is no code in the database", async () => {
            authService.repositryAuth.checkPasswordRecoveryCode = jest.fn().mockResolvedValue(false);


            const result = await authService.checkPasswordRecovery("4e5e>@sasda", "asdasdas")


            expect(result).toBe(false);
        })

        it("there is code in the database", async () => {
            authService.repositryAuth.checkPasswordRecoveryCode = jest.fn().mockResolvedValue(true);

            bcrypt.genSalt = jest.fn().mockResolvedValue("3123fdf123fdfdfddsdasdsadasdw321312")

            authService._generatHash = jest.fn().mockReturnValue("3123123dsdasdsadasdw321312")

            authService.repositryAuth.updatePassword = jest.fn().mockReturnValue({})


            const result = await authService.checkPasswordRecovery("4e5e>@sasda", "asdasdas")


            expect(result).toBe(true);

        })

    })

    describe("checking the AuthService method _generatHash", () => {
        it("creat Hash", async () => {
            bcrypt.hash = jest.fn().mockResolvedValue("3123fdf123fdfdfddsdasdsadasdw321312")

            const result = await authService._generatHash("dasdas", "dasdasdas")


            expect(result).toBe("3123fdf123fdfdfddsdasdsadasdw321312")
        })



    })

    describe("checking the AuthService method findBlogOrEmail", () => {
        it("user is ", async () => {
            authService.repositoryUsers.findBlogOrEmail = jest.fn().mockResolvedValue(true)

            const result = await authService.findBlogOrEmail("dasdas")


            expect(result).toBe(null)
        })

        it("user not", async () => {
            authService.repositoryUsers.findBlogOrEmail = jest.fn().mockResolvedValue(false)

            const result = await authService.findBlogOrEmail("dasdas")


            expect(result).toEqual(false)
        })


    })







})