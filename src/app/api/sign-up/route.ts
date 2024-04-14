import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { Fascinate } from "next/font/google";

export async function POST(request:Request) {
    await connentDb()

    try {
        const {username, email, password} = await request.json()
        // checking if username already taken
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
    
        if(existingVerifiedUserByUsername){
            return Response.json({
                success: false,
                message: "This Username already exist"
            },
            {
                status: 400
            })
        }

        // checking if email already exist 
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        // verify code 
        const verifyCode = Math.floor(100000+ Math.random()*900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exist"
                },
                {
                    status: 400
                })
            }else{
                // update user details and save  
                const hashedPassword = await bcrypt.hash(password,10)

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifiedCode = verifyCode;
                existingUserByEmail.verifedCodeExpiry = new Date(Date.now()+ 3600000);

                await existingUserByEmail.save();

            }
        }else{
            // hashed user password
            const hashedPassword = await bcrypt.hash(password,10)
            // verified code expiry 
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifiedCode: verifyCode,
                verifedCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save();
        }

        // sending verification email
        const emailResponse:any = await sendVerificationEmail(email,username,verifyCode)
        //TODO: see what in response
        console.log("verification send email response",emailResponse)

        if(!emailResponse){
            return Response.json({
                success: false,
                message: emailResponse.message
            },
            {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: "User Register successfully but not verfied!"
        },
        {
            status: 201
        })

    } catch (error) {
        console.error("Error during Registuring user", error)
        return Response.json({
            success: false,
            message: "Registration Failed"
        },
        {
            status: 500
        })
    }
}