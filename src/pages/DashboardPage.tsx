import {Activity, ArrowUpRight, FileDown, FileUp,} from "lucide-react"
import Header from "@/components/Header.tsx";
import SideBar from "@/components/SideBar.tsx";
import {authenticate} from "@/utils/authenticate.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {MdAlternateEmail} from "react-icons/md";
import ChunkCard from "@/components/ChunkCard.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const DashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticate()) {
            navigate("/");
        }
    }, [navigate]);


    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideBar/>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header/>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                        <ChunkCard
                            cardTitle="Total Files Uploaded"
                            cardContent="45,231.89"
                            cardIcon={<FileUp className="h-6 w-6 text-muted-foreground"/>}
                        />
                        <ChunkCard
                            cardTitle="Total File Downloads"
                            cardContent="45,231.89"
                            cardIcon={<FileDown className="h-6 w-6 text-muted-foreground"/>}
                        />
                        <ChunkCard
                            cardTitle="Total Emails Sent"
                            cardContent="12,234"
                            cardIcon={<MdAlternateEmail className="h-6 w-6 text-muted-foreground"/>}
                        />
                        <ChunkCard
                            cardTitle="Most Downloaded File Type"
                            cardContent="PDF"
                            cardIcon={<Activity className="h-6 w-6 text-muted-foreground"/>}
                        />
                    </div>
                    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                        <Card
                            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
                        >
                            <CardHeader className="flex flex-row items-center">
                                <div className="grid gap-2">
                                    <CardTitle>Recent Files</CardTitle>
                                    <CardDescription>
                                        Recent uploaded files.
                                    </CardDescription>
                                </div>
                                <Button asChild size="sm" className="ml-auto gap-1">
                                    <a href="#">
                                        View All
                                        <ArrowUpRight className="h-4 w-4"/>
                                    </a>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>File Type</TableHead>
                                            <TableHead className="">
                                                File name
                                            </TableHead>
                                            <TableHead className="">
                                                Size
                                            </TableHead>
                                            <TableHead className="">
                                                Date
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Uploaded by
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <img
                                                        src="../../public/files/icons/psd.png"
                                                        width={36}
                                                        height={36}
                                                        alt="Avatar"
                                                        className=""
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                Catherine's Restaurant Flyer.psd
                                            </TableCell>
                                            <TableCell className="">
                                                45.11 MB
                                            </TableCell>
                                            <TableCell className="">
                                                2024-05-12
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Aaron Will Djaba
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <img
                                                        src="../../public/files/icons/html.png"
                                                        width={36}
                                                        height={36}
                                                        alt="Avatar"
                                                        className=""
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                index.html
                                            </TableCell>
                                            <TableCell className="">
                                                215 KB
                                            </TableCell>
                                            <TableCell className="">
                                                2024-03-26
                                            </TableCell>
                                            <TableCell className="text-right">Petter Smith</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <img
                                                        src="../../public/files/icons/ai.png"
                                                        width={36}
                                                        height={36}
                                                        alt="Avatar"
                                                        className=""
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                School Crest Design.ai
                                            </TableCell>
                                            <TableCell className="">
                                                168.23 MB
                                            </TableCell>
                                            <TableCell className="">
                                                2023-06-23
                                            </TableCell>
                                            <TableCell className="text-right">
                                                Matthew Goth
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <img
                                                        src="../../public/files/icons/pdf.png"
                                                        width={36}
                                                        height={36}
                                                        alt="Avatar"
                                                        className=""
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                Internship Application Forms.pdf
                                            </TableCell>
                                            <TableCell className="">
                                                2.30 MB
                                            </TableCell>
                                            <TableCell className="">
                                                2024-04-23
                                            </TableCell>
                                            <TableCell className="text-right">Desmond Kwadwo</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                <div className="font-medium">
                                                    <img
                                                        src="../../public/files/icons/jpg.png"
                                                        width={36}
                                                        height={36}
                                                        alt="Avatar"
                                                        className=""
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                IMG_0025.jpg
                                            </TableCell>
                                            <TableCell className="">
                                                5.71 MB
                                            </TableCell>
                                            <TableCell className="">
                                                2023-06-23
                                            </TableCell>
                                            <TableCell className="text-right">Mathew Goth</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-01-chunk-5">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-8">
                                <div className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/01.png" alt="Avatar"/>
                                        <AvatarFallback>OM</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            Olivia Martin
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            olivia.martin@email.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$1,999.00</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/02.png" alt="Avatar"/>
                                        <AvatarFallback>JL</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            Jackson Lee
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            jackson.lee@email.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$39.00</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/03.png" alt="Avatar"/>
                                        <AvatarFallback>IN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            Isabella Nguyen
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            isabella.nguyen@email.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$299.00</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/04.png" alt="Avatar"/>
                                        <AvatarFallback>WK</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            William Kim
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            will@email.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$99.00</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Avatar className="hidden h-9 w-9 sm:flex">
                                        <AvatarImage src="/avatars/05.png" alt="Avatar"/>
                                        <AvatarFallback>SD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            Sofia Davis
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            sofia.davis@email.com
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">+$39.00</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
export default DashboardPage;