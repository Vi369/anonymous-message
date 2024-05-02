"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/message.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {Loader, RefreshCwIcon} from 'lucide-react'
import MessageCard from '@/components/MessageCard'
function Dashboard() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [switchState, setSwitchState] = useState(false)
    const {toast} = useToast()

    //optimistic ui approach delete message show
    const HandleDeleteMessage = (messageId:string)=>{
        // add all value but in filter way 
        setMessages(
            messages.filter((message)=> (message._id !== messageId))
        )
    }

    // user session 
    const {data: session} = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const {register, watch,setValue} = form;
    // watch 
    const acceptMessages = watch('acceptMessages')
    // checking accept message or not
    const checkingAcceptMessageStatus = useCallback(async()=>{
        setSwitchState(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message')
            setValue('acceptMessages', response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }finally{
            setSwitchState(false)
        }
    },[setValue])

    // get all messages
    const getAllMessages = useCallback(async(refresh:boolean = false)=>{
        setIsLoading(true)
        setSwitchState(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || []);
            if(refresh){
                toast({
                    description: "Showing latest messages wait.."
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }finally{
            setIsLoading(false)
            setSwitchState(false)
        }
    },[setIsLoading, setMessages])

    // handle switch change 
    const handleSwitchChangeState = async()=>{
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message',{
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', response.data.isAcceptingMessages)
            toast({
                description: response.data.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message || 'Faild to Load Messages!',
                variant: 'destructive'
            })
        }
    }

    if(!session || !session.user){
        // page component define
        return <h1>Please Login!</h1>
    }

    const {username} = session?.user

    // const router = useRouter();
    const profileURL = `${process.env.NEXT_PUBLIC_BASE_PATH}/u/${username}`
    
    // copy to clipBoard 
    const CopyToClipboard = ()=>{
        window.navigator.clipboard.writeText(profileURL);
        console.log(window.navigator.clipboard.writeText(profileURL))
        toast({
            description: "Link Copied successfully!"
        })
    }

    // useEffect 
    useEffect(()=>{
        if(!session || !session.user){
            toast({
                description: "Session Expire please login Again!"
            })
        }
        checkingAcceptMessageStatus();
        getAllMessages();
        

    },[checkingAcceptMessageStatus, getAllMessages, session, setValue])

    console.log("accept message", acceptMessages)

    return(
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
            <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
             <div className='mb-4'>
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className='flex items-center'>
                    <input 
                        type='text'
                        value={profileURL}
                        disabled
                        className='input input-bordered w-full p-2 mr-2'
                    />
                    <Button onClick={CopyToClipboard}>Copy</Button>
                </div>
             </div>
             {/* switch button */}
             <div className='mb-2'>
                <Switch 
                     {...register('acceptMessages')}
                     checked={acceptMessages}
                     onCheckedChange={handleSwitchChangeState}
                     disabled = {switchState}
                />
                <span className="ml-4">
                 Accept Messages: {acceptMessages? 'On':'Off'}
                </span>
             </div>
             {/* seperator */}
             <Separator />

             {/* get all messages button */}
             <Button 
                className='mt-4'
                variant={'outline'}
                onClick={(e)=>{
                    e.preventDefault()
                    getAllMessages(true)
                }}
            >
                {isLoading? (<>
                 <Loader className='animate-spin h-5 w-5'/>
                </>):(<>
                 <RefreshCwIcon className='h-5 w-5' />
                </>)}
             </Button>

             {/* messages grid */}
             <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                {messages.length >0 ?(messages.map((message,index)=>(
                    <MessageCard 
                        key={message._id}
                        message={message}
                        onMessageDelete={HandleDeleteMessage}
                    />
                ))):(<p className='text-2xl font-semibold'>No messages to display.</p>) }
             </div>
        </div>
    )
}

export default Dashboard