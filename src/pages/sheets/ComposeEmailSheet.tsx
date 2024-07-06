import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config.ts";
import { toast } from "@/components/ui/use-toast.ts";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button.tsx";
import FilesPanel from "@/components/FilesPanel.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { z } from "zod";

// Define a schema using Zod
const emailSchema = z.object({
    recipient: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required"),
    fileId: z.string().min(1, "File is required, Select a file!"),
});

const ComposeEmailSheet: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
    const [fileId, setFileId] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [subject, setSubject] = useState('');
    const [recipient, setRecipient] = useState('');
    const [value, setValue] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const axiosInstance = axios.create({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${sessionStorage.getItem("token")}`
        },
    });

    const handleSend = () => {
        const emailData = { recipient, subject, message: value, fileId };

        const result = emailSchema.safeParse(emailData);

        if (!result.success) {
            toast({
                title: "Validation Error",
                description: result.error.errors.map((err) => err.message).join(", "),
            });
            return;
        }

        toast({
            title: "Sending email....",
            action: <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        });

        axiosInstance
            .post(`${BASE_URL}/admin/send-email`, result.data)
            .then(() => {
                toast({
                    title: "Email sent!",
                    description: "The email has been sent successfully.",
                });
                navigateTo("emails");
            })
            .catch((error) => {
                toast({
                    title: "Failed to send email!",
                    description: error.response?.data?.error || "An error occurred",
                });
                console.error("Error sending email:", error);
            });
    }

    const addFile = (id: string, fileTitle: string) => {
        toast({
            title: "File Added",
            description: `${fileTitle} has been added successfully.`,
        });
        setFileId(id);
        setSelectedFile(id);
    }

    return (
        <>
            <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                    <CardDescription className="justify-between items-center flex gap-2">
                        Write and send your emails here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto h-[400px]">
                    <div className="grid gap-5 grid-cols-2">
                        <div className="col-span-1 h-[335px]">
                            <Input
                                type="email"
                                className="my-2"
                                placeholder="Recipient"
                                required={true}
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                            <Input
                                type="text"
                                className="mb-2"
                                placeholder="Subject"
                                required={true}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <ReactQuill theme="snow" value={value} onChange={setValue} className="h-[238px]" />
                        </div>
                        <div className="col-span-1">
                            <FilesPanel
                                navigateTo={navigateTo}
                                addFile={addFile}
                                selectedFile={selectedFile}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setDialogOpen(true)}>Send</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <h3 className="text-lg font-bold">Send Email</h3>
                            Are you sure you want to send this email?
                            <div className="mt-4 flex justify-end gap-2">
                                <Button onClick={() => {
                                    setDialogOpen(false);
                                    handleSend();
                                }}>Yes</Button>
                                <Button variant="secondary" onClick={() => setDialogOpen(false)}>No</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </>
    );
};

export default ComposeEmailSheet;
