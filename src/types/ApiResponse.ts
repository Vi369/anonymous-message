import { Message } from '@/model/message.model'

export interface ApiResponce{
    success: boolean,
    message: string,
    isAccesptingMessages?:boolean,
    messages?: Array<Message>
    data?:any
}

