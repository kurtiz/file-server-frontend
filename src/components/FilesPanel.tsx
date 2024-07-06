import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListFilter, Plus, Search } from "lucide-react";
import FileCardSkeleton from "@/components/FileCardSkeleton";
import getIconUrl from "@/utils/icons";
import { BASE_URL } from "@/config";
import FileCardEmail from "@/components/FileCardEmail.tsx";

const FilesPanel: React.FC<{ navigateTo: (page: string) => void, addFile: (id: string, fileTitle: string) => void, selectedFile: string }> = ({ navigateTo, addFile, selectedFile }) => {
    const [sizeFilter, setSizeFilter] = useState<"asc" | "desc" | "">("");
    const [dateFilter, setDateFilter] = useState<"asc" | "desc" | "">("");
    const [files, setFiles] = useState([]);
    const [isFilesLoaded, setIsFilesLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const axiosInstance = axios.create({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${sessionStorage.getItem("token")}`
                },
            });

            try {
                const response = await axiosInstance.get(`${BASE_URL}/admin/files`);
                setFiles(response.data.data);
                setIsFilesLoaded(true);
            } catch (error) {
                setIsFilesLoaded(true);
                console.error("Error fetching files:", error);
            }
        };

        fetchData().then();
    }, []);

    const handleFilterClick = (filterOption: string, order: "asc" | "desc" | "") => {
        if (filterOption === "size") {
            setSizeFilter(order);
            setDateFilter("");
        } else if (filterOption === "date") {
            setDateFilter(order);
            setSizeFilter("");
        }
    };

    const applyFilters = (file: { title: string, fileSize: string, createdAt: string }) => {
        return file.title.toLowerCase().includes(searchTerm.toLowerCase());
    };

    const convertToBytes = (size: string) => {
        const [value, unit] = size.split(" ");
        const parsedValue = parseFloat(value);
        switch (unit.toLowerCase()) {
            case "gb":
                return parsedValue * 1024 * 1024 * 1024;
            case "mb":
                return parsedValue * 1024 * 1024;
            case "kb":
                return parsedValue * 1024;
            case "bytes":
            default:
                return parsedValue;
        }
    };

    const sortFiles = (files: any[]) => {
        let sortedFiles = [...files];
        if (sizeFilter) {
            sortedFiles.sort((a, b) => {
                const sizeA = convertToBytes(a.fileSize);
                const sizeB = convertToBytes(b.fileSize);
                return sizeFilter === "asc" ? sizeA - sizeB : sizeB - sizeA;
            });
        } else if (dateFilter) {
            sortedFiles.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateFilter === "asc" ? dateA - dateB : dateB - dateA;
            });
        }
        return sortedFiles;
    };

    const filteredFiles = sortFiles(files.filter(applyFilters));

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Files</CardTitle>
                    <CardDescription>
                        <div className="justify-between items-center flex gap-2">
                            Add file to email from here. Click on the file to select it.
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
                        </div>
                        <br/>
                        <div className="flex items-center">
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-7 gap-1">
                                            <ListFilter className="h-3.5 w-3.5"/>
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Filter
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuLabel>Size</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup value={sizeFilter}
                                                                onValueChange={(value) => handleFilterClick("size", value as "asc" | "desc")}>
                                            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuLabel>Date</DropdownMenuLabel>
                                        <DropdownMenuRadioGroup value={dateFilter}
                                                                onValueChange={(value) => handleFilterClick("date", value as "asc" | "desc")}>
                                            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button size="sm" className="h-7 gap-1" onClick={() => navigateTo("upload")}>
                                    <Plus className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Upload File
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="overflow-auto h-[210px]">
                    <div className="grid gap-4 grid-cols-2">
                        {isFilesLoaded ? (
                            filteredFiles.length > 0 ? (
                                filteredFiles.map((file: {
                                    _id: string,
                                    title: string,
                                    path: string,
                                    fileSize: string,
                                    description: string,
                                    createdAt: string
                                }) => (
                                    <FileCardEmail
                                        onClick={addFile.bind(null, file._id, file.title)}
                                        key={file._id}
                                        fileID={file._id}
                                        fileTitle={file.title}
                                        fileIcon={<img src={getIconUrl(file.path)} alt="File Icon"
                                                       className="h-12 w-12 text-muted-foreground"/>}
                                        fileSize={`${parseFloat(file.fileSize.split(" ")[0]).toFixed(1)} ${file.fileSize.split(" ")[1]}`}
                                        fileDescription={file.description}
                                        createdAt={file.createdAt}
                                        isSelected={file._id === selectedFile}
                                    />
                                ))
                            ) : (
                                <div className="flex justify-center items-center gap-4">
                                    <img src="/no-data.png" className="w-56" alt="inbox"/>
                                </div>
                            )
                        ) : (
                            [...Array(12)].map((_, index) => <FileCardSkeleton key={index}/>)
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default FilesPanel;
