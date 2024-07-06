import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {LuEye, LuEyeOff} from "react-icons/lu";
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import axios from "axios";
import {useToast} from "@/components/ui/use-toast.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Link, useNavigate} from "react-router-dom";
import {authenticate} from "@/utils/authenticate.ts";
import LoadingOverlay from "@/components/LoadingOverlay.tsx";
import {BASE_URL} from "@/config.ts";

const formSchema = z.object({
    email: z.string().email({message: "Enter a valid email!"}),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});


const SignInPage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },

    });

    const {toast} = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [signInMethod, setSignInMethod] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticate()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleTabValueChange = (value: string) => {
        setSignInMethod(value);
    }

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        toast({
            description: "logging in....",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>,
        });

        setIsLoading(true);

        const options = {
            method: 'POST',
            url: `${BASE_URL}/${signInMethod}/login`,
            headers: {'Content-Type': 'application/json'},
            data: {
                email: values.email,
                password: values.password
            }
        };

        axios.request(options).then((response) => {
            setIsLoading(false);
            if (response.status === 200) {
                toast({
                    description: "Logged in successfully!",
                });
                if (response.data.data.emailVerified) {
                    setTimeout(() => navigate("/dashboard"), 1500);
                    sessionStorage.removeItem("email");

                    sessionStorage.setItem("name", response.data.data.fullname);
                    sessionStorage.setItem("token", response.data.data.authentication.session.token);
                    sessionStorage.setItem("user_type", signInMethod);
                } else {
                    sessionStorage.setItem("email", response.data.data.email);
                    navigate("/verify");
                }

            } else {
                toast({
                    description: response.data.error,
                    variant: "destructive",
                });
            }
        }).catch((error) => {
            setIsLoading(false);
            toast({
                description: error.response?.data.error || error.message,
                variant: "destructive",
            });
        });
    }

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
                                <CardTitle>Admin Login</CardTitle>
                                <CardDescription className="text-sm">Access your dashboard here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="email" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
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
                                        <Link to="/reset-password" className="text-sm text-right float-end underline underline-offset-1">Forgot password?</Link>
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
                                <CardTitle>User Login</CardTitle>
                                <CardDescription className="text-sm">Access your dashboard here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="email" {...field} />
                                                    </FormControl>
                                                    <FormDescription>
                                                    </FormDescription>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
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
                                        <Link to="/reset-password" className="text-sm text-right float-end underline underline-offset-1">Forgot password?</Link>
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

export default SignInPage;