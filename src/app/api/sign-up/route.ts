import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ResponseObj } from "@/helpers/ResponseObj";


export async function POST(request:Request) {
    await connentDb()

    try {
        const {username, email, Password} = await request.json()
        // checking if username already taken
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
    
        if(existingVerifiedUserByUsername){
            return Response.json(
                new ResponseObj(false, "This Username already exist"),
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
                return Response.json(new ResponseObj(false,"Email already exist"),
                {
                    status: 400
                })
            }else{
                // update user details and save  
                const hashedPassword = await bcrypt.hash(Password,10)

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifiedCode = verifyCode;
                existingUserByEmail.verifedCodeExpiry = new Date(Date.now()+ 3600000);

                await existingUserByEmail.save();

            }
        }else{
            // hashed user password
            const hashedPassword = await bcrypt.hash(Password,10)
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
                isAcceptingMessages: true,
                messages: [],
            })

            await newUser.save();
        }

        // sending verification email
        const emailResponse:any = await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse){
            return Response.json( new ResponseObj(false, emailResponse.message),
            {
                status: 500
            })
        }
        return Response.json( new ResponseObj(true, "User Register successfully but not verfied!"),
        {
            status: 201
        })

    } catch (error) {
        console.error("Error during Registuring user", error)
        return Response.json( new ResponseObj(false, "Registration Failed"),
        {
            status: 500
        })
    }
}