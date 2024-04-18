import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { verifySchema } from '@/schemas/verifySchema'
import { usernameValidation } from '@/schemas/signUpSchema'

// TODO: zod code validation improve flow and create helpers mothod for success and error response


// check email code schema 
const verifyEmailCodeSchema = z.object({
    verifyCode: verifySchema
})

// check username schema
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function POST(request:Request) {
    await connentDb()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        console.log("to see how look decodedusername",)
        const user = await UserModel.findOne({
            username: decodedUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not Found"
            },
            {
                status: 400
            })
        }

        const isCodevalid = user.verifiedCode === code;

        const isVerifycodeNotExpire = new Date(user.verifedCodeExpiry) > new Date()

        if(isCodevalid && isVerifycodeNotExpire){
            user.isVerified = true
            await user.save()
            return Response.json({
                message: "User Email Verified Successfully!",
                success: true
            },
            {
                status: 200
            })
        }else if(!isVerifycodeNotExpire){
            return Response.json({
                message: "Verification code has expired.Please sign-up Again",
                success: false
            },
            {
                status: 400
            })
        }else{
            return Response.json({
                message: "Verification code is Incorrect",
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