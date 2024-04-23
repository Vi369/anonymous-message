import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import connentDb from '@/lib/dbConnect'
import UserModel from '@/model/user.model'
import { User } from 'next-auth'
import mongoose from 'mongoose'
import { ResponseObj } from '@/helpers/ResponseObj'

// get messages
export async function GET(request:Request) {
    await connentDb()

    const session = await getServerSession(authOptions)
    console.log("session:", session)
// TODO: 
    const user:User = session?.user;
    console.log("user jo session se liya hai:", session)

    if(!session || !session?.user){
        return Response.json( 
            new ResponseObj(false, "User Not Authenticated!"),
            {status: 401}
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    console.log("user id converted:", userId);

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length===0){
            return Response.json(
                new ResponseObj(false, "User not Found!"),
                {status: 401}
            )
        }
            console.log("messages", user[0].messages)
        return Response.json(
            // new ResponseObj(true, "Messages Fetched successfully!",user[0].messages),
            {
                messages:user[0].messages ,
                success: true
            },
            { status: 200 } 
            )
    } catch (error) {
        console.log("Error during fetched Messages:", error)
        return Response.json(
            new ResponseObj(false, "Error during fetched Messages:"),
            { status: 500}
        )
    }
}