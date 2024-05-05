"use client"
import React from 'react'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/model/message.model';
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from './ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface MessageCardProps{
    message: Message;
    onMessageDelete: (messageId: string)=>void
}
function MessageCard({message, onMessageDelete}:MessageCardProps) {
    const {toast} = useToast();

    const onConfirmDelete = async()=>{
        try {
            const response = await axios.delete(`/api/delete-message${message._id}`)
            if(response.data?.success){
                toast({
                    description: response.data.message,
                })
            }else{
                toast({
                    description: response.data.message,
                    variant: 'destructive'
                })
            }
            // on message delete TODO: 
            onMessageDelete(message._id)
        } catch (error) {
            console.log("Some Error Occured during delete message response")
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message ?? 'Failed to delete message try again!',
                variant: 'destructive'
            })
        }
    }
    return (
        <div>
            <Card>
                <CardHeader> 
                    {/* TODO: improve */}
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button variant={'destructive'}><X className='w-5 h-5'/></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick = {onConfirmDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>
            </Card>

        </div>
    )
}

export default MessageCard