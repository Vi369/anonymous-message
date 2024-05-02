import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs'
import connentDb from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials:{
                username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any):Promise<any> {
                if(!credentials.identifier){
                    throw new Error('No credentials provided')
                }
                await connentDb()
                console.log("username or password", credentials.identifier, credentials.password)
                
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
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
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

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
