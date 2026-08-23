import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Search, Users, User, Settings, LogOut, CalendarDays } from 'lucide-react';

export default function Sidebar({ handleLogout }) {
    const navItems = [
        { path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { path: '/trips', icon: <Map className="w-5 h-5" />, label: 'My Trips' },
        { path: '/calendar', icon: <CalendarDays className="w-5 h-5" />, label: 'Calendar' },
        { path: '/search', icon: <Search className="w-5 h-5" />, label: 'Search Catalog' },
        { path: '/community', icon: <Users className="w-5 h-5" />, label: 'Community' },
        { path: '/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden lg:flex">
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">GlobeTrotter</span>
            </div>
            
            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                                isActive 
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
