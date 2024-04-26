import { ResponseObj } from "@/helpers/ResponseObj";
import UserModel from "@/model/user.model";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import connentDb from "@/lib/dbConnect";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
    const messageId = params.messageid;
    try {
        await connentDb();
        const session = await getServerSession(authOptions);
        const user:User = session?.user
        // TODO: console session or user to check details 
        console.log("session or user found or not:", session, user)
        // checking if session expire 
        if(!session && !user){
            return Response.json(
                new ResponseObj(false, "Authentication failed: User session has expired or user is not authenticated."),
                {status: 401}
            )
        }
        const updatedUserMessagesArray = await UserModel.updateOne(
            {_id: user._id},
            {$pull:{_id: messageId}}
        )
        // TODO: console 
        console.log("delete message response", updatedUserMessagesArray)
        if(updatedUserMessagesArray.modifiedCount===0){
            return Response.json(
                new ResponseObj(false,"Message not Found or Alreday deleted!"),
                {status: 404}
            )
        }
        // success response
        return Response.json(
            new ResponseObj(true, "Message deleted Successfully!!"),
            {status: 200}
        )

    } catch (error) {
        console.log("Error During deleting message:", error)
        return Response.json(
            new ResponseObj(false, "Error Occured while deleting the message"),
            {status: 500}
        )
    }
}