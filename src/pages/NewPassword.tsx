import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import axios from "axios";
import {useToast} from "@/components/ui/use-toast.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useNavigate} from "react-router-dom";
import {authenticate} from "@/utils/authenticate.ts";
import LoadingOverlay from "@/components/LoadingOverlay.tsx";
import {BASE_URL} from "@/config.ts";
import {LuEye, LuEyeOff} from "react-icons/lu";

const formSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters!",
    }),
    confirm: z.string().min(8, {
        message: "Password must be at least 8 characters!",
    })
}).refine(
    (data) => data.password === data.confirm,
    {
        message: "Passwords do not match",
        path: ["confirm"],
    }
);


const ResetPassword = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: "",
        },

    });

    const {toast} = useToast();
    const [resetMethod, setResetMethod] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticate()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleTabValueChange = (value: string) => {
        setResetMethod(value);
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        toast({
            description: "Requesting for password reset...",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>,
        });

        setIsLoading(true);

        const options = {
            method: "POST",
            url: `${BASE_URL}/${resetMethod}/password/reset`,
            headers: {
                "Content-Type": "application/json",
                'authorization': `Bearer ${sessionStorage.getItem("resetToken")}`
            },
            data: {
                email: sessionStorage.getItem("email"),
                password: values.password
            },
        };

        axios.request(options)
            .then((response) => {
                setIsLoading(false);
                if (response.status === 200) {
                    toast({
                        description: "Password reset successfully!",
                    });
                    sessionStorage.removeItem("email");
                    navigate("/");
                } else {
                    toast({
                        description: response.data.error,
                        variant: "destructive",
                    });
                }
            })
            .catch((error) => {
                setIsLoading(false);
                toast({
                    description: error.response?.data.error || error.message,
                    variant: "destructive",
                });
            });
    };

    return (
        <>
            <LoadingOverlay isLoading={isLoading} message={"Logging in"}/>
            <div className="h-screen flex items-center justify-center">
                <Tabs onValueChange={handleTabValueChange} defaultValue="admin" className="align-middle w-1/4">
                    <TabsList>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                        <TabsTrigger value="user">User</TabsTrigger>
                    </TabsList>
                    <TabsContent value="admin">
                        <Card className="card">
                            <CardHeader>
                                <CardTitle>Admin Reset Password</CardTitle>
                                <CardDescription className="text-sm">Reset your password here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type={showPassword ? "text" : "password"}
                                                               placeholder="password" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirm"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="flex w-full max-w-sm items-center space-x-2">
                                                            <Input type={showPassword ? "text" : "password"}
                                                                   placeholder="password" {...field} />
                                                            <Button onClick={() => setShowPassword(!showPassword)}
                                                                    size="icon"
                                                                    variant="secondary" type="button">
                                                                {showPassword ? <LuEye size={20}/> :
                                                                    <LuEyeOff size={20}/>}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <Button className="justify-end" type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </CardContent>
                            <CardFooter className="justify-end items-end">
                                <CardDescription>New here? </CardDescription>
                                <a href="/signup" className="text-sm ml-1 underline underline-offset-1">
                                    Sign Up
                                </a>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="user">
                        <Card className="card">
                            <CardHeader>
                                <CardTitle>User Reset Password</CardTitle>
                                <CardDescription className="text-sm">Reset your password here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type={showPassword ? "text" : "password"}
                                                               placeholder="password" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="confirm"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <div className="flex w-full max-w-sm items-center space-x-2">
                                                            <Input type={showPassword ? "text" : "password"}
                                                                   placeholder="password" {...field} />
                                                            <Button onClick={() => setShowPassword(!showPassword)}
                                                                    size="icon"
                                                                    variant="secondary" type="button">
                                                                {showPassword ? <LuEye size={20}/> :
                                                                    <LuEyeOff size={20}/>}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <Button className="justify-end" type="submit">Submit</Button>
                                    </form>
                                </Form>
                            </CardContent>
                            <CardFooter className="justify-end items-end">
                                <CardDescription>New here? </CardDescription>
                                <a href="/signup" className="text-sm ml-1 underline underline-offset-1">
                                    Sign Up
                                </a>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </>
    );
};

export default ResetPassword;