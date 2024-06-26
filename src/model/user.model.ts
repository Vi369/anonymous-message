import mongoose, {Schema, Document} from 'mongoose'
import { Message, MessageSchema } from '@/model/message.model'


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifiedCode: string,
    verifedCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    messages: Message[]
}

const userSchema:Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,"please use a valid email address"],
    },
    password:{
        type: String,
        required: [true, "password is required"],
    },
    verifiedCode:{
        type: String,
        required: [true, "verify code is required"]
    },
    verifedCodeExpiry:{
        type: Date,
        required: [true, "verify code Expiry is required is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true
    },
    messages:{
        type: [MessageSchema]
    }

},{timestamps: true})

const UserModel = (mongoose.models.User as mongoose.Model<User>)|| (mongoose.model<User>("User", userSchema))

export default UserModel