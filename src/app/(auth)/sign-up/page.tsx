"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader} from "lucide-react"


function SignUp() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('') 
    const [checkingUserNameUnique, setCheckingUserNameUnique] = useState(false) // loading state
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)

    // debouncing username value
    const debounced = useDebounceCallback(setUsername, 400);
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues:{
            username: '',
            email: '',
            Password: '',
        }
    })

    useEffect(()=>{
        const isUserNameUnique = async ()=>{
            if(username){
                setCheckingUserNameUnique(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error During checking username uniqueness!"
                    )
                }finally{
                    setCheckingUserNameUnique(false)
                }
            }
        }
        // checking username unique function call
        isUserNameUnique();
    },[username])

    // on form submit
    const onSubmitHandler = async(data: z.infer<typeof signUpSchema>)=>{
        setIsFormSubmitting(true)
        try {
            const res = await axios.post(`/api/sign-up`,data);
            if(res.data.success){
                toast({
                    description: res.data.message,
                })
                // redirect to verify page
                router.push(`/verify-email/${username}`)
            }else{
                toast({
                    description: res.data.message,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            console.log("error during signup user:", error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message || 'There was a problem with your sign-up. Please try again.';
            toast({
                description: errorMessage,
                variant: 'destructive'
            })
        }finally{            
            // set is submitting status false
            setIsFormSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            {/* heading */}
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join Anonymous Feedback
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
            </div>

            {/* form field */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-5">
                    {/* username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Choose a username" {...field}
                                    onChange={(e)=>{
                                        field.onChange(e);
                                        debounced(e.target.value)
                                    }}
                                    />
                                </FormControl>
                                    {checkingUserNameUnique && <Loader className="mr-2 h-4 w-4 animate-spin"/>}
                                <FormDescription>
                                    {!usernameMessage ? ('Username min 5 characters long and not include special characters.'):(<p className={`${usernameMessage==='Username is Available'? ('text-green-500'):('text-red-500')}`}>{usernameMessage}</p>)}    
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                     />

                     {/* email */}
                     <FormField
                        control={form.control}
                        name="email"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                     />
                     {/* password */}
                     <FormField
                        control={form.control}
                        name="Password"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Set your password" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Password must be 8 charcters long.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                     />
                     <Button type="submit" disabled={isFormSubmitting}>
                        {
                        isFormSubmitting ? 
                        (<>
                            <Loader className="mr-2 h-4 w-4 animate-spin"/>Please wait...
                        </>):('Sign-up')
                        }
                     </Button>
                </form>
            </Form>
            {/* if already member */}
            <div className="text-center mt-2">
                <p>
                    Already a memeber? <Link href={'/sign-in'} className="text-blue-500 hover:text-blue-800">Sign-in</Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default SignUp