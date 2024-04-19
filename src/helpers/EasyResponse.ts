import { ApiResponce } from "@/types/ApiResponse";
import { Message } from "@/model/message.model";
function EasyResponse(
    success:boolean,
    message: string,
    data?:any,
    isAccesptingMessages?:boolean,
    messages?: Array<Message>
){
    return{
        success: success,
        message: message,
        data: data,
        isAccesptingMessages:isAccesptingMessages,
        messages: messages
    }
}