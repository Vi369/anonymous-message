import mongoose, {Schema, Document} from 'mongoose'


export interface Message extends Document{
    Content: string;
    createdAt: Date;
}

export const MessageSchema:Schema<Message> = new Schema({
    Content:{
        type:String,
        required: true,
    },
    createdAt:{
        type: Date,
        requird: true,
        default: Date.now
    }
},{timestamps: true})
