import React, { useState, useEffect } from 'react';
import { Compass, Calendar, Search, MapPin, Map, ArrowRight, Plus, Loader2, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard({ userId, userName }) {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    // Animation variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const now = new Date();
    const upcomingTrips = trips.filter(t => !t.start_date || new Date(t.start_date) > now).slice(0, 3);
    const ongoingTrips = trips.filter(t => t.start_date && t.end_date && new Date(t.start_date) <= now && new Date(t.end_date) >= now);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

            {/* Dashboard Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white"
            >
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                
                <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> WELCOME BACK
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                        {userName ? `Ready for your next adventure, ${userName}?` : 'Where are we going next?'}
                    </h1>
                    <p className="text-blue-100 max-w-xl text-lg font-medium">
                        You have {trips.length} trips planned so far. Let's make the next one unforgettable.
                    </p>
                </div>

                <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                    <button onClick={() => navigate('/create-trip')} className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" /> Plan New Trip
                    </button>
                    <button onClick={() => navigate('/search')} className="px-8 py-4 bg-blue-700/50 hover:bg-blue-700/70 text-white border border-blue-400/30 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                        <Search className="w-5 h-5" /> Discover Places
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Quick Stats & Ongoing */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: 'Total Trips', val: trips.length, icon: <Map className="text-blue-500" /> },
                                { title: 'Upcoming', val: upcomingTrips.length, icon: <Calendar className="text-emerald-500" /> },
                                { title: 'Ongoing', val: ongoingTrips.length, icon: <Activity className="text-amber-500" /> },
                                { title: 'Saved Places', val: '12', icon: <MapPin className="text-rose-500" /> }
                            ].map((stat, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2">
                                        {stat.icon}
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white">{stat.val}</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Ongoing / Active Trip Highlight */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Journey</h2>
                            </div>
                            
                            {ongoingTrips.length > 0 ? (
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-blue-500 shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => navigate(`/itinerary/${ongoingTrips[0].trip_id}`)}>
                                    <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex justify-between items-start">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 mb-3 animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div> Happening Now
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{ongoingTrips[0].name}</h3>
                                            <p className="text-slate-500 mb-4">{ongoingTrips[0].description}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600">
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 border-dashed text-center">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                        <Compass className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-600 dark:text-slate-400">No active trips right now.</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Upcoming Trips Sidebar */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Trips</h2>
                            <button onClick={() => navigate('/trips')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {upcomingTrips.length > 0 ? (
                                upcomingTrips.map(trip => (
                                    <motion.div 
                                        key={trip.trip_id}
                                        whileHover={{ x: 4 }}
                                        onClick={() => navigate(`/builder/${trip.trip_id}`)}
                                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-colors cursor-pointer group flex gap-4 items-center"
                                    >
                                        <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-blue-600 border border-slate-200 dark:border-slate-700">
                                            <span className="text-xs font-bold uppercase">{new Date(trip.start_date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-black leading-none">{new Date(trip.start_date).getDate() || '--'}</span>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{trip.name}</h4>
                                            <p className="text-xs text-slate-500 truncate">{trip.description || "Get ready to explore!"}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed text-center text-sm font-medium text-slate-500">
                                    Your calendar is empty. Time to plan a vacation!
                                </div>
                            )}
                        </div>
                        
                        {/* Inspiration Widget */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mt-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20">
                                <Compass className="w-32 h-32" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">Need Inspiration?</h3>
                            <p className="text-indigo-100 text-sm mb-4 relative z-10">Check out what other travelers are building in the community hub.</p>
                            <button onClick={() => navigate('/community')} className="w-full py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors relative z-10 shadow-md">
                                Explore Community
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}