import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, LayoutGrid, Calendar, MapPin, Loader2, Heart, MessageCircle, Share2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Community() {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPublicTrips = async () => {
            try {
                // Not passing token because this should be a public endpoint, 
                // but just in case we pass it if required by the middleware config
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/community', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setTrips(res.data);
            } catch (err) {
                console.error("Failed to fetch community trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicTrips();
    }, []);

    const filteredTrips = trips.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        (t.author_name && t.author_name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-8">Community Hub</h1>

            {/* Toolbar (Screen 10 Requirement) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search community trips or authors..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" /> Group by
                    </button>
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                        <SortAsc className="w-4 h-4" /> Sort by...
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Community tab</h2>

            <div className="space-y-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                    </div>
                ) : filteredTrips.length > 0 ? (
                    filteredTrips.map((trip, idx) => (
                        <motion.div 
                            key={trip.trip_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4 sm:gap-6 items-start"
                        >
                            {/* Avatar Column */}
                            <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-md border-2 border-white dark:border-slate-900 mt-2">
                                {trip.author_name ? trip.author_name.charAt(0).toUpperCase() : 'U'}
                            </div>

                            {/* Content Block */}
                            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500 transition-all overflow-hidden cursor-pointer" onClick={() => navigate(`/itinerary/${trip.trip_id}`)}>
                                <div className="p-6 sm:p-8">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{trip.name}</h3>
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                            {new Date(trip.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4">by {trip.author_name}</p>
                                    
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">
                                        {trip.description || "No description provided for this trip."}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm font-bold text-slate-500 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                            <Heart className="w-4 h-4" /> 24
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                            <MessageCircle className="w-4 h-4" /> 5
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-500 font-medium">
                        No community trips found. Create and share the first one!
                    </div>
                )}
            </div>
        </div>
    );
}
