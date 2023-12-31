'use server'
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    community: string | null,
    path: string
}

interface ParamsComment {
    threadId: string
    commentText: string
    userId: string
    path: string
}

export async function createThread({ text, author, community, path }: Params) {
    connectToDB()
    try {

        const createdThread = await Thread.create({
            text,
            author,
            community: null
        })

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)

    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 2) {
    connectToDB()

    try {
        const skipAmount = (pageNumber - 1) * pageSize
        const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
            .sort({ createAt: 'desc' })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({ path: 'author', model: User })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: '_id name parentId, image'
                }
            })

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const posts = await postQuery.exec()

        const isNext = totalPostsCount > skipAmount + posts.length
        return { posts, isNext }
    } catch (error: any) {
        throw new Error(`Error fetch post: ${error.message}`)
    }

}

export async function fetchThreadById(id: string) {
    connectToDB()

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec()
        return thread
    } catch (error: any) {
        throw new Error(`Error fetch thread: ${error.message}`)
    }
}

export async function addCommentToThread({
    threadId,
    commentText,
    userId,
    path
}: ParamsComment
) {
    connectToDB()

    try {
        const originalThread = await Thread.findById(threadId)

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId

        })

        const savedCommentThread = await commentThread.save()

        originalThread.children.push(savedCommentThread._id)

        await originalThread.save()

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error add to comment: ${error.message}`)
    }
}