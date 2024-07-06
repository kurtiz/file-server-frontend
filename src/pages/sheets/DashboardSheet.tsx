import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {ArrowUpRight, FileDown, FileUp, User} from 'lucide-react';
import {MdAlternateEmail} from 'react-icons/md';
import {Avatar, AvatarFallback, AvatarImage,} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import ChunkCard from '@/components/ChunkCard';
import {Skeleton} from '@/components/ui/skeleton';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import getIconUrl from '@/utils/icons';
import {BASE_URL} from '@/config';

const DashboardSheet: React.FC<{ navigateTo: (page: string) => void }> = ({navigateTo}) => {
    const [data, setData] = useState({
        totalFiles: "0",
        totalFilesDownloads: "0",
        totalEmailsSent: "0",
        usersCount: "0",
        recentFiles: [],
        recentEmails: [],
        loadedRecentEmails: false,
        loadedTotalFiles: false,
        loadedTotalFilesDownloads: false,
        loadedUserCount: false,
        loadedRecentFiles: false,
        loadedEmailCount: false,
    });

    const fetchData = async () => {
        const axiosInstance = axios.create({
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${sessionStorage.getItem("token")}`
            },
        });

        try {
            const [
                downloadsCountRes,
                filesCountRes,
                emailsCountRes,
                usersCountRes,
                recentFilesRes,
                recentEmailsRes
            ] = await Promise.all([
                axiosInstance.get(`${BASE_URL}/admin/downloads/count`),
                axiosInstance.get(`${BASE_URL}/admin/files/count`),
                axiosInstance.get(`${BASE_URL}/admin/emails/count`),
                axiosInstance.get(`${BASE_URL}/admin/users/count`),
                axiosInstance.get(`${BASE_URL}/admin/files/recent`),
                axiosInstance.get(`${BASE_URL}/admin/emails/recent`)
            ]);

            setData({
                totalFilesDownloads: downloadsCountRes.data.data.count,
                totalFiles: filesCountRes.data.data.count,
                totalEmailsSent: emailsCountRes.data.data.count,
                usersCount: usersCountRes.data.data.count,
                recentFiles: recentFilesRes.data.data,
                recentEmails: recentEmailsRes.data.data,
                loadedRecentEmails: true,
                loadedTotalFiles: true,
                loadedTotalFilesDownloads: true,
                loadedUserCount: true,
                loadedRecentFiles: true,
                loadedEmailCount: true
            });
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData().then();
    }, []);

    const {
        totalFiles,
        totalFilesDownloads,
        totalEmailsSent,
        usersCount,
        recentFiles,
        recentEmails,
        loadedRecentEmails,
        loadedTotalFiles,
        loadedTotalFilesDownloads,
        loadedUserCount,
        loadedRecentFiles,
        loadedEmailCount,
    } = data;

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <ChunkCard
                    cardTitle="Total Files Uploaded"
                    cardContent={totalFiles.toLocaleString()}
                    cardIcon={<FileUp className="h-6 w-6 text-muted-foreground"/>}
                    isLoaded={loadedTotalFiles}
                />
                <ChunkCard
                    cardTitle="Total File Downloads"
                    cardContent={totalFilesDownloads.toLocaleString()}
                    cardIcon={<FileDown className="h-6 w-6 text-muted-foreground"/>}
                    isLoaded={loadedTotalFilesDownloads}
                />
                <ChunkCard
                    cardTitle="Total Emails Sent"
                    cardContent={totalEmailsSent.toLocaleString()}
                    cardIcon={<MdAlternateEmail className="h-6 w-6 text-muted-foreground"/>}
                    isLoaded={loadedEmailCount}
                />
                <ChunkCard
                    cardTitle="Total Users"
                    cardContent={usersCount.toLocaleString()}
                    cardIcon={<User className="h-6 w-6 text-muted-foreground"/>}
                    isLoaded={loadedUserCount}
                />
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Files</CardTitle>
                            <CardDescription>Recent uploaded files.</CardDescription>
                        </div>
                        <Button asChild size="sm" onClick={() => navigateTo("files")} className="ml-auto gap-1">
                            <div className="cursor-pointer">
                                View All
                                <ArrowUpRight className="h-4 w-4"/>
                            </div>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Type</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Uploaded by</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadedRecentFiles ? (
                                    recentFiles.length > 0 ? (
                                        recentFiles.map((row: {
                                            _id: string,
                                            title: string,
                                            path: string,
                                            fileSize: string,
                                            createdAt: string,
                                            uploadedBy: { fullname: string }
                                        }) => (
                                            <TableRow key={row._id}>
                                                <TableCell dangerouslySetInnerHTML={{
                                                    __html: `<img src=${getIconUrl(row.path)} class="h-8" alt="Avatar"/>`
                                                }}/>
                                                <TableCell>{row.title}</TableCell>
                                                <TableCell>{row.fileSize}</TableCell>
                                                <TableCell>{new Date(row.createdAt).toDateString()}</TableCell>
                                                <TableCell className="text-right">{row.uploadedBy.fullname}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <>
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">
                                                    <img src="/no-data.png" className="w-56 mx-auto"
                                                         alt="inbox"/>
                                                    <p className="text-lg">No Files!</p>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )
                                ) : (
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-[50px]"/></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px]"/></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[50px]"/></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]"/></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px] float-end"/></TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Emails</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8">
                        {loadedRecentEmails ? (
                            recentEmails.length > 0 ? (
                                recentEmails.map((row: {
                                    _id: string,
                                    subject: string,
                                    sentByUser: { fullname: string, email: string }
                                    sentByAdmin: { fullname: string, email: string }
                                }) => (
                                    <div key={row._id} className="flex items-center gap-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar"/>
                                            <AvatarFallback>{
                                                row.sentByUser?.fullname.slice(0, 2).toUpperCase() ||
                                                row.sentByAdmin?.fullname.slice(0, 2).toUpperCase()
                                            }</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">{row.subject}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {row.sentByUser?.fullname || row.sentByAdmin?.fullname}
                                                ({row.sentByUser?.email || row.sentByAdmin?.email})
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex justify-center items-center gap-4">
                                        <img src="/inbox.png" className="w-56" alt="inbox"/>
                                    </div>
                                    <p className="text-center text-lg">No Emails!</p>
                                </>
                            )
                        ) : (
                            [...Array(5)].map((_, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Skeleton className="h-9 w-9 rounded-full"/>
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            <Skeleton className="h-6 w-[150px]"/>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <Skeleton className="h-5 w-[250px]"/>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default DashboardSheet;
