import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { Message } from '@/model/message.model'
import { ResponseObj } from "@/helpers/ResponseObj";

// send message 
export async function POST(request:Request) {
    try {
        await connentDb()

        const { username, content} = await request.json()
        console.log("username and content", username, content)
        const user = await UserModel.findOne({username})
    
        if(!user){
            return Response.json(
                new ResponseObj(false, "User Not Found!"),
                {status: 404}
            )
        }
        // is user accept messages or not 
        if(!user.isAcceptingMessages){
            return Response.json(
                new ResponseObj(false, "User is not accepting messages!"),{status: 403}
            )
        }

        // new message
        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)

        await user.save();
        return Response.json(
            new ResponseObj(true, "Message Send Successfully!"),
            {status:200}
        )
    } catch (error) {
        console.log("unexpected error occured during send message", error)
        return Response.json(
            new ResponseObj(false, "Error occured during send message!"),
            {status: 500}
        )
    }
}