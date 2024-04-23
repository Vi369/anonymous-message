import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import connentDb from '@/lib/dbConnect'
import UserModel from '@/model/user.model'
import { User } from 'next-auth'
import { ResponseObj } from '@/helpers/ResponseObj'

// toggle user accept messages or not 
export async function POST(request:Request) {
    await connentDb()

    
    const session = await getServerSession(authOptions)
    console.log("session first: ",session)
// TODO: 

    const user : User = session?.user;
    console.log("user session se liya data", user)
    if(!session || !session?.user){
        return Response.json(
            new ResponseObj(false, "User Not Authenticated!"),
            {status: 401}
    )
    }

    const userId = user._id
    console.log("user id ", userId)
    const { acceptMessage } = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessage: acceptMessage},
            {new:true}
        )

        if(!updatedUser){
            return Response.json( 
                new ResponseObj(false,"Failed to update user status!"),
                {status: 500}
            )
        }

        return Response.json(
            new ResponseObj(true, "Accept messages status togle successfully!",updatedUser),
            {status: 200}
        )

        
    } catch (error) {
        console.log("Error during toggle status user accept messages or not.",error)
        return Response.json(
            new ResponseObj(false,"Error during toggle status user accept messages or not."),
            { status: 500 }
        )
    }
}

// checking status accept message or not 
export async function GET(request:Request) {
    await connentDb()
    try {
        const session = await getServerSession(authOptions)
    // TODO: 
    console.log("Get method: in session", session)
        const user : User = session?.user;
    console.log("user get sesstion: ", user)

        if(!session || !session?.user){
            return Response.json(
                new ResponseObj(false,"User Not Authenticated"),
                { status: 401 }
            )
        }
    
        const userId = user._id
    console.log("user id:", userId)
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            return Response.json(
                new ResponseObj(false, "User Not Found!"),
                {status: 404}
            )
        }
    
        return Response.json(
            new ResponseObj(true, "User Accepting messages",{},foundUser.isAcceptingMessages),
            {status: 200}
        )
    } catch (error) {
        console.log("Error is Getting message acceptance status",error)
        return Response.json(
            new ResponseObj(false, "Error during check user status accept message!"),
            {status: 500}
        )
    }
}
