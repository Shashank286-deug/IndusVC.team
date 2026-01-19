import { Search, Bell, User, Menu } from 'lucide-react';

export default function TopBar({ onMenuClick }) {
    return (
        <div className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-40 transition-all duration-300">

            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 mr-2 text-slate-400 hover:text-white"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search assets, documents... (⌘K)"
                        className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indus-500/50 focus:border-indus-500"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-800 rounded-md transition-colors">
                    <Bell size={20} className="text-slate-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-indus-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-3 hover:bg-slate-800 rounded-md px-3 py-2 transition-colors">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-200">Analyst</span>
                        <span className="text-xs text-slate-400">Senior Portfolio Manager</span>
                    </div>
                    <div className="w-8 h-8 bg-indus-500 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                </button>
            </div>
        </div>
    );
}
