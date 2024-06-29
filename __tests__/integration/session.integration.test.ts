

import { managerTestPosts } from '../utilitTest/managerTestPosts';
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbStart, dbT } from "../../src/db/mongo-.db";
import { app } from "../../src/app";
import request from "supertest";
import { SETTINGS } from "../../src/seting/seting";
import mongoose from "mongoose";
import { managerTestUser } from '../utilitTest/managerTestUser';
import {  jwtService } from '../../src/composition/composition-rootAuth';
import { sesionsService } from '../../src/composition/composition-rooSecurity';


describe("checking sessions", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await dbStart(mongoServer.getUri())
    });
    afterAll(async () => {
        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error("Error while disconnecting from MongoDB:", error);
        }
    });
    afterEach(async () => {
        await request(app).delete(SETTINGS.PATH.ALLDATA)
    })




    it("login user from different devices", async () => {
        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)


        const twoTokenOneDevices = await jwtService.createJwt(user.id, "192.167.1.1", "iphone") // one devices

        const twoTokenTwoDevices = await jwtService.createJwt(user.id, "192.122.3.1", "Samsung") // two devices

        const sessionUser = await sesionsService.getSesions(twoTokenTwoDevices.refreshToken)

        expect(sessionUser).toEqual([{
            deviceId: expect.any(String),
            ip: "192.167.1.1",
            lastActiveDate: expect.any(Date),
            title: "iphone"
        }, {
            deviceId: expect.any(String),
            ip: "192.122.3.1",
            lastActiveDate: expect.any(Date),
            title: "Samsung"
        }])


    })

    it("Terrminate all other (exclude current) device's sessions", async () => {
        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)


        const oneTokenOneDevices = await jwtService.createJwt(user.id, "192.167.1.1", "iphone") // one devices

        const twoTokenTwoDevices = await jwtService.createJwt(user.id, "192.122.3.1", "Samsung") // two devices

        const threeTokenThreeDevices = await jwtService.createJwt(user.id, "111.1222.3.1", "xiaomi") // three devices


        await sesionsService.deleteSesions(oneTokenOneDevices.refreshToken)

        const sessionUser = await sesionsService.getSesions(oneTokenOneDevices.refreshToken)


        expect(sessionUser).toEqual([{
            deviceId: expect.any(String),
            ip: "192.167.1.1",
            lastActiveDate: expect.any(Date),
            title: "iphone"
        }])




    })

    it("Terminate specified device session", async () => {
        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)


        const oneTokenOneDevices = await jwtService.createJwt(user.id, "192.167.1.1", "iphone") // one devices

        const twoTokenTwoDevices = await jwtService.createJwt(user.id, "192.122.3.1", "Samsung") // two devices

        const threeTokenThreeDevices = await jwtService.createJwt(user.id, "111.1222.3.1", "xiaomi") // three devices



        const sessionUser = await sesionsService.getSesions(oneTokenOneDevices.refreshToken)

        expect(sessionUser!.length).toBe(3)
        //@ts-ignore
        await sesionsService.deleteSesionsId(sessionUser[1].deviceId)

        const sessionUser2 = await sesionsService.getSesions(oneTokenOneDevices.refreshToken)

        expect(sessionUser2!.length).toBe(2)




    })

    it("deleting session when logout", async () => {
        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)


        const oneTokenOneDevices = await jwtService.createJwt(user.id, "192.167.1.1", "iphone") // one devices

        const sessionUser = await sesionsService.getSesions(oneTokenOneDevices.refreshToken)

        expect(sessionUser!.length).toBe(1)


        await sesionsService.completelyRemoveSesion(oneTokenOneDevices.refreshToken)

        const sessionUser2 = await sesionsService.getSesions(oneTokenOneDevices.refreshToken)

        expect(sessionUser2!.length).toBe(0)



    })


})