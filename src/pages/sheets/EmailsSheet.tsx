import {Button} from "@/components/ui/button.tsx";
import {Loader2, MoreHorizontal, Search} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import React, {useEffect, useState} from "react";
import {BiMailSend} from "react-icons/bi";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import axios from "axios";
import {BASE_URL} from "@/config.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {AvatarImage} from "@/components/ui/avatar.tsx";
import {truncateWord} from "@/utils/common.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Dialog, DialogContent} from "@/components/ui/dialog";
import {DialogTrigger} from "@/components/ui/dialog.tsx";
import DOMPurify from "dompurify";
import {toast} from "@/components/ui/use-toast.ts";

const EmailsSheet: React.FC<{ navigateTo: (page: string) => void }> = ({navigateTo}) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [loadedEmails, setLoadedEmails] = useState(false);
    const [emails, setEmails] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState<string>("");

    const axiosInstance = axios.create({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
    });

    const axiosDeleteInstance = axios.create({
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
    });

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/${sessionStorage.getItem("user_type")}/emails`);
            setEmails(response.data.data);
            setLoadedEmails(true);
        } catch (error) {
            setLoadedEmails(true);
            console.error("Error fetching emails:", error);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    const handleDeleteClick = (id: string) => {
        setDeleteRowId(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        handleDelete(deleteRowId);
        setDeleteDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        toast({
            title: "Deleting email....",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
        });
        axiosDeleteInstance
            .delete(`${BASE_URL}/admin/email/delete/${id}`)
            .then(() => {
                setEmails(emails.filter((email: { _id: string }) => email._id !== id));
                toast({
                    title: "Email deleted successfully",
                    description: "The email has been deleted successfully.",
                });
            })
            .catch((error) => {
                toast({
                    title: "Email deletion failed",
                    description: error.response.data.error,
                });
                console.error("Error deleting email:", error);
            });
    };

    const filteredEmails = emails?.filter((email: { recipient: string; subject: string }) =>
        email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-7 gap-1" onClick={() => navigateTo("compose")}>
                        <BiMailSend className="h-5 w-5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Send Emails
                        </span>
                    </Button>
                </div>
            </div>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Emails</CardTitle>
                    <CardDescription className="justify-between items-center flex gap-2">
                        Manage and view your emails here.
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden w-[100px] sm:table-cell">
                                    <span className="sr-only">Image</span>
                                </TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead className="hidden md:table-cell">Created at</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadedEmails ? (
                                filteredEmails?.length > 0 ? (
                                    filteredEmails.map((row: {
                                        _id: string,
                                        subject: string,
                                        recipient: string,
                                        content: string,
                                        createdAt: string,
                                        sentByUser: { fullname: string, email: string }
                                        sentByAdmin: { fullname: string, email: string }
                                    }) => (

                                        <>
                                            <TableRow key={row._id} className="cursor-pointer">
                                                <TableCell className="hidden sm:table-cell w-[1%]">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src="/avatars/01.png" alt="Avatar"/>
                                                        <AvatarFallback>{
                                                            row.sentByUser?.fullname.slice(0, 2).toUpperCase() ||
                                                            row.sentByAdmin?.fullname.slice(0, 2).toUpperCase()
                                                        }</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <p className="text-sm text-muted-foreground">
                                                        {row.recipient}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm font-medium">{truncateWord(row.subject, 50)}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-sm text-muted-foreground">
                                                        {truncateWord((row.content).replace(/(<([^>]+)>)/ig, ''), 50)}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(row.createdAt).toDateString()}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog key={row._id}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button aria-haspopup="true" size="icon"
                                                                        variant="ghost">
                                                                    <MoreHorizontal className="h-4 w-4"/>
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DialogTrigger asChild>
                                                                    <DropdownMenuItem>View</DropdownMenuItem>
                                                                </DialogTrigger>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDeleteClick(row._id)}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <DialogContent className="sm:max-w-md">
                                                            <p className="text-xl font-bold">{row.subject}
                                                                <p className="text-sm text-muted-foreground">{row.recipient}</p>
                                                            </p>
                                                            <p className="mt-2"
                                                               dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(row.content)}}>

                                                            </p>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>

                                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                                <DialogContent className="sm:max-w-md">
                                                    <h2 className="text-xl font-bold">Confirm Delete</h2>
                                                    <p>Are you sure you want to delete this email?</p>
                                                    <div className="mt-4 flex justify-end gap-2">
                                                        <Button variant="ghost"
                                                                onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                                        <Button variant="destructive"
                                                                onClick={confirmDelete}>Delete</Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    ))
                                ) : (
                                    <>
                                        <TableRow className="w-full">
                                            <TableCell colSpan={6} className="text-center">
                                                <div className="flex flex-col justify-center items-center gap-4">
                                                    <img src="/inbox.png" className="w-56" alt="inbox"/>
                                                    <p className="text-center text-lg">No Emails!</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )
                            ) : (
                                [...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-9 w-9 rounded-full"/></TableCell>
                                            <TableCell> <Skeleton className="h-5 w-[100px]"/></TableCell>
                                            <TableCell><Skeleton className="h-5 w-[150px]"/></TableCell>
                                            <TableCell><Skeleton className="h-5 w-[150px]"/></TableCell>
                                            <TableCell><Skeleton className="h-5 w-[150px]"/></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[25px]"/></TableCell>
                                        </TableRow>
                                    )
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};

export default EmailsSheet;
