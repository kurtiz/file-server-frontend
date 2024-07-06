"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,} from "@/components/ui/input-otp"
import {toast} from "@/components/ui/use-toast"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Loader2} from "lucide-react";
import axios from "axios";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "@/config.ts";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

const PasswordOtpVerification = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    const [signInMethod, setSignInMethod] = useState("admin");
    const navigate = useNavigate();

    const handleTabValueChange = (value: string) => {
        setSignInMethod(value);
    }

    const onResend = () => {
        console.log("resend")
        toast({
            description: "Resending OTP code....",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>,
        });

        if (!sessionStorage.getItem("email")) {
            toast({
                description: "Email not found in session! Your session has probably expired.",
                variant: "destructive",
            });
            return;
        }

        const options = {
            method: 'POST',
            url: `${BASE_URL}/${signInMethod}/password/reset-initialize`,
            headers: {'Content-Type': 'application/json'},
            data: {
                email: sessionStorage.getItem("email")
            }
        };

        axios.request(options).then((response) => {
            if (response.status === 200) {
                toast({
                    description: "OTP sent successfully!",
                });

                console.log(response.data)
            } else {
                toast({
                    description: response.data.error,
                    variant: "destructive",
                });
            }
        }).catch((error) => {
            toast({
                description: error.response?.data.error || error.message,
                variant: "destructive",
            });
        });
    }

    const onSubmit = (values: z.infer<typeof FormSchema>) => {
        toast({
            description: "Verifying email....",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>,
        });

        if (!sessionStorage.getItem("email")) {
            toast({
                description: "Email not found in session! Your session has probably expired.",
                variant: "destructive",
            });
            return;
        }

        const options = {
            method: 'POST',
            url: `${BASE_URL}/${signInMethod}/otp/verify`,
            headers: {'Content-Type': 'application/json'},
            data: {
                otp: values.pin,
                email: sessionStorage.getItem("email")
            }
        };

        axios.request(options).then((response) => {
            if (response.status === 200) {
                toast({
                    description: "Email verified successfully!",
                });

                sessionStorage.setItem("name", response.data.data.fullname);
                sessionStorage.setItem("resetToken", response.data.data.authentication.session.token);

                setTimeout(() => navigate("/new-password"), 1500);
            } else {
                toast({
                    description: response.data.error,
                    variant: "destructive",
                });
            }
        }).catch((error) => {
            toast({
                description: error.response?.data.error || error.message,
                variant: "destructive",
            });
        });
    }


    return (
        <div className="h-screen flex items-center justify-center">
            <Tabs onValueChange={handleTabValueChange} defaultValue="admin" className="align-middle w-1/4">
                <TabsList>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                    <TabsTrigger value="user">User</TabsTrigger>
                </TabsList>
                <TabsContent value="admin">
                    <Card className="card">
                        <CardHeader>
                            <CardTitle>Verify Admin Email</CardTitle>
                            <CardDescription className="text-sm">
                                Verify your request with the OTP code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="pin"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>One-Time Password</FormLabel>
                                                <FormControl>
                                                    <InputOTP maxLength={6} {...field}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0}/>
                                                            <InputOTPSlot index={1}/>
                                                            <InputOTPSlot index={2}/>
                                                        </InputOTPGroup>
                                                        <InputOTPSeparator/>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3}/>
                                                            <InputOTPSlot index={4}/>
                                                            <InputOTPSlot index={5}/>
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormDescription>
                                                    Please enter the one-time password sent to your email.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="justify-center flex items-center">
                            <CardDescription>Didn't receive an OTP? </CardDescription>
                            <Button onClick={onResend} variant="ghost"
                                    className="text-sm ml-1 underline underline-offset-1">
                                Resend
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="user">
                    <Card className="card">
                        <CardHeader>
                            <CardTitle>Verify User Email</CardTitle>
                            <CardDescription className="text-sm">
                                Verify your request with the OTP code.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="pin"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>One-Time Password</FormLabel>
                                                <FormControl>
                                                    <InputOTP maxLength={6} {...field}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0}/>
                                                            <InputOTPSlot index={1}/>
                                                            <InputOTPSlot index={2}/>
                                                        </InputOTPGroup>
                                                        <InputOTPSeparator/>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={3}/>
                                                            <InputOTPSlot index={4}/>
                                                            <InputOTPSlot index={5}/>
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormDescription>
                                                    Please enter the one-time password sent to your email.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                        </CardContent>
                        <CardFooter className="justify-center flex items-center">
                            <CardDescription>Didn't receive an OTP? </CardDescription>
                            <Button onClick={onResend} variant="ghost"
                                    className="text-sm ml-1 underline underline-offset-1">
                                Resend
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default PasswordOtpVerification;
