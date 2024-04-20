import { Message } from "@/model/message.model";
class ResponseObj{
    success: boolean;
    message: string;
    data?: any;
    isAcceptingMessages?: boolean;
    messages?:Array<Message>

    constructor(success: boolean, message: string,data?: any,isAcceptingMessages?: boolean,messages?:Array<Message>) {
        this.success = success;
        this.message = message;
        if (data) {
            this.data = data;
            this.isAcceptingMessages = isAcceptingMessages;
            // messages
        }
    }
}

export {ResponseObj} 