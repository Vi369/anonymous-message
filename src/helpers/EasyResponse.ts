import { ApiResponce } from "@/types/ApiResponse";
import { Message } from "@/model/message.model";
function EasyResponse(
    success:boolean,
    message: string,
    data?:any,
    isAccesptingMessages?:boolean,
    messages?: Array<Message>
){
    const obj = {
        success: success,
        message: message
    }
    if(data){
        obj.data = data
    }
    
}

