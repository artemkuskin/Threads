
'use client'

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { Textarea } from "../ui/textarea"
import { usePathname, useRouter } from "next/navigation"
import { commentValidation } from "@/lib/validations/thread"
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions"
import { Input } from "../ui/input"
import Image from "next/image"

interface Props {
    threadId: string,
    currentUserImg: string
    currentUserId: string
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            thread: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof commentValidation>) => {
        await addCommentToThread({
            threadId: threadId,
            commentText: values.thread,
            userId: JSON.parse(currentUserId),
            path: pathname

        })
        form.reset()
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >

                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-1">
                                <Image src={currentUserImg} alt="User-image" className="rounded-full object-cover" width={48} height={48} />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">

                                <Input
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"

                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>

        </Form>

    )

}

export default Comment