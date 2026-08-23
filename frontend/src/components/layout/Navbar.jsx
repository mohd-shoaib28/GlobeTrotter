import React from 'react';
import { Compass, Sun, Moon, Plus, User } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, activeTab, setActiveTab, setAuthModal }) {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
                        <Compass className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">GlobeTrotter</span>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    </button>
                    <button onClick={() => setAuthModal('login')} className="text-sm font-semibold px-4 py-2">Sign In</button>
                </div>

            </div>
        </header>
    );
}