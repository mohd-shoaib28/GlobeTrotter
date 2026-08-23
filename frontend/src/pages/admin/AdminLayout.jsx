import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Map, LogOut } from 'lucide-react';

export default function AdminLayout({ handleLogout }) {
    const navigate = useNavigate();
    
    const adminLinks = [
        { path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
        { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Manage Users' },
        { path: '/admin/trips', icon: <Map className="w-5 h-5" />, label: 'All Trips' },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 dark:bg-slate-900 text-white flex flex-col hidden lg:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        GlobeTrotter <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 uppercase tracking-widest text-white ml-2">Admin</span>
                    </span>
                </div>
                
                <div className="flex-1 py-6 px-4 space-y-1">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Management</div>
                    {adminLinks.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                                    isActive 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={() => {
                            handleLogout();
                            navigate('/');
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-semibold text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 relative">
                <Outlet />
            </main>
        </div>
    );
}
