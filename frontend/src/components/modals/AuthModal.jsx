import React, { useState } from 'react';
import { X, Camera, MapPin, Phone, Mail, User, Shield, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function AuthModal({ authModal, setAuthModal, onLogin }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login Fields
    const [username, setUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Registration Fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [password, setPassword] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');

    if (!authModal) return null;

    const isLogin = authModal === 'login';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email: username, password: loginPassword });
            onLogin(res.data.user_id, res.data.token, res.data.name);
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Note: Our backend currently only strictly requires name, email, password.
            // In a full production app, we would send all fields to the backend.
            const fullName = `${firstName} ${lastName}`.trim();
            await axios.post('http://localhost:5000/api/auth/signup', { 
                name: fullName, 
                email, 
                password 
                // firstName, lastName, phone, city, country, additionalInfo would be sent here
            });
            // Automatically log them in after signup
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            onLogin(loginRes.data.user_id, loginRes.data.token, loginRes.data.name);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setAuthModal(isLogin ? 'signup' : 'login');
        setError('');
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setAuthModal(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`relative w-full ${isLogin ? 'max-w-md' : 'max-w-2xl'} bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
                >
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 flex items-center justify-between z-10 relative">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {isLogin ? 'Sign in to manage your trips' : 'Join GlobeTrotter today'}
                            </p>
                        </div>
                        <button
                            onClick={() => setAuthModal(null)}
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-8 pb-8 overflow-y-auto custom-scrollbar relative z-10">
                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex items-start gap-3">
                                <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">{error}</span>
                            </div>
                        )}

                        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                            
                            {/* Profile Photo Upload UI (Mockup for both screens) */}
                            <div className="flex justify-center mb-8">
                                <div className="relative group cursor-pointer">
                                    <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                                        <User className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {isLogin ? (
                                /* Login Fields */
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email / Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Shield className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <input 
                                                type="password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Authenticating...' : 'Sign In Securely'} <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                /* Registration Fields */
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">First Name</label>
                                            <input 
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                placeholder="John"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Last Name</label>
                                            <input 
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                placeholder="Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Email Address</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">City</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input 
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                    placeholder="New York"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Country</label>
                                            <input 
                                                type="text"
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value)}
                                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                placeholder="United States"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Shield className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <input 
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium"
                                                placeholder="Create a strong password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Additional Information</label>
                                        <textarea 
                                            value={additionalInfo}
                                            onChange={(e) => setAdditionalInfo(e.target.value)}
                                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-all font-medium resize-none"
                                            placeholder="Tell us a bit about your travel preferences..."
                                            rows="3"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Processing...' : 'Create Account'}
                                    </button>
                                </div>
                            )}
                        </form>

                        {/* Toggle Screen Button */}
                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                            <button
                                type="button"
                                onClick={toggleMode}
                                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {isLogin ? (
                                    <>Need an account? <span className="text-blue-600">Register now</span></>
                                ) : (
                                    <><ArrowLeft className="w-4 h-4" /> Back to Login</>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}