import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'
import { ResponseObj } from "@/helpers/ResponseObj";


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

        return Response.json(
            new ResponseObj(true, "Username is Available"),
            {status: 200}
        )
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            new ResponseObj(false, "Error checking username"),
        {
            status: 500
        })
    }
}
