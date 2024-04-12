import {Message} from '@/model/user.model'

export interface ApiResponce{
    success: boolean,
    message: string,
    isAccesptingMessages?:boolean,
    messages?: Array<Message>
}