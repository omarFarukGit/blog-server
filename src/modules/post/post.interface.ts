import { PostStatus } from "../../../generated/prisma/enums";


export interface IcreatePostPayload{
    title:string,
    content:string,
    thumbail?:string,
    isFetured?:boolean,
    status?:PostStatus,
    tags:string[]
}