"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'

function VerifyEmail() {
    const params = useParams();
    const router = useRouter();
    const [checkingVerify,setCheckingVerify] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmitHandler = async(data: z.infer<typeof verifySchema>)=>{
        setCheckingVerify(true)
        try {
            console.log("params username and code",params.username,data.code)
            const response = await axios.post('/api/verify-email-code',{
                username: params.username,
                code: data.code
            })
            // TODO: 
            console.log("verify response:", response)
            console.log("verify response:", response.data.success)
            if(response.data.success){
                toast({
                    description: response.data.message,
                    variant: 'default'
                })
                router.replace('/sign-in')
            }else{
                toast({
                    description: response.data.message || 'Check Provided OTP and try Again!',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                description: axiosError.response?.data.message?? 'Something Went Wrong.Please try again!',
                variant: 'destructive'
            })
        }finally{
            setCheckingVerify(false)
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                {/* heading */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Email
                    </h1>
                    <p className="mb-4">Enter the 6-digit verification code from your email.</p>
                </div>

                {/* form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-6'>
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                {/* <Input placeholder="shadcn" {...field} /> */}
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup >
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    {/* <InputOTPSeparator /> */}
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={checkingVerify}>
                        {checkingVerify? (<> <Loader className='animate-spin'/>Please wait..</>):('Verify')}
                    </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyEmail