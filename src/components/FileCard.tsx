import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import React, {useEffect, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {Loader2, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {z} from "zod";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useToast} from "@/components/ui/use-toast.ts";
import axios from "axios";
import {BASE_URL} from "@/config.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {truncateWord} from "@/utils/common.ts";

const formSchema = z.object({
    title: z.string().min(1, {message: "Title is required!"}),
    description: z.string().min(1, {message: "Please enter a description!"}),
});

const FileCard = (props: {
    fileID: string;
    fileTitle: string;
    fileSize: string;
    fileIcon: React.ReactNode;
    fileDescription?: string;
    createdAt: string;
}) => {
    const {fileID, fileTitle, fileSize, fileIcon, fileDescription, createdAt} = props;

    const [isDisabled, setIsDisabled] = useState(true);
    const {toast} = useToast();
    const newTab = (url: string) => window?.open(url, "_blank")?.focus();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: fileTitle,
            description: fileDescription || "",
        },
    });

    const {reset, watch, formState} = form;
    const {isDirty, dirtyFields} = formState;

    const [fileCardTitle, setFileCardTitle] = useState(fileTitle);
    useEffect(() => {
        reset({title: fileTitle, description: fileDescription || ""});
        setFileCardTitle(fileTitle);
    }, [fileTitle, fileDescription, reset]);

    const axiosDeleteInstance = axios.create({
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });

    const axiosUpdateInstance = axios.create({
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });


    const handleView = () => {
        setIsDisabled(true);
    };

    const handleEdit = () => {
        setIsDisabled(!isDisabled);
    };

    const handleSave = (fileID: string) => {
        if (isDirty) {
            const updatedData = {
                title: dirtyFields.title ? watch("title") : fileTitle,
                description: dirtyFields.description ? watch("description") : fileDescription,
            };
            axiosUpdateInstance.patch(`${BASE_URL}/admin/file/update/${fileID}`, updatedData).then(response => {
                if (response.status === 200) {

                    toast({description: "File updated successfully!"});
                    setFileCardTitle(updatedData.title);
                } else {
                    toast({
                        description: response.data.error,
                        variant: "destructive"
                    });
                }
            })
            setIsDisabled(true);
        } else {
            toast({description: "No changes made!"});
        }
    };

    const handleDelete = (fileData: { fileID: string }) => {
        toast({
            description: "Deleting file...",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin"/>,
        })

        axiosDeleteInstance.delete(`${BASE_URL}/admin/file/delete/${fileData.fileID}`)
            .then((response) => {
                if (response.status === 200) {
                    toast({description: "File deleted successfully!"});
                } else {
                    toast({
                        description: response.data.error,
                        variant: "destructive"
                    });
                }
            }).catch((error) => {
            console.error("Error deleting file:", error);
            toast({
                description: "Error deleting file!",
                variant: "destructive"
            });
        });
    };

    const handleDownload = () => {
        newTab(`${BASE_URL}/file/download/request/${fileID}`);
    };

    return (
        <Card x-chunk="dashboard-01-chunk-0" className="hover:bg-gray-50 cursor-pointer relative">
            <div className="absolute top-2 right-3">
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4"/>
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DialogTrigger asChild>
                                <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem onClick={() => handleDelete(props)}>Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-md">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit(() => handleSave(fileID))}>
                                <DialogHeader>
                                    <DialogTitle>Edit File</DialogTitle>
                                    <DialogDescription>Edit and update the file.</DialogDescription>
                                </DialogHeader>

                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="title"
                                                       disabled={isDisabled} {...field} />
                                            </FormControl>
                                            <FormDescription></FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="description" disabled={isDisabled}
                                                          rows={4} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {/*TODO add number of emails the file has been sent in || both front end and backend*/}

                                <DialogFooter className="sm:justify-start mt-5">
                                    <Button type="button" onClick={handleEdit} variant="ghost">
                                        {isDisabled ? "Edit" : "Cancel"}
                                    </Button>
                                    {isDirty &&
                                        (<Button type="submit" className="px-3">
                                            Save
                                        </Button>)
                                    }
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    </DialogContent>
                </Dialog>
            </div>
            <CardHeader className="flex flex-row items-center justify-center space-y-5 pb-2">
                {fileIcon}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="truncate">{truncateWord(fileCardTitle, 15)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{fileCardTitle}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <p className="text-xs justify-between gap-2 text-muted-foreground">{fileSize} ● {new Date(createdAt).toDateString()}</p>
            </CardContent>
        </Card>
    );
};

export default FileCard;
