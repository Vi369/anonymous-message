import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'


// query check schema
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await connentDb();

    try {
        const { searchParams } = new URL(request.url)

        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("result log:", result) // TODO: console see 

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []

            return Response.json({
                success: false,
                message: usernameError?.length > 0?usernameError.join(", ") : "Invalid Query parameters"
            },
            {
                status: 400
            })
        }

        const { username } = result.data

        const verifiedUser = await UserModel.findOne({
            username, isVerified: true
        })

        if(verifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken"
            },
            {
                status: 400
            })
        }

        return Response.json({
            success: true,
            message: "Username is Available"
        },
        {
            status: 200
        })
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error during checking username"
        },
        {
            status: 500
        })
    }
}
