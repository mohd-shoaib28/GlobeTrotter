import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({ authModal, setAuthModal, onLogin }) {
    if (!authModal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Blurred Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setAuthModal(null)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {authModal === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button
                            onClick={() => setAuthModal(null)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {authModal === 'signup' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input type="text" placeholder="John Doe" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors" />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                            <input type="email" placeholder="you@example.com" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Account Password</label>
                            <input type="password" placeholder="••••••••" className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm outline-none focus:border-blue-500 transition-colors" />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onLogin}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20"
                    >
                        {authModal === 'login' ? 'Sign In Securely' : 'Sign Up Free'}
                    </motion.button>

                    <p className="text-center text-xs text-slate-500">
                        {authModal === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            {authModal === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}