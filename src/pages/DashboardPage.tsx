import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import {authenticate} from '@/utils/authenticate';
import DashboardSheet from '@/pages/sheets/DashboardSheet';
import FilesSheet from '@/pages/sheets/FilesSheet';
import EmailsSheet from '@/pages/sheets/EmailsSheet.tsx';
import UploadSheet from "@/pages/sheets/UploadSheet.tsx";
import ComposeEmailSheet from "@/pages/sheets/ComposeEmailSheet.tsx";

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeItemId, setActiveItemId] = useState(
        location.pathname === '/' ? 'dashboard' : location.pathname.substring(1)
    );

    useEffect(() => {
        if (!authenticate()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSidebarItemClick = useCallback((itemId: string) => {
        setActiveItemId(itemId);
        navigate(`/${itemId}`);
    }, [navigate]);

    const navigateTo = useCallback((page: string) => {
        setActiveItemId(page);
        navigate(`/${page}`);
    }, [navigate]);

    const getContent = useCallback(() => {
        switch (activeItemId) {
            case 'dashboard':
                return <DashboardSheet navigateTo={navigateTo}/>;
            case 'files':
                return <FilesSheet navigateTo={navigateTo}/>;
            case 'emails':
                return <EmailsSheet navigateTo={navigateTo}/>;
            case 'upload':
                return <UploadSheet navigateTo={navigateTo}/>;
            case 'compose':
                return <ComposeEmailSheet navigateTo={navigateTo}/>;
            case 'analytics':
                return <p>Analytics content will be displayed here</p>;
            case 'settings':
                return <p>Settings content will be displayed here</p>;
            case 'profile':
                return <p>Profile content will be displayed here</p>;
            default:
                return <p>Invalid content</p>;
        }
    }, [activeItemId, navigateTo]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <SideBar handleActiveItem={handleSidebarItemClick}/>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header pageTitle={activeItemId}/>
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {getContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
