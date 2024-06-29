import { managerTestPosts } from '../utilitTest/managerTestPosts';
import { MongoMemoryServer } from "mongodb-memory-server";
import { dbStart, dbT } from "../../src/db/mongo-.db";
import { app } from "../../src/app";
import request from "supertest";
import { SETTINGS } from "../../src/seting/seting";
import mongoose from "mongoose";
import { managerTestBlogs } from "../utilitTest/managerTestBlogs";
import { postservice, qreposttoryCommentsPosts } from '../../src/composition/composition-rootPosts';
import { managerTestUser } from '../utilitTest/managerTestUser';
import { authService } from '../../src/composition/composition-rootAuth';
import { statusCommentLike } from '../../src/types/typeCommen';


describe("checking likes on comments", () => {
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


    it("creating a comment without your own like statusa", async () => {
        const blog = await managerTestBlogs.creatBlogOne({
            name: "string",
            description: "string",
            websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
        })
        const post = await managerTestPosts.creatPostOne({
            blogId: blog.id,
            title: "saday",
            shortDescription: "jan",
            content: "blas asdsa",
        })

        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)
        const comment = await postservice.createCommentPost({ content: "sdasdas" }, { _id: user.id, createdAt: "dss", email: user.email, login: user.login }, post.id)

        expect(comment).toEqual({
            id: comment!.id,
            commentatorInfo: { userId: user.id, userLogin: user.login },
            content: "sdasdas",
            createdAt: expect.any(String),
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
                myStatus: "None",
            }
        })

    })

    it("receiving comments on a specific post from an unauthorized user", async () => {
        const blog = await managerTestBlogs.creatBlogOne({
            name: "string",
            description: "string",
            websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
        })
        const post = await managerTestPosts.creatPostOne({
            blogId: blog.id,
            title: "saday",
            shortDescription: "jan",
            content: "blas asdsa",
        })

        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)
        const comment = await postservice.createCommentPost({ content: "sdasdas" }, { _id: user.id, createdAt: "dss", email: user.email, login: user.login }, post.id)



        const comentsPost = await qreposttoryCommentsPosts.getCommentPosts(post.id, {
            pageNumber: 1,
            pageSize: 10,
            sortBy: "createdAt",
            sortDirection: "desc"
        })

        expect(comentsPost).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{ ...comment, likesInfo: { dislikesCount: 0, likesCount: 0, myStatus: statusCommentLike.None } }],
        })


    })
    it("receiving comments on a specific post from authorized users who like the post", async () => {
        const blog = await managerTestBlogs.creatBlogOne({
            name: "string",
            description: "string",
            websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
        })
        const post = await managerTestPosts.creatPostOne({
            blogId: blog.id,
            title: "saday",
            shortDescription: "jan",
            content: "blas asdsa",
        })

        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)
        const comment = await postservice.createCommentPost({ content: "sdasdas" }, { _id: user.id, createdAt: "dss", email: user.email, login: user.login }, post.id)

        await postservice.updateCommentPostsLikeDeslike(statusCommentLike.Like, comment!.id, user.id)


        const comentsPost = await qreposttoryCommentsPosts.getCommentPosts(post.id, {
            pageNumber: 1,
            pageSize: 10,
            sortBy: "createdAt",
            sortDirection: "desc"
        }, user.id)

        expect(comentsPost).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{ ...comment, likesInfo: { dislikesCount: 0, likesCount: 1, myStatus: statusCommentLike.Like } }],
        })


    })

    it(" + GET receiving comments on a specific post for authorized and unauthorized users", async () => {
        const blog = await managerTestBlogs.creatBlogOne({
            name: "string",
            description: "string",
            websiteUrl: "https://A9k3dqXmQg09DnH9pEgGN0-v64.yh9pEgmrf0I6mSDkAh-3H2-0M_SxHf5WEboprgrfa4jCt1-9i4cbFk_xfbEzkeLJ7",
        })
        const post = await managerTestPosts.creatPostOne({
            blogId: blog.id,
            title: "saday",
            shortDescription: "jan",
            content: "blas asdsa",
        })

        const userDto = managerTestUser.creatUserDto();

        const user = await managerTestUser.registerUser(userDto)
        const comment = await postservice.createCommentPost({ content: "sdasdas" }, { _id: user.id, createdAt: "dss", email: user.email, login: user.login }, post.id)
        await postservice.updateCommentPostsLikeDeslike(statusCommentLike.Dislike, comment!.id, user.id)



        const commentById = await postservice.findCommentPosts(comment!.id, user.id)

        expect(commentById).toEqual({
            ...commentById,
            likesInfo: {
                dislikesCount: 1, likesCount: 0, myStatus: statusCommentLike.Dislike
            }

        })

        const commentByIdUnauthorized = await postservice.findCommentPosts(comment!.id)

        expect(commentByIdUnauthorized).toEqual({
            ...commentById,
            likesInfo: {
                dislikesCount: 1, likesCount: 0, myStatus: statusCommentLike.None
            }

        })

    })




})






