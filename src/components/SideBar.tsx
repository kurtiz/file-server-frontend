import {Home, LineChart, Settings, Users2} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {LuFileText} from "react-icons/lu";
import {MdOutlineEmail} from "react-icons/md";

const SideBar = (props: { handleActiveItem?: (itemId: string) => void }) => {
    const [activeItemId, setActiveItemId] = useState<string | null>("dashboard");
    const location = useLocation();

    useEffect(() => {
        setActiveItemId(location.pathname.substring(1));
    }, [location]);

    const handleClick = (itemId: string) => {
        setActiveItemId(itemId);
        props.handleActiveItem?.(itemId); // Call parent's function if provided
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link
                    to="/dashboard" onClick={() => handleClick("dashboard")}
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full border-4 border-primary-foreground bg-primary-foreground
                    text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <img src="/icon.png" width="36"/>
                    <span className="sr-only">File Server</span>
                </Link>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/dashboard" onClick={() => handleClick("dashboard")}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                    activeItemId === 'dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <Home className="h-5 w-5"/>
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/files" onClick={() => handleClick("files")}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                    activeItemId === 'files' || activeItemId === 'upload' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <LuFileText className="h-5 w-5"/>
                                <span className="sr-only">Files</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Files</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/emails" onClick={() => handleClick("emails")}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                    activeItemId === 'emails' || activeItemId === 'compose' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <MdOutlineEmail className="h-5 w-5"/>
                                <span className="sr-only">Emails</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Emails</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                to="/customers" onClick={() => handleClick("customers")}
                                className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                    activeItemId === 'customers' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <Users2 className="h-5 w-5"/>
                                <span className="sr-only">Customers</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Customers</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/analytics" onClick={() => handleClick("analytics")}
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                      activeItemId === 'analytics' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <LineChart className="h-5 w-5"/>
                                <span className="sr-only">Analytics</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Analytics</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link to="/settings" onClick={() => handleClick("settings")}
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg  ${
                                      activeItemId === 'settings' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                            >
                                <Settings className="h-5 w-5"/>
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    );
};

export default SideBar;