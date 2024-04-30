"use client"
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/message.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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
            setValue('acceptMessages', response.data.isAccesptingMessages)
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
        setSwitchState(true)
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
            setValue('acceptMessages', !acceptMessages)
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

    // useEffect 
    useEffect(()=>{
        if(!session || !session.user){
            toast({
                description: "Session Expire please login Again!"
            })
        }
        getAllMessages();
        checkingAcceptMessageStatus()

    },[checkingAcceptMessageStatus, getAllMessages, session, setValue])

    if(!session || !session.user){
        // page component define
        return <h1>Please Login!</h1>
    }else{
        
    }
  
}

export default Dashboard