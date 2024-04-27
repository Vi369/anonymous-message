"use client"
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function page() {
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues:{
            identifire: '',
            password: ''
        }
    })

    // handle submit
    const onSubmitHandler = async(data: z.infer<typeof signInSchema>)=>{
        setIsFormSubmitting(true)
        try {
            const responseSignIn = await signIn('Credentials', {
                redirect: false,
                identifire: data.identifire,
                password: data.password
            })
            // TODO: 
            console.log("res sign in :", responseSignIn)
    
            if(responseSignIn?.error){
                toast({
                    description: "Incorrect username or passaword.Please check and try again",
                    variant: 'destructive'
                })
            }
    
            if(responseSignIn?.url){
                router.replace('/my-dashboard')
            }
        } catch (error) {
            console.log("Error during sign in with auth:", error)
            toast({
                description: "Something went worng please try again",
                variant: 'destructive'
            })
        }finally{
            setIsFormSubmitting(false)
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            {/* heading */}
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Sign-In
                </h1>
                <p className="mb-4">Sign in to continue your secret Feedback or Conversations</p>
            </div>
            {/* form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHandler)} className='space-y-5'>
                    <FormField
                        name="identifire"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email/Username</FormLabel>
                            <Input {...field} placeholder='Email or username'/>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" {...field} placeholder='Password' />
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' disabled={isFormSubmitting}>
                        {
                        isFormSubmitting ? 
                        (<>
                            <Loader className="mr-2 h-4 w-4 animate-spin"/>Please wait...
                        </>):('Sign-In')
                        }
                     </Button>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default page