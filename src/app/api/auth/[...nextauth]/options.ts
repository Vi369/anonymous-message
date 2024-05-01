import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'
import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials:{
                username: { label: "Email", type: "email", placeholder: "Enter Your email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(Credentials:any):Promise<any> {
                await connentDb()
                console.log("username or password", Credentials.identifier.email,Credentials.identifier.username)
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: Credentials.identifier.email},
                            {username: Credentials.identifier.username}
                        ]            
                    })

                    // if user not found
                    if(!user){
                        throw new Error('No user found with this Credentials')
                    }

                    if(!user.isVerified){
                        throw new Error("Please verified your account first, Before login.")
                    }

                    // check password 
                    const isPasswordCorrect = await bcrypt.compare(Credentials.password, user.password)

                    // if password correct 
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect Password")
                    }
                } catch (error:any) {
                    throw new Error(error)
                }
              },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
          return session
        },
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username

            }
          return token
        }
    },
    
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}
