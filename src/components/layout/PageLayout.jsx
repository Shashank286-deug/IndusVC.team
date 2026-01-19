import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function PageLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64 ml-0'}`}>
                <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="pt-16 lg:ml-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
