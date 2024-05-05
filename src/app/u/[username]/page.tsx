"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/message.model';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { MessageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader } from 'lucide-react';
import { Content } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';

function SendMessage({params}:{params:{username:string}}) {
    const {toast}= useToast();
    const [checkIsAcceptMessagesOrNot, setCheckIsAcceptMessagesOrNot] = useState(false);
    const [isLoading, setIsLoading]= useState(false)
    // const [message, sentMessageContent] = useState('')

    const form = useForm<z.infer<typeof MessageSchema>>({
        resolver: zodResolver(MessageSchema),
    })


    // watching 
    const messageContent = form.watch('content')

    // function user accept message or not 
    const checkUserAcceptMessage = async()=>{
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message');
            console.log("accept message or not res:", response)

            //TODO: 
            if(response.data.isAcceptingMessages){
                setCheckIsAcceptMessagesOrNot(true);

                toast({
                    description: response.data?.message,
                })
            }else{
                toast({
                    description: response.data?.message,
                    variant: 'destructive'
                })
            }
            
            
        } catch (error) {
            console.log("Error during checking user accept messages or not status:", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }
    }

    // send message function
    const onSubmitSendMessage = async(data: z.infer<typeof MessageSchema>)=>{
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                username: params.username,
                content: data.content
            });
            console.log("content message res:", response)
            if(response.data.success){
                toast({
                    description: response.data.message
                })
            }else{
                toast({
                    description: response.data.message,
                    variant: 'destructive'
                })
            }
            // get value from form and reset form
            form.reset({...form.getValues(), content: ""} );
        } catch (error) {
            console.log("Error during send message!", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message
            })
        }finally{
            setIsLoading(false)
        }
    }

    
    // useEffect(()=>{
    //     checkUserAcceptMessage();
    // },[])
    
  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
            <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>
            {/* TODO:  */}
            <div className='mb-4 text-center'>
            <h3>Accepting Messages</h3>
            <Button className='w-15 h-10' onClick={checkUserAcceptMessage}>Check</Button>
            </div>
             <div className='mb-4'>
                <div className='flex flex-col items-center gap-5'>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmitSendMessage)} className='space-y-5'>
                            <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Write Your Feedback...</FormLabel>
                                <FormDescription>Sending a message to {params.username} without revealing your identity</FormDescription>
                                <FormControl>
                                    <Textarea  placeholder="Type your message here." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex justify-center'>
                            {isLoading?(<Button disabled={!isLoading}>
                                <Loader className='animate-spin h-4 w-4'/>{' '}
                                Sending...</Button>):(
                                    <Button type='submit' disabled={!messageContent || isLoading}>Send It</Button>
                                )}
                        </div>
                    </form>
                </Form>   
                
                

                
                </div>
             </div>
        </div>
  )
}

export default SendMessage