import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { ResponseObj } from "@/helpers/ResponseObj";

// check email code schema 
// const verifyEmailCodeSchema = z.object({
//     code: verifySchema
// })

export async function POST(request:Request) {
    await connentDb()

    try {
        const {username, code} = await request.json()
        console.log("username and code", username,code)
        // const decodedUsername = decodeURIComponent(username)
        // console.log(decodedUsername)

        // // code validation
        // const result = verifyEmailCodeSchema.safeParse({code});

        // if(!result.success){
        //     return Response.json({
        //         success: false,
        //         message: result.error.format().code?._errors
        //     },{status: 400})
        // }

        // // validated Code 
        // const validatedCode = result.data.code.code

        const user = await UserModel.findOne({
            username
        })

        if(!user){
            return Response.json(new ResponseObj(false, "User Not Found"),
            {
                status: 400
            })
        }

        const isCodevalid = user.verifiedCode === code;

        if(isCodevalid){
            return Response.json( 
                new ResponseObj(false, "Verification code is Incorrect"),
                {status: 400}
            )
        }

        const isVerifycodeNotExpire = new Date(user.verifedCodeExpiry) > new Date()

        if(isVerifycodeNotExpire){
            user.isVerified = true
            await user.save()
            return Response.json(
                new ResponseObj(true, "Email Verified Successfully!"),
                {status: 200}
            )
        }else{
            return Response.json({
                message: "Verification code has expired.Please sign-up Again",
                success: false
            },
            {
                status: 400
            })
        }

    } catch (error) {
        console.error("Error checking Email Verify code.", error)
        return Response.json({
            success: false,
            message: "Error during checking Email Verify code"
        },
        {
            status: 500
        })
    }
}