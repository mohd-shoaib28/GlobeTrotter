import React, { useState } from 'react';
import { Compass, Sun, Moon, Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode, isAuthenticated, setAuthModal }) {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 lg:pl-64">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                <div className="flex items-center gap-3 cursor-pointer lg:hidden" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
                        <Compass className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">GlobeTrotter</span>
                </div>
                
                {/* Desktop layout gap filler */}
                <div className="hidden lg:block flex-1">
                    {/* Add a global search bar here if desired later */}
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                    </button>
                    
                    {!isAuthenticated && (
                        <button onClick={() => setAuthModal('login')} className="text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                            Sign In
                        </button>
                    )}

                    {isAuthenticated && (
                        <button 
                            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && isAuthenticated && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-xl">
                    <div className="flex flex-col space-y-2">
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</Link>
                        <Link to="/trips" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">My Trips</Link>
                        <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Search Catalog</Link>
                        <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Community</Link>
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Profile</Link>
                    </div>
                </div>
            )}
        </header>
    );
}